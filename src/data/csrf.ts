import heroImage from '../assets/images/이론학습 상세.png';
import type { LearningTopic } from '../types/learning';
import csrfImage1 from '../assets/images/csrf/csrf.png';
import csrfImage2 from '../assets/images/csrf/csrf2.png';
import csrfImage3 from '../assets/images/csrf/csrf3.png';
import csrfImage4 from '../assets/images/csrf/csrf4.png';
import csrfImage5 from '../assets/images/csrf/csrf5.png';
import csrfImage6 from '../assets/images/csrf/csrf6.png';
import csrfImage7 from '../assets/images/csrf/csrf7.png';

export const csrf: LearningTopic = {
  id: 'csrf',
  title: 'CSRF (Cross-Site Request Forgery)',
  subtitle:
    '사용자가 로그인된 상태에서, 공격자가 의도한 요청을 강제로 보내게 하는 공격.',
  imageUrl: heroImage,
  description:
    '사용자가 로그인된 상태에서, 공격자가 의도한 요청을 강제로 보내게 하는 공격.',
  difficulty: '보통',
  isCompleted: false,
  content: [
    { type: 'h2', text: '1. 개요 & 학습 목표' },
    {
      type: 'ul',
      items: [
        ['CSRF가 무엇인지 개념을 이해한다.'],
        ['공격 시나리오와 피해 사례를 살펴본다.'],
        ['취약한 코드 예제와 공격 예제를 직접 실습한다.'],
        ['CSRF 방어 기법(Token, SameSite Cookie 등)을 학습한다.'],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '2. CSRF란?' },
    {
      type: 'p',
      content: [
        'CSRF는 사용자가 인증된 세션을 가진 상태에서 공격자가 의도한 요청을 서버에 보내도록 속이는 공격입니다. 사용자가 로그인이 이미 되어있는 상태라는 점을 악용하여 사용자의 의지와 무관하게 특정 요청(비밀번호 변경, 게시글 작성, 송금 등)이 서버에 전송되도록 만드는 것입니다.',
      ],
    },
    {
      type: 'p',
      content: [
        '사용자가 은행이나 쇼핑몰, 관리자 페이지 등에 로그인해 세션 쿠키를 보유한 상태에서 공격자가 만든 악성 페이지나 이메일의 링크를 한 번 클릭하거나 단순히 해당 페이지를 열기만 해도 브라우저가 자동으로 쿠키를 함께 전송하여 서버가 이를 정상 사용자로 인식하고 원치 않는 동작을 실행시킵니다.',
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '3. CSRF의 기본 개념' },
    {
      type: 'p',
      content: [
        'CSRF의 핵심 개념은 브라우저의 동작 원리와 서버의 신뢰 가정에서 비롯됩니다. 브라우저는 동일 출처(same-origin)에 대한 요청을 보낼 때 자동으로 쿠키를 전송하며, 많은 웹 애플리케이션은',
      ],
    },
    {
      type: 'principle',
      text: '“요청에 유효한 세션 쿠키가 포함되어 있으면 그 요청은 해당 사용자의 정식 요청”',
    },
    {
      type: 'p',
      content: [
        '이라고 가정합니다. 공격자는 이 두 가지 특성을 결합하여 피해자의 브라우저가 로그인 세션 쿠키를 포함한 상태로 특정 URL에 요청을 보내도록 유도합니다.',
      ],
    },
    {
      type: 'p',
      content: [
        '예를 들어 피해자가 은행 사이트에 로그인한 상태에서 공격자가 만든 외부 페이지를 방문하면, 그 페이지에 삽입된 ',
        { type: 'code', text: '<img>' },
        ' 태그나 자동 제출되는 ',
        { type: 'code', text: '<form>' },
        '이 은행의 송금 API를 호출하도록 구성할 수 있습니다. 브라우저는 이미지나 폼 요청을 보낼 때 쿠키를 자동으로 포함하므로 서버는 이를 정상 사용자 요청으로 처리하게 됩니다.',
      ],
    },
    {
      type: 'p',
      content: [
        '요청을 발생시키는 방식은 단순한 GET 기반(이미지 태그, 스크립트 태그, iframe 등)일 수도 있고, 숨겨진 폼을 자동 제출하여 POST 요청을 보내는 방식일 수도 있습니다. 최근에는 ',
        { type: 'code', text: 'fetch' },
        '나 XHR을 이용해 요청을 시도하는 경우도 있으나, 교차 출처 AJAX는 CORS(교차 출처 자원 공유) 제약과 프리플라이트로 인해 응답을 읽기 어렵고 성공률이 낮습니다. 따라서 실제 공격에서는 폼/이미지 기반 기법이 더 널리 사용됩니다.',
      ],
    },
    {
      type: 'p',
      content: [
        '중요한 점은 공격자가 응답을 읽지 못하더라도 상태 변경이 발생하면 피해가 발생할 수 있다는 점입니다. 이 때문에 CSRF 방어는 단순히 클라이언트 측 제약만으로는 완전히 해결되지 않으며, 서버 측에서 요청의 출처나 의도를 확인하는 추가적인 인증 단계가 반드시 필요합니다.',
      ],
    },
    {
      type: 'p',
      content: [
        '취약한 서버 코드 패턴을 보면 공통점이 존재합니다. 서버가 요청을 처리할 때 단지 “세션이 있는가”만 검사하고, 요청의 출처(Referer/Origin)나 요청 자체의 무결성(CSRF 토큰 등)을 전혀 확인하지 않는 경우가 이에 해당합니다. 예를 들어 PHP로 ',
        { type: 'code', text: 'transfer.php?to=attacker&amount=1000000' },
        ' 같은 GET 파라미터를 받아 처리하고 세션만 검사해 DB에 명령을 내린다면 공격자는 이미지 태그 한 줄',
      ],
    },
    {
      type: 'p',
      content: [
        '(',
        {
          type: 'code',
          text: '<img src="https://bank.example.com/transfer.php?to=attacker&amount=1000000">',
        },
        ')',
      ],
    },
    {
      type: 'p',
      content: [
        '로 동일 동작을 트리거할 수 있습니다. POST 기반으로 더 정교하게 구성하면 숨긴 폼',
      ],
    },
    {
      type: 'p',
      content: [
        '(',
        {
          type: 'code',
          text: '<form action="https://bank.example.com/transfer" method="POST">…</form>',
        },
        ')',
      ],
    },
    {
      type: 'p',
      content: [
        '을 자동 제출하는 방식이 있으며, 이 역시 브라우저가 세션 쿠키를 자동으로 첨부합니다.',
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '4. CSRF의 주요 유형' },
    {
      type: 'grid',
      items: [
        {
          title: '즉시 실행형 CSRF(중급)',
          text: '공격자가 악성 리소스(예: <img src="https://site.example/action?do=transfer&to=attacker&amount=1000">, <script>, <iframe> 등)를 포함한 페이지를 피해자에게 노출 → 피해자의 브라우저가 해당 URL로 GET 요청을 자동 전송(쿠키 포함) → 서버가 세션만으로 요청을 처리하여 상태 변경(송금·삭제 등)이 즉시 발생 → 공격자는 응답을 직접 읽지 못해도 동작이 완료됨.',
          footer:
            '위험도 : 높음 (특히 상태 변경을 GET으로 처리한 시스템에서 치명적입니다.)',
          isToggle: true,
          details: [
            {
              type: 'warning',
              message:
                '즉시 실행형 CSRF 경고: 두 파일을 따로 저장해야합니다.\nvuln_bank.py는 5000번 포트로 열고, attacker.html은 8000번 포트로 여세요.',
            },
            { type: 'h3', text: '즉시 실행형 CSRF 재현' },
            {
              type: 'ul',
              items: [['alice의 계좌에서 admin으로 1000원을 보내보세요.']],
            },
            {
              type: 'code',
              text: `# vuln_bank.py
from flask import Flask, g, session, redirect, url_for, request, render_template_string
import sqlite3, os

DB = "vuln_bank.db"
app = Flask(__name__)
app.secret_key = "dev-secret-key-education-only"

# ---------- DB helper ----------
def get_db():
    db = getattr(g, "_db", None)
    if db is None:
        need_init = not os.path.exists(DB)
        db = g._db = sqlite3.connect(DB)
        db.row_factory = sqlite3.Row
        if need_init:
            init_db(db)
    return db

def init_db(db):
    cur = db.cursor()
    cur.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT, balance INTEGER)")
    cur.executemany("INSERT INTO users (username,password,balance) VALUES (?, ?, ?)",
                    [("admin", "admin123", 10000), ("alice", "alice123", 12000)])
    db.commit()

@app.teardown_appcontext
def close_db(exception):
    db = getattr(g, "_db", None)
    if db is not None:
        db.close()

# =====================================================================
#  INDEX (메인 페이지) – Hack-n-Learn 디자인 통일 적용
# =====================================================================
@app.route("/")
def index():
    user = session.get("username")
    return render_template_string("""
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>취약 은행 모의 (교육용)</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background: #f4f6f9;
    margin: 0;
    padding: 0;
  }
  .container {
    width: 760px;
    margin: 40px auto;
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  h2 { margin-top:0; color:#333; }
  p { color:#444; line-height:1.5em; }
  a { color:#2563eb; text-decoration:none; }
  a:hover { text-decoration:underline; }
  .btn {
    display:inline-block;
    margin-top:10px;
    background:#2563eb;
    padding:10px 14px;
    border-radius:8px;
    color:#fff;
    font-weight:600;
    box-shadow:0 3px 8px rgba(37,99,235,0.2);
  }
  .info-note {
    margin-top:14px;
    color:#666;
    font-size:0.9em;
  }
  .actions {
    margin-top:18px;
    font-size:0.95em;
  }
</style>
</head>

<body>
<div class="container">

  <h2>취약 은행 모의 – CSRF 실습 (교육용)</h2>

  {% if user %}
    <p>안녕하세요, <strong>{{ user }}</strong>님 👋</p>

    <p>
      아래 버튼은 서버의 취약한 GET 기반 송금 기능(<code>/transfer?to=&amount=</code>)을 그대로 호출합니다.<br>
      CSRF 공격이 왜 가능한지 직접 체험할 수 있습니다.
    </p>

    <a class="btn" href="{{ url_for('transfer') }}?to=admin&amount=100">
      alice → admin 100원 송금 (취약 호출)
    </a>

    <p class="info-note">
      ※ 위 버튼은 CSRF 방어가 없는 상태에서 GET 요청만으로 송금이 이루어지는 취약점을 시연합니다.
    </p>

    <div class="actions">
      <a href="{{ url_for('balance') }}">잔액 보기</a> &nbsp;|&nbsp;
      <a href="{{ url_for('logout') }}">로그아웃</a>
    </div>

  {% else %}

    <p>실습을 시작하려면 <a href="{{ url_for('login') }}">로그인</a>하세요.</p>
    <p class="info-note">
      샘플 계정: <strong>admin/admin123</strong>, <strong>alice/alice123</strong>
    </p>

  {% endif %}

</div>
</body>
</html>
""", user=user)

# =====================================================================
#  LOGIN – 통일된 디자인 적용
# =====================================================================
@app.route("/login", methods=["GET","POST"])
def login():
    if request.method == "POST":
        u = request.form.get("username","")
        p = request.form.get("password","")
        db = get_db()
        row = db.execute("SELECT * FROM users WHERE username=? AND password=?", (u,p)).fetchone()
        if row:
            session["username"] = row["username"]
            return redirect(url_for("index"))
        return "로그인 실패", 401

    return render_template_string("""
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>로그인</title>
<style>
  body { font-family:Arial; background:#f4f6f9; margin:0; padding:0; }
  .container {
    width:420px;
    margin:80px auto;
    background:#fff;
    padding:28px;
    border-radius:12px;
    box-shadow:0 4px 12px rgba(0,0,0,0.12);
  }
  h3 { margin-top:0; color:#333; }
  input {
    width:100%;
    padding:10px;
    margin-top:6px;
    border:1px solid #bbb;
    border-radius:8px;
  }
  button {
    margin-top:14px;
    padding:10px 14px;
    width:100%;
    background:#2563eb;
    border:none;
    color:#fff;
    font-size:15px;
    border-radius:8px;
    font-weight:600;
  }
  .note { margin-top:12px; font-size:0.9em; color:#555; }
</style>
</head>

<body>
<div class="container">
  <h3>로그인</h3>

  <form method="post">
    <label>ID</label>
    <input name="username">

    <label style="margin-top:12px;">PW</label>
    <input name="password" type="password">

    <button>Login</button>
  </form>

  <p class="note">
    샘플 계정: admin/admin123 · alice/alice123
  </p>
</div>
</body>
</html>
""")

# =====================================================================
# LOGOUT / BALANCE / TRANSFER 그대로 유지
# =====================================================================
@app.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("index"))

@app.route("/balance")
def balance():
    if "username" not in session:
        return redirect(url_for("login"))
    db = get_db()
    row = db.execute("SELECT balance FROM users WHERE username=?", (session["username"],)).fetchone()
    bal = row["balance"] if row else 0
    return f"{session['username']} 님의 잔액: {bal} 원"

# 취약한 GET 기반 송금 (CSRF 실습)
@app.route("/transfer")
def transfer():
    if "username" not in session:
        return "로그인 필요", 403
    to = request.args.get("to", "")
    amount = int(request.args.get("amount", "0") or 0)
    if amount <= 0 or not to:
        return "잘못된 파라미터", 400
    db = get_db()
    cur = db.cursor()
    sender = db.execute("SELECT balance FROM users WHERE username=?", (session["username"],)).fetchone()
    if not sender or sender["balance"] < amount:
        return "잔액 부족", 400
    cur.execute("UPDATE users SET balance = balance - ? WHERE username=?", (amount, session["username"]))
    cur.execute("UPDATE users SET balance = balance + ? WHERE username=?", (amount, to))
    db.commit()
    return f"송금 완료: {session['username']} → {to} : {amount} 원"

if __name__ == "__main__":
    app.run(port=5000, debug=True)
`,
            },
            {
              type: 'p',
              content: ['- attacker.html 서버 열기'],
            },
            {
              type: 'ul',
              items: [
                [
                  '1. 새 터미널을 열고 attacker.html파일이 있는 디렉토리로 이동',
                ],
                [
                  '2. ',
                  { type: 'code', text: 'python3 -m http.server' },
                  ' 명령어 입력',
                ],
                [
                  '3. 브라우저에서 ',
                  { type: 'code', text: '127.0.0.1:8000/attacker.html' },
                  ' 로 접속',
                ],
              ],
            },
            {
              type: 'code',
              text: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Attacker Demo (Education Only)</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background:#f7f9fc; color:#222; padding:24px; }
    .card { max-width:720px; margin:40px auto; background:#fff; padding:18px 22px; border-radius:10px; box-shadow:0 6px 18px rgba(20,30,40,0.06); }
    h3 { margin-top:0; }
    .note { color:#555; font-size:14px; }
    img.attack-image { display:block; max-width:320px; margin:12px 0; border-radius:6px; }
  </style>
</head>
<body>
  <div class="card">
    <h3>Attacker Page (Demo)</h3>
    <p class="note">This page will trigger a GET request to the vulnerable server.</p>

    <img class="attack-image" src="your-image.png" alt="attack image">

    <p>
      <img src="http://127.0.0.1:5000/transfer?to=admin&amount=100" alt="attack-trigger" style="display:none">
    </p>

    <p class="note">Open this page while you are logged in to the vulnerable site (http://127.0.0.1:5000) to see the effect.</p>
  </div>
</body>
</html>
`,
            },
            {
              type: 'image',
              src: csrfImage1,
            },
            {
              type: 'image',
              src: csrfImage2,
            },
            {
              type: 'image',
              src: csrfImage3,
            },
            {
              type: 'image',
              src: csrfImage4,
            },
            {
              type: 'ul',
              items: [
                ['1. vuln_bank.py를 먼저 실행하세요.'],
                ['2. 잔액을 확인하세요.'],
                ['3. 새로운 터미널을 열고 attacker.html을 실행하세요.'],
                [
                  '4. 서버 로그에 ',
                  { type: 'code', text: 'GET /transfer?...' },
                  ' 요청이 기록되었는지 확인하세요.(Flask 콘솔에 출력됩니다).',
                ],
                ['5. 잔액을 확인하세요.'],
              ],
            },
            {
              type: 'p',
              content: [
                'alice는 신뢰된 사이트(은행)에서 공격자가 제공한 페이지(',
                { type: 'code', text: 'attacker.html' },
                ')를 우연히 방문했습니다. 이 때 공격자가 페이지에 숨겨둔 이미지 태그(',
                {
                  type: 'code',
                  text: '<img src="http://127.0.0.1:5000/transfer?to=admin&amount=100">',
                },
                ') 가 실행되면서 브라우저가 해당URL로 요청을 보냈습니다. 이 요청은 Alice의 브라우저가 보유한 세션 정보를 포함하여 전달되어 서버는 정상 사용자 요청으로 인식하고 송금 처리를 시도하였습니다. 결과적으로 서버 로그에 ',
                { type: 'code', text: 'GET /transfer?...' },
                ' 요청이 기록되었고, 로그인 세션이 유효한 경우에는 Alice의 잔액에서 금액이 차감되어 admin 계정으로 이체되는 동작이 발생하였습니다.',
              ],
            },
          ],
        },
        {
          title: '은밀 실행형 (중급)',
          text: '공격자가 숨긴 폼(<form method="POST" action="https://site.example/transfer">…</form>)이나 자동 제출 스크립트를 사용하여 피해자의 브라우저에서 POST 요청을 발생시키도록 유도 → 브라우저가 세션 쿠키를 포함해 요청 전송 → 서버는 요청을 처리하나 공격자는 응답 내용(성공/실패)을 알 수 없음(읽을 수 없음) → 피해는 눈에 보이지 않게 발생(계좌이체, 설정 변경 등).',
          footer:
            '위험도 : 매우 높음 (서버 응답을 보지 못해도 권한 있는 동작이 수행됩니다.)',
          isToggle: true,
          details: [
            { type: 'h3', text: '은밀 실행형 CSRF 재현' },
            {
              type: 'code',
              text: `# vuln_bank_2.py
from flask import Flask, request, session, redirect, url_for, render_template_string, abort
import secrets

app = Flask(__name__)
app.secret_key = "dev-secret-key-education-only"

# ----------------- 간단한 메모리 DB -----------------
USERS = {
    "alice": {"pw": "alice123", "balance": 1000},
    "admin": {"pw": "admin123", "balance": 1000}
}

# ----------------- 유틸 -----------------
def get_current_user():
    username = session.get("user")
    if username and username in USERS:
        return username
    return None

def transfer(from_user, to_user, amount):
    try:
        amount = int(amount)
    except:
        return False, "잘못된 금액"
    if to_user not in USERS:
        return False, "받는 사람 없음"
    if USERS[from_user]["balance"] < amount:
        return False, "잔액 부족"
    USERS[from_user]["balance"] -= amount
    USERS[to_user]["balance"] += amount
    return True, f"{amount}원 전송 성공"

# ----------------- 공통 CSS (디자인 통일) -----------------
BASE_STYLE = """
<style>
  body {
    font-family: Arial, sans-serif;
    background: #f4f6f9;
    margin: 0; padding: 0;
  }
  .container {
    width: 760px;
    margin: 40px auto;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  h2, h3 { margin-top:0; color:#333; }
  p, li { color:#444; line-height:1.55em; }
  a { color:#2563eb; text-decoration:none; }
  a:hover { text-decoration:underline; }
  .btn {
    display:inline-block;
    padding:10px 14px;
    border-radius:8px;
    background:#2563eb;
    color:#fff;
    font-weight:600;
    margin-top:10px;
  }
  input {
    padding:8px;
    border:1px solid #bbb;
    border-radius:8px;
    margin-top:6px;
    width:240px;
  }
  .small {
    color:#666;
    font-size:0.9em;
    margin-top:12px;
  }
</style>
"""

# ----------------- 라우트 -----------------
@app.route("/")
def index():
    user = get_current_user()

    return render_template_string(f"""
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>CSRF 실습 데모</title>
{BASE_STYLE}
</head>
<body>
<div class="container">

  <h2>CSRF 실습 데모</h2>
  <p class="small">교육용 로컬 환경 전용 — 절대 외부 배포 금지</p>

  {% if user %}
    <p>안녕하세요, <strong>{{ user }}</strong>님 👋</p>

    <p>
      <a href="{{ url_for('balance') }}">잔액 보기</a> |
      <a href="{{ url_for('transfer_page_vuln') }}">취약한 송금 (POST)</a> |
      <a href="{{ url_for('transfer_page_safe') }}">안전한 송금 (CSRF 토큰)</a> |
      <a href="{{ url_for('logout') }}">로그아웃</a>
    </p>

  {% else %}
    <p><a href="{{ url_for('login') }}">로그인</a></p>
  {% endif %}

  <hr style="margin:24px 0;">

  <h3>설명</h3>
  <ul>
    <li><strong>취약한 송금</strong> : CSRF 보호가 없어 외부 페이지에서 victim 브라우저로 POST를 보내면 송금됨.</li>
    <li><strong>안전한 송금</strong> : 세션 기반 CSRF 토큰이 필요하여 외부 페이지가 위조 요청을 보낼 수 없음.</li>
  </ul>

</div>
</body>
</html>
""", user=user)

# ----------------- 로그인 -----------------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        u = request.form.get("username")
        p = request.form.get("password")
        if u in USERS and USERS[u]["pw"] == p:
            session["user"] = u
            session["csrf_token"] = secrets.token_hex(16)
            return redirect(url_for("index"))
        return render_template_string(f"""
<!doctype html><html><head>{BASE_STYLE}</head><body>
<div class="container">
  <p>로그인 실패</p>
  <p><a href="{{{{ url_for('login') }}}}">뒤로가기</a></p>
</div>
</body></html>
""")

    return render_template_string(f"""
<!doctype html>
<html>
<head>{BASE_STYLE}</head>
<body>
<div class="container">
  <h3>로그인</h3>
  <form method="post">
    <p>ID<br><input name="username"></p>
    <p>PW<br><input name="password" type="password"></p>
    <button class="btn">Login</button>
  </form>
  <p class="small">샘플 계정: alice/alice123 · admin/admin123</p>
</div>
</body>
</html>
""")

# ----------------- 로그아웃 -----------------
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))

# ----------------- 잔액 확인 -----------------
@app.route("/balance")
def balance():
    u = get_current_user()
    if not u:
        return redirect(url_for("login"))

    return render_template_string(f"""
<!doctype html>
<html>
<head>{BASE_STYLE}</head>
<body>
<div class="container">
  <h3>{{ u }} 계좌</h3>
  <p>잔액: <strong>{{ bal }}</strong> 원</p>
  <p class="small">전체 상태: {{ users }}</p>
  <p><a href="{{ url_for('index') }}">홈으로</a></p>
</div>
</body>
</html>
""", u=u, bal=USERS[u]["balance"], users=USERS)

# ----------------- 취약한 송금 (CSRF 없음) -----------------
@app.route("/transfer_vuln", methods=["GET","POST"])
def transfer_page_vuln():
    u = get_current_user()
    if not u:
        return redirect(url_for("login"))

    if request.method == "POST":
        to = request.form.get("to")
        amount = request.form.get("amount")
        ok, msg = transfer(u, to, amount)
        return render_template_string(f"""
<!doctype html><html><head>{BASE_STYLE}</head><body>
<div class="container">
  <p>{{{{ msg }}}}</p>
  <p><a href="{{{{ url_for('transfer_page_vuln') }}}}">뒤로</a> |
     <a href="{{{{ url_for('index') }}}}">홈</a></p>
</div></body></html>
""", msg=msg)

    return render_template_string(f"""
<!doctype html>
<html>
<head>{BASE_STYLE}</head>
<body>
<div class="container">
  <h3>취약한 송금 (CSRF 없음)</h3>
  <form method="post">
    <p>To<br><input name="to" value="admin"></p>
    <p>Amount<br><input name="amount" value="100"></p>
    <button class="btn">Send (Vulnerable)</button>
  </form>

  <p class="small">
    이 폼은 CSRF 보호가 없습니다.<br>
    공격자가 외부 페이지에서 자동 POST를 보내면 송금이 발생합니다.
  </p>

  <p><a href="{{ url_for('index') }}">홈으로</a></p>
</div>
</body>
</html>
""")

# ----------------- 안전한 송금 (CSRF Token) -----------------
@app.route("/transfer_safe", methods=["GET","POST"])
def transfer_page_safe():
    u = get_current_user()
    if not u:
        return redirect(url_for("login"))

    if request.method == "POST":
        t_form = request.form.get("csrf_token")
        t_sess = session.get("csrf_token")
        if not t_sess or t_form != t_sess:
            abort(403, "CSRF token missing or mismatch")
        to = request.form.get("to")
        amount = request.form.get("amount")
        ok, msg = transfer(u, to, amount)
        return render_template_string(f"""
<!doctype html><html><head>{BASE_STYLE}</head><body>
<div class="container">
  <p>{{{{ msg }}}}</p>
  <p><a href="{{{{ url_for('transfer_page_safe') }}}}">뒤로</a> |
     <a href="{{{{ url_for('index') }}}}">홈</a></p>
</div></body></html>
""", msg=msg)

    return render_template_string(f"""
<!doctype html>
<html>
<head>{BASE_STYLE}</head>
<body>
<div class="container">

  <h3>안전한 송금 (CSRF 토큰 필요)</h3>

  <form method="post">
    <input type="hidden" name="csrf_token" value="{{ csrf }}">
    <p>To<br><input name="to" value="admin"></p>
    <p>Amount<br><input name="amount" value="100"></p>
    <button class="btn">Send (SAFE)</button>
  </form>

  <p class="small">로그인 시 발급된 CSRF 토큰이 일치해야 송금이 성공합니다.</p>

  <p><a href="{{ url_for('index') }}">홈으로</a></p>

</div>
</body>
</html>
""", csrf=session.get("csrf_token"))

# ----------------- 잘못된 GET 송금 -----------------
@app.route("/do_transfer_get")
def do_transfer_get():
    u = get_current_user()
    if not u:
        return "로그인 필요", 403
    to = request.args.get("to")
    amount = request.args.get("amount")
    ok, msg = transfer(u, to, amount)
    return msg

# ----------------- 실행 -----------------
if __name__ == "__main__":
    app.run(debug=True)
`,
            },
            {
              type: 'code',
              text: `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Attacker (auto POST)</title></head>
  <body>
    <h3>Attacker page (auto POST)</h3>
    <p>이 페이지를 연 사용자의 브라우저가 로그인 상태라면 은밀히 POST가 전송되어 됩니다.</p>

    <iframe name="hidden_iframe" style="display:none;"></iframe>

    <form id="f" action="http://127.0.0.1:5000/transfer_vuln" method="POST" target="hidden_iframe">
      <input type="hidden" name="to" value="admin">
      <input type="hidden" name="amount" value="100">
    </form>

    <script>
      // 페이지가 로드되면 폼 자동 제출 (은밀 실행)
      window.onload = function(){ document.getElementById('f').submit(); };
    </script>
  </body>
</html>
`,
            },
            {
              type: 'image',
              src: csrfImage5,
            },
            {
              type: 'image',
              src: csrfImage6,
            },
            {
              type: 'ul',
              items: [
                [
                  '**위와 같은 상태에서 1번 실습과 마찬가지로 attacker2.html을 열게 되면**',
                ],
              ],
            },
            {
              type: 'image',
              src: csrfImage7,
            },
            {
              type: 'ul',
              items: [
                [
                  'alice의 계좌에서 admin의 계좌로 돈이 빠져나간것을 볼 수 있습니다.',
                ],
              ],
            },
            {
              type: 'p',
              content: [
                '1. vuln_bank2.py를 먼저 실행하세요.',
                '\n2. 잔액을 확인하세요.',
                '\n3. 새로운 터미널을 열고 attacker2.html을 실행하세요.',
                '\n4. 서버 로그에 ',
                { type: 'code', text: '"POST /transfer_vuln ...' },
                ' 요청이 기록되었는지 확인하세요.(Flask 콘솔에 출력됩니다).',
                '\n5. 잔액을 확인하세요.',
              ],
            },
            {
              type: 'p',
              content: [
                '언뜻 보면 1번 실습과 2번 실습이 동일해 보일 수 있지만, 전혀 다른 공격입니다.',
              ],
            },
            {
              type: 'p',
              content: [
                '1번 실습같은 경우는 ',
                { type: 'code', text: '<img>' },
                ' 태그를 이용하기 때문에 화면에 공격 이미지가 있을 수 있으며 ',
                { type: 'code', text: 'display:none' },
                '로 이를 숨겨서 브라우저 탭이나 URL은 변경되지 않습니다. 또한 매우 간단하지만, 요청본문(body)를 보낼 수 없고, 브라우저의 쿠키 정책에 따라 공격이 불가능할 수 있습니다.',
              ],
            },
            {
              type: 'p',
              content: [
                '2번 실습같은 경우는 응답이 ',
                { type: 'code', text: 'hidden_iframe' },
                '에 로드되므로 사용자 화면에 변화가 일절 없습니다. 또한 서버가 정책상 GET을 허용하지 않는 경우가 훨씬 많고, POST만을 수용하는 경우 확실하게 공격이 가능합니다.',
              ],
            },
            {
              type: 'p',
              content: [
                '단, 최근들어 브라우저의 방어정책이 매우 견고해졌기 때문에 위 두가지 방법 모두 실패할 가능성이 큽니다.',
              ],
            },
          ],
        },
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '5. 방어 원칙' },
    {
      type: 'p',
      content: ['CSRF 방어는'],
    },
    {
      type: 'principle',
      text: '요청이 진짜 사용자가 의도한 것인가?',
    },
    {
      type: 'p',
      content: [
        '를 서버 측에서 확실히 검증하는 것입니다. 브라우저가 자동으로 세션 쿠키를 포함해 요청을 보내는 특성을 악용하는 공격이므로, 서버가 세션 유효성만으로 신뢰하지 말고 추가 증거(토큰/출처/무결성)를 요구해야 합니다.',
      ],
    },
    { type: 'h3', text: '컨텍스트별 원칙' },
    {
      type: 'h4',
      text: 'A. 상태 변경(쓰기) 요청 — 무작위 CSRF 토큰(서버 검증)',
    },
    {
      type: 'nested-list',
      items: [
        {
          content: [
            'POST/PUT/DELETE/PATCH 등 서버 상태를 변경하는 모든 요청에서 적용합니다.',
          ],
        },
        {
          content: [
            '서버가 세션 유효성 외에 **폼/요청마다 발급된 난수 토큰**을 요구하고 검증합니다.',
          ],
          subItems: [
            [
              '로그인 시 ',
              { type: 'code', text: "session['csrf_token'] = random()" },
              ' 생성.',
            ],
            [
              '폼에 ',
              {
                type: 'code',
                text: '<input type="hidden" name="csrf_token" value="{{ csrf }}">',
              },
              ' 포함.',
            ],
            [
              '서버는 POST에서 ',
              {
                type: 'code',
                text: "request.form['csrf_token'] == session['csrf_token']",
              },
              ' 확인.',
            ],
          ],
        },
        {
          content: [
            '외부(공격자) 페이지는 세션 토큰은 모르므로 토큰 없이 요청을 보낼 수 없습니다.',
          ],
        },
        {
          content: ['예시'],
        },
      ],
    },
    {
      type: 'code',
      text: `# 생성 (로그인시)
session['csrf_token'] = secrets.token_hex(16)

# 템플릿
<input type="hidden" name="csrf_token" value="{{ session.csrf_token }}">

# 검증 (POST)
token = request.form.get('csrf_token')
if not token or token != session.get('csrf_token'):
    abort(403)
`,
    },
    {
      type: 'h4',
      text: 'B. AJAX / API 호출(특히 JSON) — CSRF 토큰을 헤더로 전송 + CORS 원칙 준수',
    },
    {
      type: 'ul',
      items: [
        [
          '브라우저의 ',
          { type: 'code', text: 'fetch' },
          '/XHR은 기본적으로 쿠키를 자동 전송(credential)할 수 있으므로 CSRF에 취약합니다.',
        ],
        [
          '클라이언트가 CSRF 토큰을 ',
          { type: 'code', text: 'X-CSRF-Token' },
          ' 같은 커스텀 헤더로 포함하도록 하고, 서버에서 그 값을 검증합니다.',
        ],
        [
          'CORS : 교차 출처 AJAX는 브라우저가 응답을 차단하지만 요청은 갈 수 있으므로 토큰 검사 필요.',
        ],
        ['예시'],
      ],
    },
    {
      type: 'code',
      text: `fetch('/api/transfer', {
  method: 'POST',
  credentials: 'include',
  headers: {'X-CSRF-Token': window.csrfToken, 'Content-Type': 'application/json'},
  body: JSON.stringify({to:'admin',amount:100})
})`,
    },
    {
      type: 'h4',
      text: 'C. GET 요청(읽기 전용) — GET은 상태 변경에 사용하지 말자',
    },
    {
      type: 'ul',
      items: [
        [
          '상태 변경을 GET으로 구현하는 것 자체가 큰 보안 실수. GET은 링크, 이미지, 프리페치 등으로 쉽게 트리거됩니다.',
        ],
        [
          '권장하지 않지만, 만약 반드시 GET형태로 상태 변경을 해야 한다면, 추가적인 확인(토큰/2단계 확인)이 필요합니다.',
        ],
      ],
    },
    {
      type: 'h4',
      text: 'D. iframe / clickjacking 관련 — X-Frame-Options / CSP로 제어',
    },
    {
      type: 'ul',
      items: [
        [
          '공격자가 사이트를 iframe에 로드해 폼을 제출하거나 UI를 위조할 수 있습니다. → ',
          { type: 'code', text: 'X-Frame-Options: DENY' },
          ' 또는 CSP ',
          { type: 'code', text: "frame-ancestors 'none'" },
          '.',
        ],
        [
          '이와 같은 공격에는 응답 헤더에 추가하거나 웹서버/앱 설정으로 강제해야합니다.',
        ],
      ],
    },
    { type: 'h4', text: 'E. Referer/Origin 검사 — 보조 방어(토큰과 함께)' },
    {
      type: 'ul',
      items: [
        [
          '요청 헤더의 출처(',
          { type: 'code', text: 'Origin' },
          ', ',
          { type: 'code', text: 'Referer' },
          ') 확인 → 사이트 외부면 거부.',
        ],
        [
          '서버는 ',
          { type: 'code', text: 'Origin' },
          ' 또는 ',
          { type: 'code', text: 'Referer' },
          ' 헤더가 신뢰된 호스트인지 확인할 수 있습니다.',
        ],
        [
          '일부 프라이버시 설정/프록시에서 ',
          { type: 'code', text: 'Referer' },
          '가 없을 수 있으므로 **토큰의 대체가 될 수 없고,** 단지 추가 안전망일 뿐입니다.',
        ],
      ],
    },
    { type: 'h3', text: '구체적 권장 구현 패턴(컨텍스트별 템플릿)' },
    {
      type: 'h4',
      text: '기본(가장 널리 쓰이는) — Server-side CSRF token (synchronizer token pattern)',
    },
    {
      type: 'ul',
      items: [
        [
          '개념 : 서버가 난수 토큰을 생성 → 폼에 숨겨서 함께 전송 → 서버에서 세션 토큰과 비교 → 불일치 시 거부.',
        ],
        [
          '생성 : 로그인/세션 생성 시 ',
          {
            type: 'code',
            text: "session['csrf_token'] = secrets.token_hex(16)",
          },
        ],
        ['삽입 : 모든 상태 변경 폼에 숨김 필드로 삽입.'],
        ['검증 : POST 수신시 세션값과 비교.'],
        [
          '장점 : 간단, 강력. 프레임워크 대부분에서 이 패턴을 제공(예: Flask-WTF, Django 등).',
        ],
      ],
    },
    { type: 'h4', text: 'AJAX API (헤더 방식)' },
    {
      type: 'ul',
      items: [
        [
          '서버 : 세션에 저장된 토큰을 HTML에 ',
          { type: 'code', text: '<meta name="csrf" content="{{csrf}}">' },
          ' 또는 JS 변수로 주입.',
        ],
        [
          '클라이언트 : AJAX 요청 시 헤더로 포함(',
          { type: 'code', text: 'X-CSRF-Token' },
          ').',
        ],
        ['서버 : 헤더값과 세션값 비교.'],
      ],
    },
    {
      type: 'h4',
      text: 'Double-submit cookie (쿠키+폼의 동일 값 비교) — 보조 전략',
    },
    {
      type: 'ul',
      items: [
        [
          '원리 : 서버는 토큰을 쿠키로 발급(',
          { type: 'code', text: 'Set-Cookie: csrf=abcd; SameSite=None' },
          ')하고, 클라이언트는 폼(또는 JS)에서 같은 값을 전송. 서버는 쿠키값과 폼값 비교.',
        ],
        [
          '장점 : 서버 상태를 토큰 저장에 의존하지 않음(무상태 API에 사용 가능).',
        ],
        [
          '한계 : 쿠키가 동기적으로 설정되지 않거나 공격자가 쿠키를 통제하면 위험 — 보통 HTTPS+Secure + SameSite와 함께 사용.',
        ],
      ],
    },
    { type: 'h4', text: '중요한 요청은 재인증' },
    {
      type: 'ul',
      items: [
        [
          '송금/비밀번호 변경 같은 민감 요청 시 **비밀번호 재입력** 또는 **OTP 확인** 요구.',
        ],
      ],
    },
    { type: 'h3', text: '운영 설정(쿠키/브라우저 레벨) — 필수 권장 옵션' },
    {
      type: 'nested-list',
      items: [
        {
          content: [
            { type: 'code', text: 'SESSION_COOKIE_HTTPONLY=True' },
            ' : JS에서 세션 쿠키를 읽지 못하게 함(도난 방지).',
          ],
        },
        {
          content: [
            { type: 'code', text: 'SESSION_COOKIE_SECURE=True' },
            ' : HTTPS 전용 (유효 환경에서).',
          ],
        },
        {
          content: [
            { type: 'code', text: "SESSION_COOKIE_SAMESITE='Lax'" },
            ' 또는 ',
            { type: 'code', text: "'Strict'" },
            ' : 외부 사이트 요청 시 쿠키 전송을 제한.',
          ],
          subItems: [
            [
              { type: 'code', text: 'Lax' },
              ' : 대체로 링크 클릭에는 쿠키 전송, 이미지/iframe 등에는 차단 — GET 기반 CSRF 완화에 유용.',
            ],
            [
              { type: 'code', text: 'Strict' },
              ' : 더 엄격(일부 합법적 리퍼러 동작에 영향).',
            ],
          ],
        },
        {
          content: ['예(Flask):'],
        },
      ],
    },
    {
      type: 'code',
      text: `app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=True # HTTPS 환경일 때
)`,
    },
    { type: 'h3', text: '추가 방어·보조 수단(권장 조합)' },
    {
      type: 'ul',
      items: [
        [
          '**토큰 검증(기본)** + **SameSite 쿠키(보조)** + **Origin/Referer 검사(추가)** → 강력한 조합',
        ],
        ['**X-Frame-Options / CSP frame-ancestors** → iframe/클릭재킹 방지'],
        ['**Rate limiting & 확인 UI** → 대량 송금 같은 자동 공격 감지'],
        [
          '**이상행위 알림(로그/알림)** → 동일 세션에서 갑작스러운 큰 금액 전송 등 실시간 탐지',
        ],
        [
          '**프레임워크 내장 CSRF 미들웨어 사용** (e.g., Flask-WTF, Django CSRF, Express csurf 등)',
        ],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '6. 체크리스트' },
    {
      type: 'checklist',
      items: [
        ['모든 상태 변경 요청(POST/PUT/DELETE)에 CSRF Token이 있는가?'],
        ['CSRF Token은 충분히 예측 불가능하고 매 요청마다 갱신되는가?'],
        [
          '쿠키에 ',
          { type: 'code', text: 'SameSite' },
          ', ',
          { type: 'code', text: 'HttpOnly' },
          ', ',
          { type: 'code', text: 'Secure' },
          ' 속성을 설정했는가?',
        ],
        ['중요한 요청 시 추가 인증 수단을 적용했는가?'],
        ['GET 요청은 데이터 변경을 하지 않도록 했는가?'],
      ],
    },
  ],
};
