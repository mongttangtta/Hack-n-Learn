# app.py
# HallymBank CSRF 실습용 (SQLi 제거 + 이벤트 로깅)

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
    return (
        datetime.utcnow()
        .replace(tzinfo=timezone.utc)
        .isoformat()
        .replace("+00:00", "Z")
    )


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
            "result": str(result) if result else "",
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
        script_name = environ.get("HTTP_X_SCRIPT_NAME", "")
        if script_name:
            environ["SCRIPT_NAME"] = script_name
            path_info = environ.get("PATH_INFO", "")
            if path_info.startswith(script_name):
                environ["PATH_INFO"] = path_info[len(script_name) :]
        return self.app(environ, start_response)


# ------------------ Flask app creation ------------------
app = Flask(
    __name__,
    static_folder="static",
    static_url_path="/static",
    template_folder="templates",
)
app.wsgi_app = ReverseProxied(app.wsgi_app)

# ======== SECRET_KEY (고정: 서버 재시작해도 세션 유지되게) ========
app.secret_key = "csrf-practice-key"
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)

app.config["TEMPLATES_AUTO_RELOAD"] = True

# ✅ 프로필 이미지 저장 폴더 (추가)
UPLOAD_FOLDER = os.path.join("static", "profile")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ------------------ 프로필 이미지 lookup helper ------------------
@app.context_processor
def inject_profile_lookup():
    def user_profile_image(username):
        if not username:
            return None
        db = get_db()
        row = db.execute(
            "SELECT profile_image FROM users WHERE username=?",
            (username,),
        ).fetchone()
        if row and row["profile_image"]:
            return row["profile_image"]
        return None
    return dict(user_profile_image=user_profile_image)







# ------------------ DB helper ------------------
def get_db():
    db = getattr(g, "_db", None)
    if db is None:
        need_init = not os.path.exists(DB)
        db = g._db = sqlite3.connect(DB, check_same_thread=False)
        db.row_factory = sqlite3.Row
        # DB가 없으면 최소 스키마만 생성 (FLAG/데이터는 init_db.py로 넣는 것을 권장)
        if need_init:
            cur = db.cursor()
            cur.executescript(
                """
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
                """
            )
            db.commit()

        # ✅ 기존/신규 DB 모두에 profile_image 컬럼 존재하도록 시도
        try:
            db.execute("ALTER TABLE users ADD COLUMN profile_image TEXT")
            db.commit()
        except Exception:
            # 이미 컬럼이 있거나, ALTER 실패해도 그냥 진행
            pass

    return db


@app.teardown_appcontext
def close_db(e=None):
    db = getattr(g, "_db", None)
    if db is not None:
        db.close()


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
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        record_event("login_attempt", username, "")

        db = get_db()
        user = row_to_dict(
            db.execute(
                "SELECT * FROM users WHERE username=? AND password=?",
                (username, password),
            ).fetchone()
        )
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
    record_event("logout", session.get("username", "guest"), "")
    session.clear()
    flash("로그아웃되었습니다.", "info")
    return redirect(url_for("index"))


# ------------------ 게시판 ------------------
@app.route("/board/<board>", methods=["GET", "POST"])
def board(board):
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))

    db = get_db()
    title = "공지사항" if board == "notice" else "자유게시판"

    q = ""
    if request.method == "POST" and board == "notice":
        # 안전한 검색 (SQLi 제거)
        q = request.form.get("q", "").strip()
        record_event("search_query", q, "")
        if q:
            like = f"%{q}%"
            rows = db.execute(
                """
                SELECT * FROM posts
                WHERE board=? AND (title LIKE ? OR content LIKE ?)
                ORDER BY id DESC
                """,
                (board, like, like),
            ).fetchall()
        else:
            rows = db.execute(
                "SELECT * FROM posts WHERE board=? ORDER BY id DESC", (board,)
            ).fetchall()
    else:
        rows = db.execute(
            "SELECT * FROM posts WHERE board=? ORDER BY id DESC", (board,)
        ).fetchall()

    posts = rows_to_dicts(rows)
    return render_template("board.html", board=board, posts=posts, title=title, q=q)


