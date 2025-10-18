# app.py
# 교육용 로컬 전용: 절대 외부 공개 금지
from flask import Flask, request, render_template, g, session, redirect, url_for, flash
import sqlite3, os, secrets

DB = "vuln_bank.db"
app = Flask(__name__)
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
        cur.execute("INSERT INTO users (username, password, balance) VALUES (?,?,?)",
                    ("admin", "admin123", 100000))
        cur.execute("INSERT INTO users (username, password, balance) VALUES (?,?,?)",
                    ("alice", "alice123", 5000))
        cur.execute("INSERT INTO users (username, password, balance) VALUES (?,?,?)",
                    ("bob", "bob123", 2000))
    except sqlite3.IntegrityError:
        pass

    # seed posts (ensure some defaults)
    cur.execute("DELETE FROM posts")
    sample_posts = [
        ("notice", "서비스 점검 안내", "system", "10/20(월) 02:00 ~ 04:00 서비스 점검이 예정되어 있습니다."),
        ("notice", "새 기능 안내", "system", "게시판 검색 기능이 추가되었습니다."),
        ("free", "자유 글 예시 1", "alice", "안녕하세요!"),
        ("free", "자유 글 예시 2", "bob", "테스트 게시글입니다.")
    ]
    cur.executemany("INSERT INTO posts (board, title, author, content) VALUES (?,?,?,?)", sample_posts)

    # seed flag if not exists
    try:
        cur.execute("SELECT count(*) FROM flags")
        cnt = cur.fetchone()[0]
    except:
        cnt = 0
    if cnt == 0:
        try:
            cur.execute("INSERT INTO flags (flag) VALUES (?)", ("FLAG{HackAndLearn}",))
        except:
            pass

    db_conn.commit()

# ------------------ util ------------------
def rows_to_dicts(rows):
    """sqlite3.Row list -> list[dict] (empty list safe)"""
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
            # CSRF token for state-changing forms
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

# ------------------ 게시판 (공지: 검색, 자유: 목록+글쓰기) ------------------
@app.route("/board/<board>", methods=["GET","POST"])
def board(board):
    # 로그인 필요
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))

    db = get_db()
    title = "공지사항" if board == "notice" else "자유게시판"

    # 기본: 모든 글 (최신순)
    posts_rows = db.execute("SELECT * FROM posts WHERE board=? ORDER BY id DESC", (board,)).fetchall()
    posts = rows_to_dicts(posts_rows)

    # 검색 처리 (Blind 전용: q가 boolean 조건으로 들어감)
    q = ""
    if request.method == "POST":
        q = request.form.get("q","")
        if q is not None and q != "":
            try:
                vulnerable_sql = f"""
                    SELECT * FROM posts
                    WHERE board = '{board}'
                      AND ({q})
                    ORDER BY id DESC
                """
                # debug print (필요시 주석 해제)
                # print("DEBUG VULN SQL ->", vulnerable_sql)
                rows = db.execute(vulnerable_sql).fetchall()
                posts = rows_to_dicts(rows)
            except Exception as e:
                print("VULN query error:", e)
                posts = []
                flash("검색 처리 중 오류가 발생했습니다.", "error")

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
    return render_template("post.html", post=post)

# ------------------ 글쓰기 ------------------
@app.route("/write", methods=["GET","POST"])
def write():
    # 로그인 필요
    if not session.get("username"):
        flash("로그인을 하세요.", "warning")
        return redirect(url_for("login"))

    if request.method == "POST":
        # CSRF check
        form_token = request.form.get("csrf_token","")
        if not form_token or form_token != session.get("csrf_token"):
            flash("CSRF token missing or invalid.", "error")
            return redirect(url_for("write"))

        # board selection: only admin can post to 'notice'
        board = request.form.get("board","free")
        if board != "notice":
            board = "free"  # normalize any invalid value to free

        # if non-admin tries to post 'notice', force to free
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

    # GET -> show form
    return render_template("write.html")

# ------------------ 삭제 (POST only, CSRF 보호) ------------------
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

    user = session.get("username")
    # 권한 확인: 작성자 본인 또는 admin
    if user != post["author"] and user != "admin":
        flash("삭제 권한이 없습니다.", "error")
        return redirect(url_for("board", board=post["board"]))

    db.execute("DELETE FROM posts WHERE id=?", (post_id,))
    db.commit()
    flash("글이 삭제되었습니다.", "success")
    return redirect(url_for("board", board=post["board"]))

# ------------------ 계좌 (로그인 필요) ------------------
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

# ------------------ 송금 (로그인 필요) ------------------
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

