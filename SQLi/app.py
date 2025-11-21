# app.py
# 교육용 로컬 전용 샘플 애플리케이션 (SQLi 실습용) + 이벤트 로깅(JSONL 4필드)
from flask import Flask, request, render_template, g, session, redirect, url_for, flash
import sqlite3
import os
import secrets
import json
import threading
import re
from datetime import datetime, timezone

DB = "vuln_bank.db"

# ------------------ Event logging (JSON lines) ------------------
EVENT_DIR = os.environ.get("EVENT_DIR", "./data")
EVENT_FILE = os.path.join(EVENT_DIR, os.environ.get("EVENT_FILE", "events.json"))
os.makedirs(EVENT_DIR, exist_ok=True)

# 앱 시작 시 로그 파일 초기화 (기본: 초기화)
if os.environ.get("EVENT_CLEAR_ON_START", "1") == "1":
    try:
        with open(EVENT_FILE, "w", encoding="utf-8") as f:
            pass
    except Exception as e:
        print(f"Warning: failed to clear event file {EVENT_FILE}: {e}")

_write_lock = threading.Lock()
_MAX_PAYLOAD_LEN = int(os.environ.get("EVENT_MAX_PAYLOAD", "200"))
_FLAG_RE = re.compile(r"(FLAG\s*\{)[^\}]*\}", re.IGNORECASE)

