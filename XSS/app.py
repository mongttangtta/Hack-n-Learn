# app.py
# 교육용 로컬 전용 샘플 애플리케이션
# (ReverseProxied 통합, SQLi 방어, post에서 flag 제공)
from flask import Flask, request, render_template, g, session, redirect, url_for, flash
import sqlite3
import os
import secrets

DB = "vuln_bank.db"

# ------------------ Reverse proxy helper ------------------
class ReverseProxied:
    """
    WSGI middleware that adjusts SCRIPT_NAME and PATH_INFO based on the
    X-Script-Name header set by a reverse proxy. Use only when the proxy
    is trusted to provide this header.
    """
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

# wrap WSGI app with middleware
app.wsgi_app = ReverseProxied(app.wsgi_app)

# app configuration
app.secret_key = secrets.token_hex(16)
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
    """초기 DB / 샘플 데이터 생성 (교육용)"""
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
    CREATE TABLE IF NOT EXISTS flags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        flag TEXT
    );
    """)
    # seed users (if not existing)
    try:
        cur.execute(
            "INSERT INTO users (username, password, display_name, balance) VALUES (?,?,?,?)",
            ("admin", "admin123", "Administrator", 100000),
        )
        cur.execute(
            "INSERT INTO users (username, password, display_name, balance) VALUES (?,?,?,?)",
            ("alice", "alice123", "Alice", 5000),
        )
        cur.execute(
            "INSERT INTO users (username, password, display_name, balance) VALUES (?,?,?,?)",
            ("bob", "bob123", "Bob", 2000),
        )
    except sqlite3.IntegrityError:
        pass

    # seed posts: 공지/자유 게시물 (자유게시판 샘플은 이미지 내용과 동일하게 설정)
    cur.execute("DELETE FROM posts")
    sample_posts = [
        # notices
        ("notice", "시스템 점검 내역(예시)", "관리자", "시스템 점검이 완료되었습니다. 기록은 별도 보관됩니다."),
        ("notice", "중요: 운영시간 안내", "관리자", "운영시간은 평일 09:00 - 18:00 입니다."),
        ("notice", "DB 초기화 방법", "관리자", "python init_db.py 명령으로 초기화할 수 있습니다."),
        ("notice", "서버 이용 안내", "관리자", "이 서버는 교육용 실습 환경입니다. 외부에 공개하지 마세요."),
        # free (이미지에 보이는 항목)
        ("free", "버그 제보", "bob", "홈 화면에서 간혹 스타일이 깨지는 문제 발견했습니다."),
        ("free", "로그인 성공했어요", "alice", "계좌 확인 기능까지 잘 됩니다."),
        ("free", "XSS는 다음 주에 실습하나요?", "bob", "Cross Site Scripting도 기대돼요."),
        ("free", "오늘 실습 재밌네요!", "alice", "SQL Injection 구조를 직접 보니까 이해가 잘 돼요.")
    ]
    cur.executemany("INSERT INTO posts (board, title, author, content) VALUES (?,?,?,?)", sample_posts)

    # seed flag if not exists (초기값)
    try:
        cur.execute("SELECT count(*) FROM flags")
        cnt = cur.fetchone()[0]
    except Exception:
        cnt = 0
    if cnt == 0:
        try:
            # 기본 플래그 (원하시면 여기 값을 바꿔주세요)
            cur.execute("INSERT INTO flags (flag) VALUES (?)", ("FLAG{JABATDA_YO_NOM}",))
        except Exception:
            pass

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
    notices_rows = db.execute("SELECT * FROM posts WHERE board=? ORDER BY id DESC LIMIT 5", ("notice",)).fetchall()
    frees_rows = db.execute("SELECT * FROM posts WHERE board=? ORDER BY id DESC LIMIT 5", ("free",)).fetchall()
    notices = rows_to_dicts(notices_rows)
    frees = rows_to_dicts(frees_rows)
    return render_template("home.html", notices=notices, frees=frees)

# ------------------ 로그인/로그아웃 ------------------
@app.route("/login", methods=["GET","POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username","").strip()
        password = request.form.get("password","")
        db = get_db()
        cur = db.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
        user_row = cur.fetchone()
        user = row_to_dict(user_row)
        if user:
            session.clear()
            session["username"] = user["username"]
            session["csrf_token"] = secrets.token_hex(16)
            flash("로그인되었습니다.", "success")
            return redirect(url_for("index"))
        else:
            flash("아이디 또는 비밀번호가 틀렸습니다.", "error")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    flash("로그아웃되었습니다.", "info")
    return redirect(url_for("index"))

# ------------------ 게시판 (SQL Injection 방어) ------------------
@app.route("/board/<board>", methods=["GET","POST"])
def board(board):
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))

    db = get_db()
    title = "공지사항" if board == "notice" else "자유게시판"

    q = ""
    posts_rows = db.execute("SELECT * FROM posts WHERE board=? ORDER BY id DESC", (board,)).fetchall()

    # 안전한 검색 (LIKE 기반)
    if request.method == "POST":
        q = request.form.get("q", "").strip()
        if q:
            like_q = f"%{q}%"
            posts_rows = db.execute(
                "SELECT * FROM posts WHERE board=? AND (title LIKE ? OR content LIKE ?) ORDER BY id DESC",
                (board, like_q, like_q)
            ).fetchall()

    posts = rows_to_dicts(posts_rows)
    return render_template("board.html", board=board, posts=posts, title=title, q=q)

# ------------------ 단일 포스트 보기 ------------------
@app.route("/post/<int:post_id>")
def post(post_id):
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))
    db = get_db()
    row = db.execute("SELECT * FROM posts WHERE id=?", (post_id,)).fetchone()
    post = row_to_dict(row)
    if not post:
        return "글을 찾을 수 없습니다."

    # CTF용: flags 테이블에서 플래그를 가져와 템플릿에 전달
    flag_row = db.execute("SELECT flag FROM flags LIMIT 1").fetchone()
    flag = flag_row["flag"] if flag_row else ""

    return render_template("post.html", post=post, flag=flag)

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
        if board != "notice":
            board = "free"
        if board == "notice" and session.get("username") != "admin":
            board = "free"

        title = request.form.get("title","").strip()
        content = request.form.get("content","").strip()
        author = session.get("username")
        if not title:
            flash("제목을 입력하세요.", "warning")
            return redirect(url_for("write"))

        db = get_db()
        db.execute("INSERT INTO posts (board, title, author, content) VALUES (?,?,?,?)",
                   (board, title, author, content))
        db.commit()
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

    def is_author_admin_variant(author_value):
        if not author_value:
            return False
        a = str(author_value).strip().lower()
        return a in ("admin", "administrator") or author_value in ("관리자", "Admin", "관리자님")

    if requester == post.get("author") or requester == "admin" or is_author_admin_variant(post.get("author")):
        db.execute("DELETE FROM posts WHERE id=?", (post_id,))
        db.commit()
        flash("글이 삭제되었습니다.", "success")
        return redirect(url_for("board", board=post.get("board","free")))
    else:
        app.logger.debug(f"DELETE denied: requester={requester}, post_author={post.get('author')}")
        flash("삭제 권한이 없습니다.", "error")
        return redirect(url_for("board", board=post.get("board","free")))

# ------------------ 계좌 ------------------
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
        cur = db.execute("SELECT * FROM users WHERE username = ?", (sender,))
        s_row = cur.fetchone()
        s = row_to_dict(s_row)
        cur = db.execute("SELECT * FROM users WHERE username = ?", (receiver,))
        r_row = cur.fetchone()
        r = row_to_dict(r_row)
        if not r:
            return render_template("result.html", success=False, msg="수신자 없음")
        if amount <= 0 or s["balance"] < amount:
            return render_template("result.html", success=False, msg="잔액 부족 또는 입력 오류")
        db.execute("UPDATE users SET balance = balance - ? WHERE username = ?", (amount, sender))
        db.execute("UPDATE users SET balance = balance + ? WHERE username = ?", (amount, receiver))
        db.commit()
        return render_template("result.html", success=True, msg=f"{receiver}에게 {amount}원 송금 완료")
    else:
        csrf = session.get("csrf_token","")
        return render_template("transfer.html", sender=sender, csrf=csrf)

# ------------------ 실행 ------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