# ------------------ 포스트 보기 ------------------
@app.route("/post/<int:post_id>")
def post(post_id):
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))

    db = get_db()
    post_row = db.execute("SELECT * FROM posts WHERE id=?", (post_id,)).fetchone()
    post = row_to_dict(post_row)
    if not post:
        return "글을 찾을 수 없습니다."

    record_event("post_view", str(post_id), "")
    return render_template("post.html", post=post)


# ------------------ 글쓰기 ------------------
@app.route("/write", methods=["GET", "POST"])
def write():
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))

    if request.method == "POST":
        form_token = request.form.get("csrf_token", "")
        if not form_token or form_token != session.get("csrf_token"):
            flash("CSRF token missing or invalid.", "error")
            return redirect(url_for("write"))

        board = request.form.get("board", "free")
        if board == "notice" and session["username"] != "admin":
            board = "free"

        title = request.form.get("title", "").strip()
        content = request.form.get("content", "").strip()
        author = session["username"]

        if not title:
            flash("제목을 입력하세요.", "warning")
            return redirect(url_for("write"))

        db = get_db()
        db.execute(
            "INSERT INTO posts (board,title,author,content) VALUES (?,?,?,?)",
            (board, title, author, content),
        )
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

    form_token = request.form.get("csrf_token", "")
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
        return a in ("admin", "administrator") or author_value in (
            "관리자",
            "Admin",
            "관리자님",
        )

    if (
        requester == post.get("author")
        or requester == "admin"
        or is_author_admin_variant(post.get("author"))
    ):
        db.execute("DELETE FROM posts WHERE id=?", (post_id,))
        db.commit()
        record_event("delete_post", str(post_id), "deleted")
        flash("글이 삭제되었습니다.", "success")
        return redirect(url_for("board", board=post.get("board", "free")))
    else:
        record_event("delete_post_denied", str(post_id), "denied")
        flash("삭제 권한이 없습니다.", "error")
        return redirect(url_for("board", board=post.get("board", "free")))


# ------------------ 계좌 ------------------
@app.route("/account")
def account():
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))

    username = session["username"]
    db = get_db()
    user_row = db.execute("SELECT * FROM users WHERE username=?", (username,)).fetchone()
    user = row_to_dict(user_row)
    if not user:
        flash("사용자를 찾을 수 없습니다.", "error")
        return redirect(url_for("index"))

    record_event("account_view", username, "")

    return render_template("account.html", user=user)



@app.route("/profile", methods=["GET", "POST"])
def profile():
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))

    username = session["username"]
    db = get_db()

    if request.method == "POST":
        f = request.files.get("photo")
        raw_name = request.form.get("filename", "").strip()

        # 파일 선택 안 했을 때
        if not f or f.filename == "":
            return render_template(
                "profile.html",
                user={"username": username, "profile_image": None},
                error="사진을 업로드 하세요."
            )

        # 사용자가 입력한 파일명이 있으면 그걸 그대로 사용 (취약점 포인트)
        # 없으면 원래 파일 이름 사용
        filename = raw_name if raw_name else f.filename

        # 평소엔 static/profile 밑에 저장 시도
        save_path = os.path.join("static", "profile", filename)

        # 중간 디렉토리가 없어도 에러 안 나게, 실패해도 그냥 무시
        try:
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            f.save(save_path)
        except Exception as e:
            # 여기서 에러 떠도 그냥 지나감 (중요한 건 DB에 filename이 들어가는 것)
            print("[profile] save error:", e)

        # ★ DB에는 사용자가 입력한 filename 그대로 저장
        db.execute(
            "UPDATE users SET profile_image=? WHERE username=?",
            (filename, username),
        )
        db.commit()

        flash("프로필이 변경되었습니다.", "success")
        return redirect(url_for("profile"))

    # GET: 현재 프로필 정보
    row = db.execute(
        "SELECT username, display_name, profile_image FROM users WHERE username=?",
        (username,),
    ).fetchone()
    user = row_to_dict(row) if row else {"username": username, "profile_image": None}

    return render_template("profile.html", user=user, error=None)