def _now_iso():
    return datetime.utcnow().replace(tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")

def _mask_payload(s):
    if not s:
        return ""
    masked = _FLAG_RE.sub(r"\1***\}", s)
    if len(masked) > _MAX_PAYLOAD_LEN:
        return masked[:_MAX_PAYLOAD_LEN]
    return masked

def record_event(action, payload="", result=""):
    """
    기록 필드: ts, action, payload, result
    - page_view는 기록하지 않음.
    """
    if action == "page_view":
        return
    evt = {
        "ts": _now_iso(),
        "action": str(action) if action else "",
        "payload": _mask_payload(str(payload) if payload else ""),
        "result": str(result) if result else ""
    }
    line = json.dumps(evt, ensure_ascii=False, separators=(",", ":"))
    with _write_lock:
        with open(EVENT_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")

# ------------------ Reverse proxy helper ------------------
class ReverseProxied:
    def __init__(self, app):
        self.app = app
    def __call__(self, environ, start_response):
        script_name = environ.get('HTTP_X_SCRIPT_NAME', '')
        if script_name:
            environ['SCRIPT_NAME'] = script_name
            path_info = environ.get('PATH_INFO', '')
            if path_info.startswith(script_name):
                environ['PATH_INFO'] = path_info[len(script_name):]
        return self.app(environ, start_response)

# ------------------ Flask app creation ------------------
app = Flask(
    __name__,
    static_folder='static',
    static_url_path='/static',
    template_folder='templates'
)
app.wsgi_app = ReverseProxied(app.wsgi_app)

# ======== SECRET_KEY 초기화 ========
SECRET_KEY = os.environ.get("SECRET_KEY")
if SECRET_KEY:
    app.secret_key = SECRET_KEY
else:
    SECRET_FILE = os.path.join(EVENT_DIR, "secret.key")
    try:
        if os.path.exists(SECRET_FILE):
            with open(SECRET_FILE, "r", encoding="utf-8") as sf:
                SECRET_KEY = sf.read().strip()
        else:
            SECRET_KEY = secrets.token_hex(32)
            with open(SECRET_FILE, "w", encoding="utf-8") as sf:
                sf.write(SECRET_KEY)
            try:
                os.chmod(SECRET_FILE, 0o600)
            except Exception:
                pass
    except Exception as e:
        print(f"WARNING: {e}")
        SECRET_KEY = SECRET_KEY or "dev-insecure-key"

    app.secret_key = SECRET_KEY

app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
)
app.config["TEMPLATES_AUTO_RELOAD"] = True

# ------------------ DB helper ------------------
def get_db():
    db = getattr(g, "_db", None)
    if db is None:
        need_init = not os.path.exists(DB)
        db = g._db = sqlite3.connect(DB, check_same_thread=False)
        db.row_factory = sqlite3.Row
        if need_init:
            init_db(db)
    return db

@app.teardown_appcontext
def close_db(e=None):
    db = getattr(g, "_db", None)
    if db is not None:
        db.close()

def init_db(db_conn):
    cur = db_conn.cursor()
    cur.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        display_name TEXT,
        balance INTEGER DEFAULT 1000
    );
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        board TEXT,
        title TEXT,
        author TEXT,
        content TEXT
    );
    CREATE TABLE IF NOT EXISTS flags (id INTEGER PRIMARY KEY AUTOINCREMENT, flag TEXT);
    """)
    # seed users
    try:
        cur.execute("INSERT INTO users (username,password,display_name,balance) VALUES (?,?,?,?)", ("admin","admin123","Administrator",100000))
        cur.execute("INSERT INTO users (username,password,display_name,balance) VALUES (?,?,?,?)", ("alice","alice123","Alice",5000))
        cur.execute("INSERT INTO users (username,password,display_name,balance) VALUES (?,?,?,?)", ("bob","bob123","Bob",2000))
    except sqlite3.IntegrityError:
        pass

    cur.execute("DELETE FROM posts")
    sample_posts = [
        ("notice","시스템 점검 완료 안내","관리자","정기 점검이 정상적으로 완료되었습니다."),
        ("notice","영업시간 안내","관리자","창구 영업시간이 평일 09:00~17:30으로 변경되었습니다."),
        ("free","계좌 등록 문의","alice","새 카드로 계좌 등록 가능한가요?"),
        ("free","이체 한도 문의","bob","모바일 하루 이체 한도가 어떻게 되나요?")
    ]
    cur.executemany("INSERT INTO posts (board,title,author,content) VALUES (?,?,?,?)", sample_posts)

    cur.execute("SELECT count(*) FROM flags")
    cnt = cur.fetchone()[0] if cur.fetchone else 0
    if cnt == 0:
        cur.execute("INSERT INTO flags (flag) VALUES (?)", ("FLAG{HackAndLearn}",))
    db_conn.commit()

# ------------------ util ------------------
def rows_to_dicts(rows):
    return [dict(r) for r in rows] if rows else []

def row_to_dict(row):
    return dict(row) if row else None

# ------------------ 홈 ------------------
@app.route("/")
def index():
    db = get_db()
    notices_rows = db.execute(
        "SELECT * FROM posts WHERE board=? ORDER BY id DESC LIMIT 5", ("notice",)
    ).fetchall()
    frees_rows = db.execute(
        "SELECT * FROM posts WHERE board=? ORDER BY id DESC LIMIT 5", ("free",)
    ).fetchall()
    notices = rows_to_dicts(notices_rows)
    frees = rows_to_dicts(frees_rows)
    return render_template("home.html", notices=notices, frees=frees)

# ------------------ 로그인/로그아웃 ------------------
@app.route("/login", methods=["GET","POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username","").strip()
        record_event("login_attempt", username, "")
        password = request.form.get("password","")
        db = get_db()
        user = row_to_dict(db.execute("SELECT * FROM users WHERE username=? AND password=?", (username,password)).fetchone())
        if user:
            session.clear()
            session["username"] = user["username"]
            session["csrf_token"] = secrets.token_hex(16)
            record_event("login_success", username, "success")
            flash("로그인되었습니다.", "success")
            return redirect(url_for("index"))
        else:
            record_event("login_fail", username, "fail")
            flash("아이디 또는 비밀번호가 틀렸습니다.", "error")
    return render_template("login.html")

@app.route("/logout")
def logout():
    record_event("logout", session.get("username","guest"), "")
    session.clear()
    flash("로그아웃되었습니다.", "info")
    return redirect(url_for("index"))

# ------------------ 게시판 ------------------
@app.route("/board/<board>", methods=["GET","POST"])
def board(board):
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))
    db = get_db()
    title = "공지사항" if board == "notice" else "자유게시판"
    posts = rows_to_dicts(
        db.execute("SELECT * FROM posts WHERE board=? ORDER BY id DESC", (board,)).fetchall()
    )
    q = ""
    if request.method == "POST":
        q = request.form.get("q","")
        record_event("search_query", q, "")
        if q:
            try:
                vulnerable_sql = f"""
                    SELECT * FROM posts
                    WHERE board='{board}' AND ({q})
                    ORDER BY id DESC
                """
                posts = rows_to_dicts(db.execute(vulnerable_sql).fetchall())
            except:
                posts = []
                flash("검색 중 오류 발생.", "error")
    return render_template("board.html", board=board, posts=posts, title=title, q=q)

# ------------------ 포스트 보기 ------------------
@app.route("/post/<int:post_id>")
def post(post_id):
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))
    db = get_db()
    post = row_to_dict(db.execute("SELECT * FROM posts WHERE id=?", (post_id,)).fetchone())
    if not post:
        return "글을 찾을 수 없습니다."
    record_event("post_view", str(post_id), "")
    return render_template("post.html", post=post)

# ------------------ 글쓰기 ------------------
@app.route("/write", methods=["GET","POST"])
def write():
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))
    if request.method == "POST":
        form_token = request.form.get("csrf_token","")
        if not form_token or form_token != session.get("csrf_token"):
            flash("CSRF token missing or invalid.", "error")
            return redirect(url_for("write"))
        board = request.form.get("board","free")
        if board == "notice" and session["username"] != "admin":
            board = "free"
        title = request.form.get("title","").strip()
        content = request.form.get("content","").strip()
        author = session["username"]
        if not title:
            flash("제목을 입력하세요.", "warning")
            return redirect(url_for("write"))
        db = get_db()
        db.execute("INSERT INTO posts (board,title,author,content) VALUES (?,?,?,?)", (board,title,author,content))
        db.commit()
        record_event("submit_post", content, "created")
        flash("글이 등록되었습니다.", "success")
        return redirect(url_for("board", board=board))
    return render_template("write.html")

# ------------------ 삭제 ------------------
@app.route("/delete/<int:post_id>", methods=["POST"])
def delete(post_id):
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))
    form_token = request.form.get("csrf_token","")
    if not form_token or form_token != session.get("csrf_token"):
        flash("CSRF token missing or invalid.", "error")
        return redirect(url_for("index"))
    db = get_db()
    row = db.execute("SELECT * FROM posts WHERE id=?", (post_id,)).fetchone()
    post = row_to_dict(row)
    if not post:
        flash("삭제할 글을 찾을 수 없습니다.", "error")
        return redirect(url_for("index"))
    requester = session.get("username")
    if requester == post.get("author") or requester == "admin":
        db.execute("DELETE FROM posts WHERE id=?", (post_id,))
        db.commit()
        flash("글이 삭제되었습니다.", "success")
        record_event("delete_post", str(post_id), "deleted")
        return redirect(url_for("board", board=post.get("board","free")))
    else:
        flash("삭제 권한이 없습니다.", "error")
        record_event("delete_post_denied", str(post_id), "denied")
        return redirect(url_for("board", board=post.get("board","free")))

# ------------------ 계좌 (템플릿 적용된 버전 — 수정 완료) ------------------
@app.route("/account")
def account():
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))

    username = session["username"]
    db = get_db()
    cur = db.execute("SELECT * FROM users WHERE username=?", (username,))
    user_row = cur.fetchone()
    user = row_to_dict(user_row)

    if not user:
        flash("사용자를 찾을 수 없습니다.", "error")
        return redirect(url_for("index"))

    record_event("account_view", "", "")

    # 여기 수정됨: 문자열 리턴 → 템플릿 렌더링
    return render_template("account.html", user=user)

# ------------------ 송금 ------------------
@app.route("/transfer", methods=["GET","POST"])
def transfer():
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))
    db = get_db()
    sender = session["username"]
    if request.method == "POST":
        form_token = request.form.get("csrf_token","")
        if not form_token or form_token != session.get("csrf_token"):
            return render_template("result.html", success=False, msg="CSRF token missing or invalid.")
        receiver = request.form.get("receiver","").strip()
        try:
            amount = int(request.form.get("amount","0"))
        except:
            amount = 0

        record_event("transfer_attempt", f"{receiver}:{amount}", "")

        cur = db.execute("SELECT * FROM users WHERE username = ?", (sender,))
        s_row = cur.fetchone()
        s = row_to_dict(s_row)
        cur = db.execute("SELECT * FROM users WHERE username = ?", (receiver,))
        r_row = cur.fetchone()
        r = row_to_dict(r_row)

        if not r:
            record_event("transfer_attempt", f"{receiver}:{amount}", "receiver_not_found")
            return render_template("result.html", success=False, msg="수신자 없음")
        if amount <= 0 or s["balance"] < amount:
            record_event("transfer_attempt", f"{receiver}:{amount}", "insufficient_funds")
            return render_template("result.html", success=False, msg="잔액 부족 또는 입력 오류")

        db.execute("UPDATE users SET balance = balance - ? WHERE username = ?", (amount, sender))
        db.execute("UPDATE users SET balance = balance + ? WHERE username = ?", (amount, receiver))
        db.commit()

        record_event("transfer_attempt", f"{receiver}:{amount}", "success")
        return render_template("result.html", success=True, msg=f"{receiver}에게 {amount}원 송금 완료")

    else:
        csrf = session.get("csrf_token","")
        return render_template("transfer.html", sender=sender, csrf=csrf)

# ------------------ 실행 ------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
