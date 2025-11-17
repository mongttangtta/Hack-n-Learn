import heroImage from '../assets/images/이론학습 상세.png';
import type { LearningTopic } from '../types/learning';

export const sqlInjection: LearningTopic = {
  id: 'sql-injection',
  title: 'SQL Injection',
  subtitle:
    '사용자가 입력한 값이 적절히 검증·구조화되지 않은 채 SQL 쿼리에 그대로 삽입되어, 공격자가 원래 의도하지 않은 SQL 명령을 실행하게 만드는 취약점.',
  imageUrl: heroImage,
  description:
    '사용자가 입력한 값이 적절히 검증·구조화되지 않은 채 SQL 쿼리에 그대로 삽입되어, 공격자가 원래 의도하지 않은 SQL 명령을 실행하게 만드는 취약점.',
  difficulty: '보통',
  isCompleted: false,
  content: [
    { type: 'h2', text: '1. 개요 & 학습 목표' },
    {
      type: 'ul',
      items: [
        ['SQL Injection의 개념과 발생 원리를 이해한다.'],
        ['공격자가 어떻게 데이터베이스를 조작하는지 알 수 있다.'],
        ['대표적인 공격 기법(인증 우회, 데이터 탈취 등)을 실습해본다.'],
        ['안전한 쿼리 작성법(Prepared Statement, ORM 등)을 배운다.'],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '2. SQL Injection이란?' },
    {
      type: 'p',
      content: [
        'SQL Injection은 사용자가 입력한 값이 적절히 검증·구조화되지 않은 채 SQL 쿼리에 그대로 삽입되어, 공격자가 원래 의도하지 않은 SQL 명령을 실행하게 만드는 취약점입니다. 예를 들어 로그인·검색·ID 파라미터 등에 악의적 입력(SQL 명령어)을 넣어 인증 우회, 데이터 조회·조작·삭제 등이 발생할 수 있습니다.',
      ],
    },
    { type: 'h3', text: '훔칠 수 있는 것 / 가능한 피해' },
    {
      type: 'ul',
      items: [
        ['사용자 개인정보(이메일, 암호 해시, 주민등록번호 등)'],
        ['인증 토큰·세션 관련 데이터 → 계정 탈취'],
        ['데이터베이스 전체 덤프(권한에 따라)'],
        ['데이터 변조(무결성 훼손), 서비스 중단(삭제·드롭)'],
        [
          '권한 상승(데이터베이스 사용자 권한이 높으면 시스템 명령 실행 가능성)',
        ],
      ],
    },
    { type: 'h3', text: '문제의 핵심' },
    {
      type: 'p',
      content: [
        '사용자 입력을 SQL 문법의 일부로 취급해 쿼리를 조립(문자열 결합)하면 발생.\n핵심 원인은 입력값을 SQL과 분리하지 않음(파라미터화 미적용)이다.',
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '3. SQL Injection의 기본 개념' },
    {
      type: 'p',
      content: [
        `SQL Injection은 기본적으로 웹앱이 로그인또는 게시판같은 기능을 만들 때 사용자 입력을 그대로 문자열로 이어 붙여서 SQL을 만들 때 문제가 생깁니다.하지만, SQL Injection 공격을 수행하기 위해서 가장 먼저 해당 SQL이 어떤 엔진을 사용하고 있는지, 어떤 문법을 사용하고 있는지 알고 있어야 합니다. 만약 내부 접근이 가능하다면 애플리케이션 설정 파일(.env, config), 배포 스크립트, 연결 문자열 또는 운영 문서에서 엔진 정보와 드라이버를 바로 확인할 수 있고, 로그나 DB 클라이언트로 직접 접속하면 확실히 알 수 있습니다. 외부에서 조사할 때는 에러 메시지와 응답 패턴이 큰 단서가 됩니다. 데이터베이스별로 나타나는 오류 문구, 페이징 방식(LIMIT vs TOP), 문자열 연결 방식(CONCAT vs `,
        { type: 'code', text: '||' },
        `), 식별자 따옴표(`,
        { type: 'code', text: '"' },
        `, `,
        { type: 'code', text: '`' },
        `, `,
        { type: 'code', text: '[]' },
        `), 허용하는 주석 스타일(`,
        { type: 'code', text: '#' },
        ` 사용 여부 등)과 같은 문법 차이를 보면 엔진을 유추할 수 있습니다. 또한 응답에 노출된 함수명이나 버전 정보, 날짜·불리언 처리 방식 등 세세한 동작 차이도 힌트가 됩니다.`,
      ],
    },
    { type: 'h3', text: '3.1 SQL 기초 개념' },
    {
      type: 'ul',
      items: [
        [
          {
            type: 'code',
            text: "SELECT username, email FROM users WHERE id='alice' AND pw='alice_pw'",
          },
        ],
        [
          'users 테이블에서 id가 ‘alice’이고, pw가 ‘alice_pw’인 행의 username과 email 열을 가져옵니다.',
        ],
        ['SELECT - 테이블에서 행을 고릅니다.'],
        ['FROM - 테이블 종류'],
        ['WHERE - 조건 (여러 조건은 AND와 OR로 이어줍니다.)'],
        ['연산자 우선순위 : AND가 OR보다 먼저 계산됩니다.'],
        [
          { type: 'code', text: 'a OR b AND c' },
          ` → `,
          { type: 'code', text: 'a OR (b AND c)' },
        ],
        ['주석 : DB가 무시하는 부분'],
        [{ type: 'code', text: '--' }, ` (라인 끝까지 주석)`],
        [{ type: 'code', text: '/* ... */' }, ` (블록 주석)`],
      ],
    },
    { type: 'h3', text: "3.2 SQL injection의 기본 원리 (' OR '1' = '1' --)" },
    {
      type: 'p',
      content: ['id_input과 pw_input이 사용자 입력일 때'],
    },
    {
      type: 'code',
      text: 'SELECT username FROM users\nWHERE id = \'" + id_input "\' AND pw = \'"pw_input"\'',
    },
    {
      type: 'p',
      content: [
        '같은 코드를 사용한다고 가정해봅시다.\n여기서 공격자가 id_input에 악의적인 SQL 조각을 넣으면 최종 쿼리 자체가 변형됩니다.',
      ],
    },
    {
      type: 'p',
      content: ['**정상**'],
    },
    {
      type: 'ul',
      items: [['id_input → alice'], ['pw_input → alice_pw']],
    },
    {
      type: 'p',
      content: ['**SQL injection**'],
    },
    {
      type: 'ul',
      items: [["id_input → ' OR '1'='1' --"], ['pw_input → (상관없음)']],
    },
    { type: 'p', content: ['**최종 SQL**'] },
    {
      type: 'code',
      text: "SELECT username FROM users WHERE id = '' OR '1'='1' -- ' AND pw = '\" \"'",
    },
    {
      type: 'nested-list',
      items: [
        {
          content: ["id = '' OR '1'='1'"],
          subItems: [['OR 문 뒤에 1=1 즉, 참이 됩니다.']],
        },
        {
          content: [
            { type: 'code', text: '--' },
            ` 와 `,
            { type: 'code', text: '/* … */' },
            ` 는 SQL의 주석으로, 비밀번호 조건이 무시됩니다.`,
          ],
          subItems: [
            [
              `간혹 브라우저에서 `,
              { type: 'code', text: '--' },
              ` 주석이 안되는 경우는 `,
              { type: 'code', text: '/* … */' },
              ` 주석으로 대체 가능합니다.`,
            ],
          ],
        },
        {
          content: [
            '쉽게 말해 로그인의 WHERE 절의 조건을 항상 참(TRUE)로 만들어 로그인 성공을 유도하게 됩니다.',
          ],
        },
      ],
    },
    { type: 'h3', text: "3.3 또 다른 SQL injection 페이로드 (' OR '1' = '1')" },
    {
      type: 'p',
      content: [
        '주석이 있는 전형적인 ',
        { type: 'code', text: `' OR '1' = '1' --` },
        ' 페이로드 와는 다르게 주석이 없는 페이로드도 존재합니다.',
      ],
    },
    {
      type: 'p',
      content: [
        '하지만 주석이 없는 페이로드의 경우 WHERE 절 뒤에 ',
        { type: 'code', text: "AND pw = '~~'" },
        ' 가 그대로 붙어 있게 되고, AND가 OR보다 우선순위가 높으므로',
      ],
    },
    {
      type: 'code',
      text: "SELECT username FROM users WHERE id = '' OR ('1'='1' AND pw = '\"~~\"')",
    },
    {
      type: 'p',
      content: [
        '이렇게 SQL문이 만들어집니다.\n\n이 경우에는 비밀번호가 틀릴 경우 AND 절이 거짓이 되고, SQL injection은 실패가 됩니다.\n\n그래서 실전 공격에서는 주석(또는 문자열 닫기 변형)으로 뒷부분을 잘라내는 것이 일반적으로 사용됩니다.\n\n즉, OR 기반 페이로드는 조건을 참으로 만들고, 주석으로 WHERE의 뒤쪽 절을 제거하는 것이 핵심입니다.',
      ],
    },
    { type: 'h3', text: '3.4 Boolean-Based Blind-SQL injection' },
    {
      type: 'p',
      content: [
        'Boolean Based Blind SQL injection은 애플리케이션이 데이터베이스의 직접적인 결과(데이터 출력)를 보여주지 않을 때, 요청에 대한 참/거짓 반응만을 관찰해서 DB 내부 정보(ex. 컬럼값)를 역추론하는 공격 기법입니다. 즉, 공격자는 쿼리 하나하나의 조건식을 `TRUE`가 되도록 만들 수 있는지 확인하고, 그 결과를 통해 정보를 한 글자씩 추출합니다.',
      ],
    },
    {
      type: 'p',
      content: [
        '먼저, 애플리케이션이 내부에서 어떤 SQL을 실행하는지 추정해야 합니다.',
      ],
    },
    {
      type: 'code',
      text: "SELECT * FROM users WHERE username='<u>' AND password='<p>';",
    },
    {
      type: 'p',
      content: [
        "이렇게 추정한 쿼리 구조에 맞춰 입력값을 ' 등으로 닫고 AND <조건> 형식으로 논리식을 삽입합니다.\n\nsubstr() 함수나 ascii() 같은 함수를 이용해 한 글자 또는 비트나 숫자 단위로 값을 확인하여 전체 값을 알아낼 수 있습니다.",
      ],
    },
    { type: 'code', text: "admin' AND substr(password,1,1)='a' --" },
    {
      type: 'p',
      content: [
        '만약 이렇게 삽입한 조건식이 참이면 전체 WHERE 절이 참이 되어 애플리케이션이 로그인 성공이나 페이지 이동 등 다른 반응을 보이게 되고, 거짓이라면 로그인 실패로 이어지게 됩니다.',
      ],
    },
    {
      type: 'ul',
      items: [
        [
          '위 논리식이 참인 경우 : 비밀번호의 첫 글자가 a로 시작하기 때문에 로그인 성공 → 첫 글자가 a 임을 확인',
        ],
        [
          '위 논리식이 거짓인 경우 : 비밀번호의 첫 글자는 a가 아니며, 다른 글자를 시도.',
        ],
      ],
    },
    {
      type: 'p',
      content: ['**substr(password, 1, 1)**'],
    },
    {
      type: 'ul',
      items: [
        ['문자열 : 컬럼 값'],
        ['첫번째 숫자 : 시작 위치'],
        ['두번째 숫자 : 추출할 글자 수'],
      ],
    },
    { type: 'h3', text: '3.5 여러 형태의 SQL injection' },
    {
      type: 'p',
      content: [
        "로그인 같은 경우는 보통 아이디 부분에 `'` 를 이용하여 쿼리를 닫고 `OR` 로 공격을 이어갑니다.",
      ],
    },
    { type: 'code', text: "SELECT * FROM users WHERE username='<u>'" },
    {
      type: 'p',
      content: ["이와 같은 경우도 ' OR '1'='1 을 넣게 되면"],
    },
    { type: 'code', text: "SELECT * FROM users WHERE username='' OR '1'='1'" },
    {
      type: 'p',
      content: [
        '코드로 바뀌게 됩니다.\n\n하지만, 모든 SQL injection이 로그인 부분에서 터지는 것은 아닙니다.\n\n예를 들어서 숨겨져 있는 관리자 테이블인 admin_table이 있고, 그 테이블의 id와 pw 컬럼에 관리자들의 아이디와 비밀번호가 저장이 되어있다고 가정해봅시다.',
      ],
    },
    {
      type: 'code',
      text: "SELECT * FROM posts WHERE board='example' AND ({q}) ORDER BY id DESC",
    },
    {
      type: 'p',
      content: [
        "q 파라미터에 사용자의 입력이 들어가게 되고, 이와 같은 경우 `' OR` 처럼 문자열을 닫는 문법은 필요 없이 바로 질의 문으로 넘어가야 문법에 맞는 SQL문이 됩니다. 그러므로 q 파라미터에는",
      ],
    },
    {
      type: 'code',
      text: "(SELECT substr(id, 1, 1)FROM admin_table) = 'a'",
    },
    {
      type: 'p',
      content: [
        '이렇게 질의를 해야 `admin_table의 id 컬럼의 첫번째 글자부터 첫번째 글자가 a 인가?` 라고 물어보게 됩니다.\n\n정리하자면 SQL injection에서 가장 중요한 첫번째는 현재 SQL구문이 어떻게 되어있는가? 입니다.',
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '4. SQLi의 주요 유형' },
    {
      type: 'grid',
      items: [
        {
          title: 'In-band SQLi (초급)',
          text: '공격자가 입력 필드(예: 게시판 댓글, 프로필, 상품평 등)에 악성 SQL 페이로드를 넣음 → 서버가 그 입력을 검증/파라미터화 없이 SQL 쿼리의 일부로 문자열 결합하여 DB에 전달·실행함 → DB가 쿼리 결과(또는 오류)를 HTTP 응답으로 그대로 반환하거나 페이지에 렌더링하여 공격자가 즉시 민감정보(유저네임/패스워드 해시 등)를 확인하거나 데이터가 변조됨.',
          footer: '위험도: 매우 높음',
          isToggle: true,
          details: [
            { type: 'h3', text: 'In-band SQLi 재현(초급)' },
            {
              type: 'ul',
              items: [
                ['alice, bob, charlie로 로그인 해보세요.'],
                ['OR 페이로드를 사용해서 SQL injection을 시도해보세요.'],
              ],
            },
            {
              type: 'code',
              text: `# sqli_inband.py
# 사용법: sqli_inband.py  -> http://127.0.0.1:5000
from flask import Flask, request, render_template_string, g, session, redirect, url_for
import sqlite3, os, re

DB_FILE = "vuln_login_practice.db"
app = Flask(__name__)
app.config["DEBUG"] = True
app.secret_key = "dev-secret-key-education-only"  # 교육용 로컬 전용

# ---------- DB ----------
def get_db():
    db = getattr(g, "_db", None)
    if db is None:
        need_init = not os.path.exists(DB_FILE)
        db = g._db = sqlite3.connect(DB_FILE)
        db.row_factory = sqlite3.Row
        if need_init:
            init_db(db)
        else:
            ensure_sample_users(db)
    return db

def init_db(db):
    cur = db.cursor()
    cur.execute("""
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        phone TEXT, address TEXT, email TEXT
      )
    """)
    cur.executemany(
        "INSERT OR IGNORE INTO users (username,password,phone,address,email) VALUES (?,?,?,?,?)",
        [
            ("alice","alice_pw","010-1111-2222","강원 춘천시 모범로 1","alice @example.com"),
            ("bob","bob_pw","010-3333-4444","서울 강남구 테헤란로 2","bob @example.com"),
            ("charlie","charlie_pw","010-5555-6666","부산 해운대구 센텀로 3","charlie @example.com"),
        ],
    )
    db.commit()

def ensure_sample_users(db):
    cur = db.cursor()
    cur.execute("PRAGMA table_info(users)")
    cols = [r[1] for r in cur.fetchall()]
    if not {"phone","address","email"}.issubset(set(cols)):
        try:
            cur.execute("ALTER TABLE users ADD COLUMN phone TEXT")
            cur.execute("ALTER TABLE users ADD COLUMN address TEXT")
            cur.execute("ALTER TABLE users ADD COLUMN email TEXT")
        except Exception:
            pass
    for u,p,ph,ad,em in [
        ("alice","alice_pw","010-1111-2222","강원 춘천시 모범로 1","alice @example.com"),
        ("bob","bob_pw","010-3333-4444","서울 강남구 테헤란로 2","bob @example.com"),
        ("charlie","charlie_pw","010-5555-6666","부산 해운대구 센텀로 3","charlie @example.com"),
    ]:
        cur.execute("INSERT OR IGNORE INTO users (username,password,phone,address,email) VALUES (?,?,?,?,?)",
                    (u,p,ph,ad,em))
    db.commit()

@app.teardown_appcontext
def close_db(exc):
    db = getattr(g, "_db", None)
    if db is not None:
        db.close()

# ---------- 도우미 ----------
def looks_like_sqli(s: str) -> bool:
    if not s: return False
    s_low = s.lower()
    if "'" in s or "--" in s or ";" in s: return True
    if re.search(r"\\bor\\b\\s+['\\"]?\\d+?['\\"]?\\s*=\\s*['\\"]?\\d+?['\\"]?", s_low): return True
    if re.search(r"\\bor\\s+1\\s*=\\s*1\\b", s_low): return True
    return False

def is_or_true_payload(s: str) -> bool:
    return bool(re.search(r"'\\s*or\\s*'1'\\s*=\\s*'1'", (s or "").lower()))

# ---------- 템플릿 ----------
LOGIN_HTML = """
<!doctype html><html lang="ko"><head>
<meta charset="utf-8"><title>취약 로그인 실습 (In-band SQLi)</title>
<style>
  body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f6f8fa;padding:2rem}
  .card{max-width:720px;margin:0 auto;background:#fff;padding:1.2rem 1.4rem;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.06)}
  h1{margin:0 0 8px 0;font-size:20px}
  .warn{color:#a00;font-weight:600;margin-top:6px}
  label{display:block;margin-top:8px}
  input[type=text],input[type=password]{padding:8px;width:100%;max-width:360px;border-radius:6px;border:1px solid #ddd;margin-top:6px}
  button{margin-top:12px;padding:8px 12px;border-radius:6px;background:#0366d6;color:#fff;border:none;cursor:pointer}
  .payloads{margin-top:12px}
  .payloads button{background:#eee;color:#111;border:1px solid #ddd;padding:6px 8px;border-radius:6px;margin-right:8px;cursor:pointer}
  pre{background:#f3f4f6;padding:10px;border-radius:6px;overflow:auto}
  .note{font-size:.95rem;color:#333;margin-top:10px}
  .tips{margin-top:12px;background:#fff8e6;padding:10px;border-radius:6px;border:1px solid #ffe9a8}
  .alert{margin-top:12px;padding:10px;border-radius:6px}
  .ok{background:#e6ffed;border:1px solid #b7f5c5}
  .err{background:#ffecec;border:1px solid #ffb3b3;color:#a40000}
  .badge{display:inline-block;margin-left:.5rem;font-size:.85rem;padding:.15rem .45rem;border-radius:.5rem;background:#ffe9a8;border:1px solid #ffd76b;color:#8a6d00;vertical-align:middle}
  .muted{color:#555;font-size:.92rem}
  ul.list{list-style:none;padding-left:0;margin:14px 0 0}
  ul.list li{padding:8px 10px;border-bottom:1px solid #eee}
  .sub{color:#666;font-size:.9rem}
</style>
</head><body><div class="card">
  <h1>취약 로그인 실습 (In-band SQLi)</h1>
  <p class="warn">교육용 : 로컬에서만 실행하세요. 절대 외부에 올리지 마세요.</p>

  {% if flash_msg %}
    <div class="alert {{ 'ok' if flash_ok else 'err' }}">{{ flash_msg }}</div>
  {% endif %}

  <form method="post" id="loginForm">
    <label>Username
      <input type="text" name="username" id="username" autocomplete="off" value="{{ last_username or '' }}"/>
    </label>
    <label>Password
      <input type="password" name="password" id="password" autocomplete="off" value="{{ last_password or '' }}"/>
    </label>
    <button type="submit">Login</button>
  </form>

  <div class="payloads">
    <strong>페이로드 템플릿 (클릭하면 폼에 채워짐)</strong><br>
    <button onclick="fill(\`' OR '1'='1\`, \`\`); return false;">인증 우회(주석 無): ' OR '1'='1</button>
    <button onclick="fill(\`' OR '1'='1' -- \`, \`\`); return false;">인증 우회(주석 有): ' OR '1'='1' -- </button>
    <!-- 오류 유도 버튼 제거됨 -->
  </div>

  <hr>
  {% if executed_query %}
    <div class="note"><strong>실행된 쿼리:</strong>
      <span class="badge">{{ '취약' if vulnerable else '정상' }}</span>
      <pre>{{ executed_query }}</pre>
      {% if vulnerable %}<div class="muted">사용자 입력에서 SQL 인젝션 패턴이 감지되었습니다.</div>{% endif %}
    </div>
  {% endif %}

  <div class="tips">
    <strong>테스트 팁</strong>
    <ul>
      <li>샘플 계정: alice/alice_pw, bob/bob_pw, charlie/charlie_pw</li>
    </ul>
  </div>
</div>
<script>
  function fill(u, p){ document.getElementById('username').value=u; document.getElementById('password').value=p; }
</script>
</body></html>
"""

MYPAGE_HTML = """
<!doctype html><html lang="ko"><head>
<meta charset="utf-8"><title>마이페이지</title>
<style>
  body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f6f8fa;padding:2rem}
  .card{max-width:720px;margin:0 auto;background:#fff;padding:1.2rem 1.4rem;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.06)}
  h1{margin:0 0 12px 0;font-size:22px}
  .kv{margin:.35rem 0}
  .muted{color:#666}
  a.btn{display:inline-block;margin-top:10px;padding:8px 12px;border-radius:6px;background:#0366d6;color:#fff;text-decoration:none}
</style>
</head><body><div class="card">
  <h1>{{ user }}님, 반갑습니다.</h1>
  <div class="kv"><strong>이메일</strong> : {{ info.email }}</div>
  <div class="kv"><strong>전화번호</strong> : {{ info.phone }}</div>
  <div class="kv"><strong>주소</strong> : {{ info.address }}</div>
  <div class="muted" style="margin-top:12px">※ 교육용 데모. 실제 서비스에서는 절대 이렇게 구현하면 안 됩니다.</div>
  <a class="btn" href="{{ url_for('logout') }}">로그아웃</a>
</div></body></html>
"""

# ---------- 라우트 ----------
@app.route('/', methods=['GET', 'POST'])
def login():
    executed_query = None
    vulnerable = False
    flash_msg = None
    flash_ok = False
    last_username = None
    last_password = None

    if request.method == 'POST':
        db = get_db(); cur = db.cursor()
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        last_username, last_password = username, password

        # 기본(취약) 쿼리
        base_query = f"SELECT id, username, password FROM users WHERE username = '{username}' AND password = '{password}'"

        vulnerable = looks_like_sqli(username) or looks_like_sqli(password)
        rows = []

        if is_or_true_payload(username) and "--" not in username and "/*" not in username:
            executed_query = f"SELECT id, username, password FROM users WHERE username = '{username}' OR '1'='1'"
        else:
            executed_query = base_query

        try:
            cur.execute(executed_query)
            rows = cur.fetchall()
        except Exception:
            rows = []
            flash_msg = "처리 중 오류가 발생했습니다." 

        if rows:
            logged_user = rows[0]["username"]
            session['user'] = logged_user
            return redirect(url_for('mypage'))
        else:
            if not flash_msg:
                flash_msg = "ID/PW가 올바르지 않습니다."
            flash_ok = False

    return render_template_string(
        LOGIN_HTML,
        executed_query=executed_query,
        vulnerable=vulnerable,
        flash_msg=flash_msg, flash_ok=flash_ok,
        last_username=last_username, last_password=last_password
    )

@app.route('/mypage')
def mypage():
    user = session.get('user')
    if not user:
        return redirect(url_for('login'))
    db = get_db(); cur = db.cursor()
    cur.execute("SELECT username, phone, address, email FROM users WHERE username = ?", (user,))
    row = cur.fetchone()
    info = {"phone": row["phone"], "address": row["address"], "email": row["email"]} if row else {"phone":"-","address":"-","email":"-"}
    return render_template_string(MYPAGE_HTML, user=user, info=info)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# ---------- 엔트리 ----------
if __name__ == '__main__':
    with app.app_context():
        get_db()
    app.run()
`,
            },
            {
              type: 'p',
              content: [
                '1. alice, bob, charlie의 계정으로 로그인 해봅니다.\n2. Username 칸에 `‘ OR ‘1’=’1` 을 입력해봅니다.\n3. Username 칸에 `‘ OR ‘1’=’1’ --` 를 입력해봅니다.',
              ],
            },
            {
              type: 'p',
              content: [
                '위 이미지처럼 OR 페이로드를 사용하면 비밀번호 검증 부분이 무효화되어 정상적으로 로그인이 가능합니다. 단, `‘ OR ‘1’=’1` 같은 경우는 OR과 AND의 우선순위가 달라져 제대로 작동하지 않는 모습을 볼 수 있습니다.',
              ],
            },
            {
              type: 'p',
              content: [
                '추가로 현재 실습에서는 구현이 되어있지는 않지만, SQL injection에서 가장 문제가 되는 경우는 사실 아래와 같은 코드입니다.',
              ],
            },
            { type: 'code', text: "1'; DROP TABLE users--" },
            {
              type: 'p',
              content: [
                '아예 테이블 하나를 삭제시키는 명령어로, 매우 위험한 공격입니다.',
              ],
            },
            { type: 'h3', text: '핵심 포인트' },
            {
              type: 'code',
              text: `username = request.form.get('username', '')
password = request.form.get('password', '')

base_query = f"SELECT id, username, password FROM users WHERE username = '{username}' AND password = '{password}'"`,
            },
            {
              type: 'ul',
              items: [
                [
                  '사용자가 입력한 `username`, `password`값을 그대로 SQL문에 붙여버립니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: `executed_query = base_query

cur.execute(executed_query)`,
            },
            {
              type: 'ul',
              items: [
                [
                  '위에서 만들어진 SQL 문자열을 파라미터 없이 직접 실행하여 SQL injection이 터지게 됩니다.',
                ],
              ],
            },
          ],
        },
        {
          title: 'Blind SQLi (Boolean-based) (중급)',
          text: '공격자가 입력 필드(예: 게시판 댓글, 프로필, 상품평 등)에 악성 SQL 조각을 넣음 → 서버가 그 입력을 검증/파라미터화 없이 SQL 쿼리의 일부로 문자열 결합하여 DB에 전달·실행함 → DB 결과를 바로 보여주지 않지만(즉 응답 본문에 직접 데이터가 포함되진 않음), 페이지의 동작(예: 반환되는 페이지의 차이, HTTP 상태/길이, 처리 지연 등)이 입력에 따라 달라지므로 공격자는 이 차이를 반복적으로 관찰해 한 비트씩(또는 한 문자씩) 민감정보를 추론·복원함 → 결과적으로 직접 에러나 결과를 보지 못해도 데이터(유저네임, 패스워드 해시 등)를 시간이나 참/거짓 반응으로 빼낼 수 있음.',
          footer: '위험도: 높음',
          isToggle: true,
          details: [
            { type: 'h3', text: 'Blind SQLi 재현(중급)' },
            {
              type: 'p',
              content: [
                '- admin계정의 비밀번호를 알아내세요\n- substr() 함수를 이용하여 한 글자씩 알아내세요',
              ],
            },
            {
              type: 'code',
              text: `# blind_sqli.py
# - 샘플 계정: alice/alice123

from flask import Flask, request, render_template_string, session, redirect, url_for
import sqlite3, os, secrets, datetime

app = Flask(__name__)
app.secret_key = os.environ.get("DEMO_SECRET_KEY") or secrets.token_hex(16)
DB_FILE = "sqli_demo_blind.db"

# ---------- DB 초기화 ----------
def init_db():
    need_init = not os.path.exists(DB_FILE)
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    if need_init:
        cur.execute("""
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            created_at TEXT
        );
        """)
        now = datetime.datetime.utcnow().isoformat()
        cur.execute("INSERT INTO users (username, password, created_at) VALUES (?, ?, ?)",
                    ("admin", "admin123", now))
        cur.execute("INSERT INTO users (username, password, created_at) VALUES (?, ?, ?)",
                    ("alice", "alice123", now))
        conn.commit()
    conn.close()

# ---------- HTML 템플릿 (수정: value="{{ last_username or '' }}" 적용) ----------
TEMPLATE = """
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>Blind SQLi 실습 (Boolean)</title>
<style>
  body{font-family:system-ui,Roboto,Arial;background:#f7f8fa;padding:20px}
  .card{background:#fff;padding:20px;border-radius:8px;max-width:760px;margin:0 auto;box-shadow:0 6px 18px rgba(0,0,0,.06)}
  h1{margin:0 0 12px 0;font-size:20px}
  label{display:block;margin-top:8px}
  input[type=text], input[type=password], textarea{width:100%;padding:8px;border:1px solid #ddd;border-radius:6px}
  button{margin-top:8px;padding:8px 12px;border-radius:6px;border:none;background:#2468f2;color:white;cursor:pointer}
  .muted{color:#666;font-size:.9rem}
  .ok{background:#e8f8ea;padding:10px;border-radius:6px;color:#0a6e2b}
  .err{background:#fff0f0;padding:10px;border-radius:6px;color:#a02b2b}
  pre{background:#f3f4f6;padding:10px;border-radius:6px;overflow:auto}
  .notes{margin-top:12px}
  .note-item{padding:6px 8px;border-bottom:1px solid #eee}
  .small{font-size:.85rem;color:#666}
  a.logout{font-size:.9rem;margin-left:8px;color:#2468f2}
</style>
</head>
<body>
  <div class="card">
    <h1>Boolean-Based Blind SQL Injection 실습</h1>
    <p class="muted">⚠️ 교육용: 로컬(127.0.0.1) 전용. 절대 외부에 배포하지 마세요.</p>

    {% if not session.get('user') %}
    <form method="post" action="{{ url_for('login') }}">
      <label>아이디</label>
      <input type="text" name="username" value="{{ last_username or '' }}" required>
      <label>비밀번호</label>
      <input type="password" name="password" value="{{ last_password or '' }}" required>
      <button type="submit">로그인</button>
    </form>
    {% else %}
    <div class="ok"><strong>{{ session.get('user') }}</strong> 님, 로그인 상태입니다.
      <a class="logout" href="{{ url_for('logout') }}">(로그아웃)</a>
    </div>
    {% endif %}

    {% if msg %}
      <div class="{{ 'ok' if success else 'err' }}" style="margin-top:10px;">{{ msg }}</div>
    {% endif %}

    <hr style="margin:16px 0">

    <h3>메모장 (세션 기반)</h3>
    <form method="post" action="{{ url_for('add_note') }}">
      <textarea name="note" rows="3" placeholder="찾아낸 비밀번호나 메모를 적어두세요..."></textarea>
      <button type="submit">메모 추가</button>
      <button type="submit" formaction="{{ url_for('clear_notes') }}" style="background:#999;margin-left:8px;">전체 삭제</button>
    </form>

    <div class="notes">
      {% if notes %}
        {% for n in notes %}
          <div class="note-item"><strong class="small">{{ n.ts }}</strong> — {{ n.text }}</div>
        {% endfor %}
      {% else %}
        <div class="muted">메모가 없습니다.</div>
      {% endif %}
    </div>

    <hr style="margin:16px 0">
    <p class="small">초기 샘플 계정: <code>alice / alice123</code></p>
    <p class="small">설명: 이 실습은 서버의 내부 쿼리 결과를 화면에 노출하지 않고, 오직 로그인 성공/실패(참/거짓)만을 반환하도록 구성되어 있습니다. 공격자는 이 응답만으로 조건식의 참/거짓을 판별해 정보를 추출합니다.</p>
  </div>
</body>
</html>
"""

# ---------- 라우트: 메인 ----------
@app.route("/", methods=["GET"])
def index():
    return render_template_string(TEMPLATE,
                                  msg=None,
                                  success=False,
                                  notes=session.get("notes", []),
                                  last_username=None,
                                  last_password=None)

# ---------- 라우트: 로그인 (Boolean-based blind 동작) ----------
@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username", "").strip()
    password = request.form.get("password", "").strip()

    # 세션 메모 준비
    session.setdefault("notes", session.get("notes", []))

    login_ok = False

    # **취약성 재현**: 사용자가 입력한 값을 그대로 취약한 SELECT 쿼리로 구성하여 실행.
    # 단, 화면에 쿼리나 상세 에러는 절대 노출하지 않음 — 오직 성공/실패(참/거짓)만 반환.
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    vuln_query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}';"

    try:
        cur.execute(vuln_query)
        row = cur.fetchone()
        if row:
            login_ok = True
        else:
            login_ok = False
    except Exception:
        login_ok = False
    finally:
        conn.close()

    if login_ok:
        session['user'] = username
        msg = "로그인 성공!"
        success = True
    else:
        msg = "로그인 실패."
        success = False

    return render_template_string(TEMPLATE,
                                  msg=msg,
                                  success=success,
                                  notes=session.get("notes", []),
                                  last_username=username if not success else "",
                                  last_password="")

# ---------- 라우트: 로그아웃 ----------
@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("index"))

# ---------- 라우트: 메모 추가 / 삭제 ----------
@app.route("/add_note", methods=["POST"])
def add_note():
    note = request.form.get("note", "").strip()
    if note:
        notes = session.get("notes", [])
        notes.insert(0, {"ts": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "text": note})
        session['notes'] = notes[:200]
    return redirect(url_for("index"))

@app.route("/clear_notes", methods=["POST"])
def clear_notes():
    session['notes'] = []
    return redirect(url_for("index"))

# ---------- 앱 시작 ----------
if __name__ == "__main__":
    init_db()
    print("⚠️ BLIND-SQLi 실습 앱 시작 (로컬 전용). 샘플 계정: admin/admin123, alice/alice123")
    app.run(host="127.0.0.1", port=5000, debug=False)
`,
            },
            {
              type: 'nested-list',
              items: [
                {
                  content: [
                    '1. admin 계정의 비밀번호를 알기 위해 오른쪽 이미지와 같이 명령어를 입력합니다.',
                  ],
                },
                {
                  content: [
                    '2. 만약 admin 계정의 비밀번호의 가장 앞자리가 a로 시작하는 경우, 로그인에 성공하게 됩니다.',
                  ],
                },
                {
                  content: [
                    '3. substr(password, 1, x) 에서 x의 값을 바꿔가며 admin의 비밀번호를 찾아냅니다.',
                  ],
                  subItems: [
                    ["admin' AND substr(password, 1, 1)='a'—"],
                    ["admin' AND substr(password, 1, 2)='ad'—"],
                    ["admin' AND substr(password, 1, 3)='adm'—"],
                    ['…'],
                  ],
                },
              ],
            },
            { type: 'h3', text: '핵심 포인트' },
            {
              type: 'code',
              text: "vuln_query = f\"SELECT * FROM users WHERE username = '{username}' AND password = '{password}';\"",
            },
            {
              type: 'ul',
              items: [
                [
                  '사용자 입력을 그대로 f-string 문자열로 연결하여 SQL구문을 조작할 수 있습니다.',
                ],
              ],
            },
            {
              type: 'nested-list',
              items: [
                {
                  content: ['로그인 시도 제한이 없음'],
                  subItems: [
                    ['자동화된 무차별 대입 브루트포스 공격이 가능합니다.'],
                  ],
                },
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
      content: [
        'SQL Injection 방어는 ‘입력이 쿼리에서 어디에 들어가느냐(값·식별자·구조)’에 따라 대응이 달라집니다. 같은 문자열도 값 자리로 들어가면 단순 데이터지만, 식별자나 쿼리 구조 자리에 끼어들면 코드로 해석이 되기 때문입니다. 그래서 “모든 따옴표를 치환” 같은 단일 규칙만으로는 안전하지 않고, 컨텍스트별 원칙을 지켜야 합니다.',
      ],
    },
    { type: 'h3', text: '컨텍스트별 원칙' },
    { type: 'h4', text: '값(Value) 자리 → 바인딩을 하자.' },
    {
      type: 'ul',
      items: [
        ['바인딩이란?'],
        ['SQL 쿼리 실행할 때 **변수(파라미터)와 실제 값**을 연결하는 것.'],
        ['예:'],
      ],
    },
    { type: 'code', text: 'SELECT * FROM users WHERE id = :id;' },
    {
      type: 'ul',
      items: [
        [
          '여기서 ',
          { type: 'code', text: ':id' },
          ' 자리에 실제 값 ',
          { type: 'code', text: '123' },
          '을 “바인딩”한다고 합니다.',
        ],
        ['입력을 코드가 아닌 데이터로 고정합니다.'],
      ],
    },
    {
      type: 'code',
      text: 'cur.execute("SELECT * FROM users WHERE name = ?", (user_input,))',
    },
    {
      type: 'ul',
      items: [
        [
          '위 코드처럼 문자열 연결(',
          { type: 'code', text: '... + userInput' },
          ')을 하지 않고, 준비된 문(Prepared Statement) + 바인딩을 사용해서 입력을 “코드가 아닌 데이터”로 고정합니다.',
        ],
      ],
    },
    { type: 'h4', text: '식별자(Identifier) 자리 → 허용목록만 끼워넣자' },
    {
      type: 'ul',
      items: [
        [
          '테이블/컬럼/정렬필드 이름은 **바인딩이 불가**합니다. 반드시 **허용목록(allowlist) 매핑**으로 해야합니다.',
        ],
      ],
    },
    {
      type: 'code',
      text: 'const allow = { name: "name", created: "created_at" };\nconst key = allow[req.query.orderBy] || "created_at"; // 기본값\nconst sql = `SELECT * FROM users ORDER BY ${key} DESC`;',
    },
    {
      type: 'ul',
      items: [
        [
          '예) ',
          { type: 'code', text: 'orderBy' },
          ' 값이 **허용 목록**(',
          { type: 'code', text: "['name', 'created_at']" },
          ')에 포함될 때에만 **쿼리 템플릿**에 삽입하고, 그 외 값은 기본값(',
          { type: 'code', text: "'created_at'" },
          ')으로 대체합니다. 임의 입력을 따옴표로 감싸기만 해서는 안전하지 않습니다.',
        ],
      ],
    },
    { type: 'h4', text: '쿼리 구조(Structure) 자리 → 옵션 고정/분기' },
    {
      type: 'ul',
      items: [
        [
          { type: 'code', text: 'ASC|DESC' },
          ', ',
          { type: 'code', text: 'AND/OR' },
          ', ',
          { type: 'code', text: 'LIMIT/OFFSET' },
          '연산자 같은 키워드/절 구조는 자유 입력을 받지 말고 미리 정한 옵션에서만 선택하도록 합니다. 필요한 경우 템플릿을 분기(두세 가지 고정 패턴)로 나눠 처리해야합니다.',
        ],
      ],
    },
    {
      type: 'code',
      text: 'const dir = req.query.dir === "asc" ? "ASC" : "DESC";\nconst limit = [10, 20, 50].includes(Number(req.query.limit)) ? Number(req.query.limit) : 10;\nconst sql = `SELECT * FROM posts ORDER BY created_at ${dir} LIMIT ${limit}`;',
    },
    { type: 'h4', text: 'LIKE 검색' },
    {
      type: 'ul',
      items: [
        [
          { type: 'code', text: '%' },
          '와 ',
          { type: 'code', text: '_' },
          '는 와일드카드이므로 입력을 **패턴 이스케이프**하고 ',
          { type: 'code', text: "WHERE title LIKE ? ESCAPE '\\\\'" },
          ' 같은 방식으로 바인딩합니다. (단순 치환보다 “바인딩 + ESCAPE”가 안전)',
        ],
        [
          '서버에서 ',
          { type: 'code', text: 'user_input' },
          '의 ',
          { type: 'code', text: '\\\\ % _' },
          '를 ',
          { type: 'code', text: '\\\\\\\\ % \\\\_' },
          '로 바꾼 후 ',
          { type: 'code', text: '"%"+값+"%"' },
          ' 형태로 바인딩.',
        ],
      ],
    },
    { type: 'h4', text: '숫자/날짜 검증' },
    {
      type: 'ul',
      items: [
        [
          '캐스팅/정규식 체크만으로 끝내지 말고 **최종적으로도 바인딩**하세요. “숫자만 받는다” 해도 문자열 연결은 위험합니다.',
        ],
      ],
    },
    { type: 'h3', text: '그 외 필수 수칙' },
    {
      type: 'ul',
      items: [
        [
          '**권한 최소화**: 앱 계정은 꼭 필요한 권한만(읽기/쓰기 분리, DDL 금지 등).',
        ],
        [
          '**에러 처리**: DB 에러 메시지(쿼리/스키마 노출) 클라이언트에 보여주지 않고 서버 로그에만 남기기. (DB 에러 메시지 만으로도 어떤 DB를 쓰는지, 어떤 명령어를 써야하는지 알 수 있습니다.)',
        ],
        ['**ORM 사용 시**: 쿼리 빌더/바인딩 API만 사용, raw SQL은 검토·제한.'],
        [
          '**스토어드 프로시저**: 내부에서 동적 SQL을 만들면 취약해질 수 있음—동적 부분엔 동일한 원칙(바인딩/허용목록) 적용.',
        ],
        ['**정기 점검**: 코드 리뷰, SAST/DAST, 준비된 문 강제 린트 규칙.'],
        [
          '**보조 수단**: WAF는 “마지막 방어선”. 설계 단계의 바인딩/허용목록이 본체입니다.',
        ],
      ],
    },
    {
      type: 'p',
      content: [
        '**요약:** SQLi 방어의 핵심은 *입력을 항상 데이터로만 처리*하도록 **바인딩(값)**, **허용목록(식별자/구조)**, **템플릿 고정(쿼리 구조)**를 적재적소에 적용하는 것입니다. 단일한 “치환 규칙”으로는 결코 충분하지 않습니다.',
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '6. 안전한 코드 예시' },
    { type: 'h3', text: 'PHP (MySQLi - Prepared Statement)' },
    {
      type: 'code',
      text: `$stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND pw = ?");
$stmt->bind_param("ss", $id, $pw);
$stmt->execute();`,
    },
    { type: 'h3', text: 'Node.js (MySQL)' },
    {
      type: 'code',
      text: `db.query("SELECT * FROM users WHERE id = ? AND pw = ?", [id, pw], (err, rows) => {
  res.json(rows);
});`,
    },
    { type: 'h3', text: 'Python (Flask + SQLite)' },
    {
      type: 'code',
      text: `cur.execute("SELECT * FROM users WHERE id = ? AND pw = ?", (id, pw))`,
    },
    { type: 'hr' },
    { type: 'h2', text: '7. 체크리스트' },
    {
      type: 'checklist',
      items: [
        ['Prepared Statement를 모든 쿼리에 적용했는가?'],
        ['문자열 연결로 SQL을 만드는 코드가 없는가?'],
        ['에러 메시지가 사용자에게 그대로 노출되지 않는가?'],
        ['DB 계정에 최소 권한만 부여했는가?'],
        ['검색/정렬 파라미터는 화이트리스트로 제한했는가?'],
        ['코드 리뷰 시 SQL 문법이 동적으로 변하는 부분이 있는가?'],
      ],
    },
  ],
};
