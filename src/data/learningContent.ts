// Force cache bust
import heroImage from '../assets/images/이론학습 상세.png';

export type InlineContent = string | { type: 'code'; text: string };

export type ContentBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'h4'; text: string }
  | { type: 'p'; content: InlineContent[] }
  | { type: 'ul'; items: InlineContent[][] }
  | { type: 'code'; text: string }
  | { type: 'hr' }
  | { type: 'checklist'; items: InlineContent[][] }
  | {
      type: 'grid';
      items: {
        title: string;
        text: string;
        footer: string;
        isToggle?: boolean;
        details?: ContentBlock[];
      }[];
    }
  | { type: 'warning'; message?: string }
  | { type: 'principle'; text: string };

export interface LearningTopic {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  difficulty: '쉬워요' | '보통' | '어려워요';
  isCompleted?: boolean;
  content: ContentBlock[];
}

export const learningTopics: { [key: string]: LearningTopic } = {
  xss: {
    id: 'xss',
    title: 'XSS (Cross-Site Scripting)',
    subtitle:
      '사용자의 입력을 필터링하지 않고 그대로 출력할 때, 악성 스크립트를 삽입해 실행시키는 취약점.',
    imageUrl: heroImage,
    description:
      '사용자의 입력을 필터링하지 않고 그대로 출력할 때, 악성 스크립트를 삽입해 실행시키는 취약점.',
    difficulty: '쉬워요',
    isCompleted: true,
    content: [
      { type: 'warning' },
      { type: 'h2', text: '개요 & 학습 목표' },
      {
        type: 'p',
        content: [
          '이 챕터에서는 크로스 사이트 스크립팅(XSS)의 기본 개념을 이해하고, 다양한 유형의 XSS 공격을 식별하며, 안전한 코딩 관행을 통해 이를 방어하는 방법을 학습합니다. 실습을 통해 실제 공격 시나리오를 경험하고, 효과적인 방어 전략을 구축하는 것을 목표로 합니다.',
        ],
      },
      { type: 'hr' },
      { type: 'h2', text: 'XSS란 무엇인가?' },
      {
        type: 'p',
        content: [
          'XSS(Cross Site Script)는 악의적인 사용자가 공격하려는 사이트에 스크립트를 넣는 기법을 말한다. 공격에 성공하면 사이트에 접속한 사용자는 삽입된 코드를 실행하게 되며, 보통 의도치 않은 행동을 수행시키거나 쿠키나 세션 토큰 등의 민감한 정보를 탈취합니다. 쉽게 말해 "공격자가 웹 페이지에 악성 스크립트를 삽입 → 다른 사용자의 브라우저에서 실행"되는 문제입니다.',
        ],
      },
      { type: 'h3', text: '훔칠 수 있는 권한' },
      {
        type: 'ul',
        items: [
          [{ type: 'code', text: 'document.cookie' }, '로 접근 가능한 쿠키'],
          ['DOM 조작으로 화면 변조(피싱 UI)'],
          [
            '사용자의 입력으로 인증 토큰 등 탈취(예: ',
            { type: 'code', text: 'localStorage' },
            ')',
          ],
          ['키입력 가로채기(키로거 스크립트) 등'],
        ],
      },
      { type: 'h3', text: '문제의 핵심' },
      {
        type: 'p',
        content: [
          '데이터(입력)를 검증하지 않고, 출력 시 문맥에 맞는 처리를 하지 않음.',
        ],
      },
      { type: 'hr' },
      { type: 'h2', text: 'XSS 종류' },
      {
        type: 'grid',
        items: [
          {
            title: 'Stored XSS (저장형)',
            text: '공격자가 입력(예: 게시판 댓글, 프로필, 리뷰)에 악성 스크립트를 저장 → 다른 사용자가 해당 페이지를 열 때 서버에서 DB로부터 불러와 그대로 렌더링 → 공격 실행',
            footer: '위험도: 매우 높음',
            isToggle: true,
            details: [
              { type: 'h2', text: '저장형 XSS 재현 (중급)' },
              {
                type: 'p',
                content: [
                  '댓글에 ',
                  {
                    type: 'code',
                    text: '<script>alert(document.cookie)</script>',
                  },
                  ' 를 저장하고, 다른 세션에서 해당 게시물을 열어보세요.',
                ],
              },
              {
                type: 'code',
                text: `# vuln_xss_with_login.py
# 교육용: 간단한 로그인 기능이 추가된 저장형 XSS 실습 앱 (로컬 전용)
from flask import Flask, request, redirect, render_template_string, session, url_for

app = Flask(__name__)
app.secret_key = "dev-secret-key-change-this"  # 로컬 테스트 전용

# 간단한 유저(실습용)
USERS = {
    'attacker': 'pw1',
    'victim': 'pw2'
}

# 메모리 댓글 저장 (실습용)
comments = []

INDEX_HTML = """
<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Stored XSS w/ Login (Vulnerable)</title></head>
  <body>
    <h1>저장형 XSS 실습 (로그인 포함)</h1>

    {% if user %}
      <p>로그인: <strong>{{ user }}</strong> | <a href="{{ url_for('logout') }}">로그아웃</a></p>

      <!-- 댓글 폼 -->
      <form method="post" action="/comment">
        <label>댓글: <br><textarea name="comment" rows="4" cols="40"></textarea></label><br>
        <button type="submit">등록</button>
      </form>
    {% else %}
      <p>로그인하지 않았습니다. <a href="{{ url_for('login') }}">로그인</a>하세요.</p>
    {% endif %}

    <h2>등록된 댓글</h2>
    <ul>
      {% for c in comments %}
        <!-- 취약 포인트: safe로 출력 -> 스크립트 실행됨 -->
        <li><strong>{{ c.user }}</strong>: {{ c.comment|safe }}</li>
      {% endfor %}
    </ul>

    <p style="color: red;">⚠️ 이 앱은 의도적으로 취약합니다. 로컬에서만 테스트하세요.</p>
  </body>
</html>
"""

LOGIN_HTML = """
<!doctype html>
<html><body>
  <h1>로그인</h1>
  <form method="post">
    <label>아이디: <input name="username"></label><br>
    <label>비밀번호: <input name="password" type="password"></label><br>
    <button type="submit">로그인</button>
  </form>
  <p><a href="{{ url_for('index') }}">돌아가기</a></p>
</body></html>
"""

@app.route('/')
def index():
    user = session.get('user')
    return render_template_string(INDEX_HTML, user=user, comments=comments)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        u = request.form.get('username','')
        p = request.form.get('password','')
        if USERS.get(u) == p:
            session['user'] = u
            return redirect(url_for('index'))
        else:
            return "로그인 실패 (로컬 실습용). <a href='/login'>다시</a>"
    return render_template_string(LOGIN_HTML)

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))

@app.route('/comment', methods=['POST'])
def comment():
    user = session.get('user')
    if not user:
        return "로그인이 필요합니다", 403
    comment = request.form.get('comment','')
    # 취약: 입력 검증/정제 없이 저장
    comments.append({'user': user, 'comment': comment})
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
`,
              },
              {
                type: 'p',
                content: [
                  '[attacker / pw1] 공격자 계정으로 로그인 후 왼쪽 이미지와 같이 스크립트 댓글을 남깁니다.',
                  '\n[victim / pw2] 다른 사용자 계정으로 로그인을 하게 되면 스크립트가 터집니다.',
                ],
              },
              {
                type: 'principle',
                text: '위 이미지에서 보이듯 일반적인 댓글 서비스처럼 보이지만, 공격자가 악의를 가지고 이름이나 댓글창 같은 입력창에 <script>alert("1");</script> 같은 스크립트를 작성하게 되면 다른 세션(다른 아이디)으로 해당 게시글에 접근했을때 스크립트가 실행되는것을 볼 수 있습니다.',
              },
              { type: 'h3', text: '핵심 포인트' },
              {
                type: 'code',
                text: "comments.append({'name': name, 'comment': comment})",
              },
              {
                type: 'p',
                content: [
                  { type: 'code', text: 'comments' },
                  '에 ',
                  { type: 'code', text: 'name' },
                  '과 ',
                  { type: 'code', text: 'comment' },
                  '가 검증없이 공격자가 작성한 그대로 들어갑니다.',
                ],
              },
              {
                type: 'code',
                text: '<li><strong>{{ c.name }}</strong>: {{ c.comment|safe }}</li>',
              },
              {
                type: 'p',
                content: [
                  '기존 Jinja 템플릿에서는 사용자 입력을 자동으로 escape하지만, ',
                  { type: 'code', text: '|safe' },
                  ' 옵션으로 인해 사용자의 입력을 그대로 HTML로 넣게 됩니다.\n즉, 서버에 저장된 ',
                  { type: 'code', text: 'c.comment' },
                  '가 ',
                  { type: 'code', text: 'HTML' },
                  '로 해석되어 실행됩니다.',
                ],
              },
            ],
          },
          {
            title: 'Reflected XSS (반사형)',
            text: '악성 스크립트가 URL 파라미터/POST 데이터 등에 담겨 서버 응답에 반영되어 즉시 실행됨. 보통 공격자는 URL을 만들어 피해자에게 클릭 유도(피싱 이메일, 채팅 등).',
            footer: '위험도: 높음',
          },
          {
            title: 'DOM-based XSS (DOM 기반)',
            text: '서버 응답은 안전하지만 브라우저 내 자바스크립트가 URL/fragment/cookie 등 클라이언트 측 데이터를 DOM에 안전하지 않게 반영할 때 발생. 서버는 균열이 없음.',
            footer:
              '주의: 복잡한 SPA(React/Vue/Angular)에서도 실수로 DOM XSS가 발생할 수 있음.',
          },
        ],
      },
      { type: 'hr' },
      { type: 'h2', text: '방어 원칙(상세) — 컨텍스트 기반 접근' },
      {
        type: 'p',
        content: [
          'XSS 방어는 ‘어떤 문맥에서 출력되는가(HTML, Attribute, JS, URL, CSS)’ 를 기준으로 다르게 처리해야 합니다. ',
          { type: 'code', text: '<' },
          ' 를 HTML 본문에 넣었을 때는 태그로, 문자열 리터럴 안에 넣으면 문자로, URL 파라미터로 넣으면 경로의 일부로 해석됩니다. 따라서 단순히 모든 ',
          { type: 'code', text: '<' },
          '를 바꾸는 것만으로는 부족하고, 출력되는문맥별로 적합한 인코딩(escaping/encoding)을 적용해야 안전합니다.',
        ],
      },
      {
        type: 'principle',
        text: '핵심원칙 : 언제나 출력(렌더링) 시점에 인코딩하라. (입력 시점만 처리하면 우회될 수 있음)',
      },
      { type: 'h3', text: '4.1 출력(출력 컨텍스트)별 안전 처리' },
      { type: 'h4', text: 'HTML 본문 (문맥: 보이는 텍스트)' },
      {
        type: 'p',
        content: [
          '무엇을 : HTML 이스케이프 (',
          { type: 'code', text: '<' },
          ', ',
          { type: 'code', text: '>' },
          ', ',
          { type: 'code', text: '&' },
          ', ',
          { type: 'code', text: '"' },
          ', ',
          { type: 'code', text: "'" },
          ' → ',
          { type: 'code', text: '&lt;' },
          ' 등)',
        ],
      },
      { type: 'p', content: ['왜 : 태그로 해석되는 걸 막음'] },
      {
        type: 'p',
        content: [
          '한 줄 처리법 : 템플릿 자동 이스케이프 / ',
          { type: 'code', text: 'textContent' },
          ' 사용',
        ],
      },
      {
        type: 'code',
        text: 'el.textContent = userInput; // JS\nhtml.escape(s); // Python',
      },
      { type: 'h4', text: 'HTML 속성 (예: title="...")' },
      { type: 'p', content: ['무엇을 : attribute-encoding + 따옴표로 감싸기'] },
      {
        type: 'p',
        content: [
          '왜 : 따옴표 탈출로 이벤트 속성(onerror) 등으로 이어지는 걸 막음',
        ],
      },
      {
        type: 'p',
        content: [
          '한 줄 처리법 : DOM API로 설정 (',
          { type: 'code', text: 'setAttribute' },
          ')',
        ],
      },
      { type: 'code', text: "el.setAttribute('title', userInput);" },
      { type: 'h4', text: 'JavaScript context (inline JS, eval 등)' },
      {
        type: 'p',
        content: [
          '무엇을 : JS 안전 직렬화 (문자열 내부에 넣지 말고 JSON 사용)',
        ],
      },
      {
        type: 'p',
        content: ['왜 : 따옴표/문자열 종결로 코드 주입되는 걸 막음'],
      },
      {
        type: 'p',
        content: ['한 줄 처리법 : 서버에서 JSON 직렬화 → 클라이언트에서 파싱'],
      },
      {
        type: 'code',
        text: 'const data = JSON.parse("{{ server_obj|tojson }}");\nconst s = JSON.stringify(userInput);',
      },
      { type: 'h4', text: 'URL context: URL-encoding (encodeURIComponent)' },
      { type: 'p', content: ['무엇을 : URL-encoding'] },
      {
        type: 'p',
        content: [
          '왜 : ',
          { type: 'code', text: '?q=<script>' },
          '처럼 URL이 해석되는 걸 방지',
        ],
      },
      { type: 'p', content: ['한 줄 처리법 : encodeURIComponent'] },
      {
        type: 'code',
        text: "const url = '/search?q=' + encodeURIComponent(q);",
      },
      {
        type: 'h4',
        text: 'CSS context: CSS escape (드물지만 스타일 값에 사용 시 필요)',
      },
      {
        type: 'p',
        content: [
          '무엇을 : CSS escape (또는 가능한 한 사용자 입력을 스타일에 직접 넣지 않기)',
        ],
      },
      { type: 'p', content: ['왜 : url(javascript:...) 등 악용 방지'] },
      {
        type: 'p',
        content: ['한 줄 처리법 : CSS.escape() 또는 화이트리스트 사용'],
      },
      {
        type: 'code',
        text: "el.style.setProperty('--name', CSS.escape(userInput));",
      },
      { type: 'h3', text: '4.2 서버-사이드 방어 권장사항' },
      { type: 'h4', text: '입력 검증 (Validation) — 화이트리스트 우선' },
      {
        type: 'p',
        content: [
          '원칙 : 허용되는 값(문자, 길이, 포맷)을 명확히 정의(예: 이메일, 숫자, YYYY-MM-DD 등).',
        ],
      },
      {
        type: 'ul',
        items: [
          ['이메일: 정규표현식 + 길이 제한'],
          ['사용자 이름: 알파벳/숫자/밑줄만 허용, 길이 3~30'],
        ],
      },
      {
        type: 'p',
        content: [
          '주의 : 입력 검증은 보조 수단일 뿐, 출력 인코딩을 대체하지 않음(방어 중복).',
        ],
      },
      { type: 'h4', text: '출력 인코딩(우선순위)' },
      {
        type: 'p',
        content: [
          'Always escape on output — 데이터가 어디에 찍히는지(HTML / attr / js / url / css)에 따라 적절히 인코딩.',
        ],
      },
      {
        type: 'p',
        content: ['템플릿 엔진의 auto-escape 기능을 활용하라.'],
      },
      { type: 'h4', text: 'HTTPOnly / Secure / SameSite 쿠키' },
      {
        type: 'p',
        content: [
          '세션 쿠키를 HttpOnly로 설정하면 JavaScript에서 읽지 못함(',
          { type: 'code', text: 'document.cookie' },
          '로 접근 불가).',
        ],
      },
      { type: 'p', content: ['Secure는 HTTPS에서만 전송하도록 함.'] },
      {
        type: 'p',
        content: ['SameSite=Strict 또는 Lax로 CSRF 리스크 감소.'],
      },
      { type: 'h4', text: 'Content-Security-Policy (CSP)' },
      {
        type: 'p',
        content: [
          '핵심 : 브라우저가 실행할 자원(스크립트, 스타일, 이미지 등)의 출처/유형을 제어.',
        ],
      },
      {
        type: 'ul',
        items: [
          [
            { type: 'code', text: 'nonce-...' },
            ': 서버가 각 응답마다 고유 nonce를 발급하고 ',
            { type: 'code', text: '<script nonce="...">' },
            ' 로 스크립트를 허용하는 방식.',
          ],
          [
            'hash 기반(',
            { type: 'code', text: "script-src 'sha256-...'" },
            ')도 사용 가능.',
          ],
        ],
      },
      {
        type: 'p',
        content: [
          '주의: CSP는 강력하지만 설정 실수(',
          { type: 'code', text: 'unsafe-inline' },
          ', 등)하면 의미가 없다.',
        ],
      },
      { type: 'h4', text: '프레임워크/라이브러리 활용' },
      {
        type: 'ul',
        items: [
          ['템플릿 엔진의 자동 이스케이프 사용 (예: Django, Jinja)'],
          [
            'React / Vue 같은 프론트엔드 프레임워크는 기본적으로 텍스트 바인딩은 이스케이프(단, ',
            { type: 'code', text: 'dangerouslySetInnerHTML' },
            ' 주의)',
          ],
          [
            'HTML sanitizers: 서버측 bleach(Python), OWASP Java HTML Sanitizer, 클라이언트측 DOMPurify 등 — 화이트리스트 기반 사용 권장',
          ],
        ],
      },
      { type: 'hr' },
      { type: 'h2', text: '5. 프레임워크 & 라이브러리별 주의점 (실무 팁)' },
      {
        type: 'ul',
        items: [
          [
            'React: JSX는 기본적으로 텍스트를 안전하게 렌더링(자동 이스케이프). 단, ',
            { type: 'code', text: 'dangerouslySetInnerHTML' },
            ' 사용 금지.',
          ],
          [
            'Angular: 바인딩은 기본 이스케이프. ',
            { type: 'code', text: '$sce.trustAsHtml' },
            ' 남용 금지.',
          ],
          [
            'Vue: 텍스트 바인딩은 안전. ',
            { type: 'code', text: 'v-html' },
            ' 사용 시 주의.',
          ],
          [
            '템플릿 엔진: 템플릿 변수를 반드시 이스케이프(default)로 출력. 개발자가 직접 raw 출력을 요구하면 위험.',
          ],
        ],
      },
      { type: 'hr' },
      { type: 'h2', text: '6. 체크리스트 (개발/리뷰 시 사용)' },
      {
        type: 'checklist',
        items: [
          ['템플릿/렌더러가 자동 이스케이프를 사용 중인가?'],
          [
            '출력 컨텍스트(HTML, attribute, JS, URL)에 맞는 인코딩을 적용했는가?',
          ],
          [
            { type: 'code', text: 'innerHTML' },
            ', ',
            { type: 'code', text: 'eval' },
            ', ',
            { type: 'code', text: 'document.write' },
            ' 등의 사용을 최소화했는가?',
          ],
          ['외부 스크립트는 신뢰된 출처만 사용하고 있는가?'],
          ['쿠키에 HttpOnly/Secure/SameSite가 설정되어 있는가?'],
          ['CSP 헤더를 적절히 설정했는가(단, 테스트 후 단계적으로 적용)?'],
          [
            '민감 데이터를 클라이언트 저장소(',
            { type: 'code', text: 'localStorage' },
            ' 등)에 보관하지 않는가?',
          ],
          ['정기적으로 자동 스캔/수동 점검을 수행하는가?'],
        ],
      },
    ],
  },
};