#-----------------view-file 라우트-------
from flask import Response
from urllib.parse import unquote
import os

@app.route("/view-file/<path:filename>")
def view_file(filename):
    # URL decode 두 번 — 매우 중요 (브라우저 + Flask 처리)
    filename = unquote(unquote(filename))

    # ✅ 정상 업로드 디렉토리를 기준으로 DT 유발
    BASE_DIR = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "static", "profile")
    )

    # ✅ 사용자 입력 경로 그대로 join (취약점)
    target = os.path.abspath(os.path.join(BASE_DIR, filename))

    # ✅ 파일이 존재해야만 계속
    if not os.path.exists(target):
        return "파일을 찾을 수 없습니다.", 404

    # ✅ 이미지면 렌더링
    if filename.lower().endswith((".png", ".jpg", ".jpeg", ".gif", ".webp")):
        with open(target, "rb") as f:
            data = f.read()
        ext = filename.split(".")[-1]
        return Response(data, mimetype=f"image/{ext}")

    # ✅ 나머지는 텍스트 — FLAG 노출 목적
    with open(target, "r", encoding="utf-8", errors="ignore") as f:
        data = f.read()

    return f"<pre>{data}</pre>"




# ------------------ 송금 (CSRF 실습 포인트 → 패치된 버전) ------------------
@app.route("/transfer", methods=["GET", "POST"])
def transfer():
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))

    db = get_db()
    sender = session["username"]

    if request.method == "POST":
        receiver = request.form.get("receiver", "").strip()
        try:
            amount = int(request.form.get("amount", "0"))
        except Exception:
            amount = 0

        form_token = request.form.get("csrf_token", "")

        # ✅ CSRF 토큰 검증을 송금 처리 전에 강제
        if not form_token or form_token != session.get("csrf_token"):
            record_event(
                "transfer_fail",
                f"{sender}->{receiver}:{amount}",
                "csrf_token_missing_or_invalid",
            )
            return render_template(
                "result.html",
                success=False,
                msg="CSRF token missing or invalid.",
            )

        s_row = db.execute("SELECT * FROM users WHERE username=?", (sender,)).fetchone()
        r_row = db.execute(
            "SELECT * FROM users WHERE username=?", (receiver,)
        ).fetchone()
        s = row_to_dict(s_row)
        r = row_to_dict(r_row)

        if not r:
            record_event(
                "transfer_fail",
                f"{sender}->{receiver}:{amount}",
                "receiver_not_found",
            )
            return render_template(
                "result.html", success=False, msg="수신자 없음"
            )

        if amount <= 0 or s["balance"] < amount:
            record_event(
                "transfer_fail",
                f"{sender}->{receiver}:{amount}",
                "insufficient_funds",
            )
            return render_template(
                "result.html",
                success=False,
                msg="잔액 부족 또는 입력 오류",
            )

        # ✅ 실제 송금 (정상 경로에서만 실행)
        db.execute(
            "UPDATE users SET balance = balance - ? WHERE username=?",
            (amount, sender),
        )
        db.execute(
            "UPDATE users SET balance = balance + ? WHERE username=?",
            (amount, receiver),
        )
        db.commit()

        # ✅ 정상 송금 이벤트
        record_event(
            "transfer_success",
            f"{sender}->{receiver}:{amount}",
            "normal",
        )
        return render_template(
            "result.html",
            success=True,
            msg=f"{receiver}에게 {amount}원 정상 송금 완료",
        )

    else:
        csrf = session.get("csrf_token", "")
        return render_template("transfer.html", sender=sender, csrf=csrf)


# ------------------ 실행 ------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

