import heroImage from '../assets/images/이론학습 상세.png';
import type { LearningTopic } from '../types/learning';

export const openRedirect: LearningTopic = {
  id: 'open-redirection',
  title: 'Open Redirect (오픈 리다이렉션)',
  subtitle:
    '정상 사이트의 URL을 이용해 공격자가 원하는 악성 사이트로 리다이렉트시키는 취약점.',
  imageUrl: heroImage,
  description:
    '정상 사이트의 URL을 이용해 공격자가 원하는 악성 사이트로 리다이렉트시키는 취약점.',
  difficulty: '쉬워요',
  isCompleted: false,
  content: [
    { type: 'warning' },
    { type: 'h2', text: '1. 개요 & 학습 목표' },
    {
      type: 'ul',
      items: [
        ['Open Redirect의 개념과 동작 원리를 이해한다.'],
        ['공격 시나리오(피싱·세션 탈취 연계 등)를 설명할 수 있다.'],
        [
          '취약한 코드를 찾아 재현해보고, 안전하게 고치는 방법(허용목록, 상대경로 사용 등)을 실습한다.',
        ],
        ['탐지 및 테스트 방법(수동/자동)과 코드 리뷰 체크리스트를 익힌다.'],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '2. Open Redirect란 무엇인가?' },
    {
      type: 'p',
      content: [
        '웹 애플리케이션이 외부 URL(사용자가 제공한 값 등)을 검증 없이 그대로 리다이렉트(redirect)할 때 발생하는 취약점입니다. 쉽게말해 사용자가 클릭하면 정상 사이트처럼 보이지만, 서버가 ‘여기로 가라’고 보낸 링크가 공격자가 만든 피싱 사이트로 이동하는 경우입니다.',
      ],
    },
    {
      type: 'ul',
      items: [
        ['XSS는 악성 스크립트 실행 → 브라우저 내 권한 사용'],
        ['Open Redirect는 사용자를 다른(악성) 사이트로 "넘겨주는" 문제.'],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '3. 왜 위험한가?' },
    {
      type: 'ul',
      items: [
        [
          '피싱 효율 상승: 악성 사이트로 자연스럽게 유도 → 사용자 신뢰를 악용해 자격증명 탈취 가능.',
        ],
        [
          '2차 공격 연결: Open Redirect 링크에 악성 파라미터(예: XSS 페이로드)를 결합하거나, 세션 하이재킹·CSRF 등과 연계될 수 있음.',
        ],
        [
          '브랜드/신뢰도 손상: 신뢰받는 도메인에서 악성 사이트로 이동하면 피해자/기업 모두 타격.',
        ],
        ['보안 제품 우회: 일부 필터가 신뢰 도메인을 우선 허용하면 우회 가능.'],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '4. OpenRedirection 종류' },
    {
      type: 'grid',
      items: [
        {
          title: '쿼리파라미터 기반 즉시 리다이렉트',
          text: "'next' 파라미터를 검증하지 않고 'redirect()'에 바로 넘긴다 → 외부 사이트로 즉시 이동.",
          footer: '',
          isToggle: true,
          details: [
            { type: 'h3', text: '쿼리파라미터 기반 즉시 리다이렉트 재현' },
            {
              type: 'ul',
              items: [
                ['버튼을 눌러 악의적인 URL(네이버)로 이동해보세요'],
                ['next 파라미터를 통해 악의적인 URL(네이버)로 이동해보세요'],
              ],
            },
            {
              type: 'code',
              text: `# vuln_open_redirect.py
# 교육용: 쿼리파라미터 기반 Open Redirect 취약 예제 (로컬 전용)
from flask import Flask, request, redirect, url_for, render_template_string

app = Flask(__name__)

INDEX = """
<!doctype html>
<html>
  <body>
    <h1>Open Redirect</h1>
    <p>주소창에 /go?next=... 에 외부 URL을 넣으면 그대로 리다이렉트 됩니다.</p>
    <p>
      <!-- 버튼: 네이버로 리다이렉트 -->
      <a href="/go?next=https://www.naver.com"><button>네이버로 리다이렉트</button></a>
    </p>
  </body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(INDEX)

@app.route('/go')
def go():
    # 취약 포인트: next 파라미터를 검증하지 않고 그대로 redirect에 넘김
    target = request.args.get('next') or url_for('index')
    return redirect(target)

if __name__ == '__main__':
    app.run(debug=True)
`,
            },
            {
              type: 'p',
              content: [
                '1. 버튼을 누르면 네이버로 이동됩니다.\n2. 현재 경로에 ',
                { type: 'code', text: '/go?next=~~~' },
                ' 를 추가하면 해당 경로로 이동됩니다.',
              ],
            },
            {
              type: 'p',
              content: [
                '위 이미지에서 보이듯 특정 게시판으로 이동하는 버튼이 사실상 공격자가 만든 악의적인 페이지로 넘어가는 버튼일 수도 있습니다.',
              ],
            },
            { type: 'h3', text: '핵심 포인트' },
            {
              type: 'code',
              text: `target = request.args.get('next') or url_for('index')`,
            },
            {
              type: 'ul',
              items: [
                [
                  { type: 'code', text: 'next' },
                  ' 값을 서버에서 검증하지 않은 채 바로 넘기고 있음 → 공격자가 임의의 외부 URL을 넣어 사용자를 이동시킬 수 있음.',
                ],
                [
                  '피싱 URL을 만들어 보낸 뒤 사용자가 클릭하면, 사용자는 신뢰하는 도메인(쇼핑몰 등등)에서 넘어간 것이라고 생각할 수 있음.',
                ],
              ],
            },
          ],
        },
        {
          title: '경로 기반 리다이렉트(불충분한 검증)',
          text: "서버가 'next' 값이 ''/''로 시작하는가 같은 단순 검사만 해서 리다이렉트 대상의 안전성을 충분히 확인하지 않음 → '//host' 형태로 우회되어 외부로 리다이렉트될 수 있음.",
          footer: '위험도: 높음',
          isToggle: true,
          details: [
            {
              type: 'code',
              text: `# vuln_path_redirect.py
from flask import Flask, request, redirect, url_for, render_template_string

app = Flask(__name__)

INDEX = """
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <title>경로 기반 리다이렉트 데모</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
      body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; padding:2rem; background:#f6f8fa; }
      .card { background:#fff; padding:1.2rem; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.06); max-width:720px; margin:auto; }
      .row { display:flex; gap:0.6rem; flex-wrap:wrap; margin-top:0.6rem; }
      .btn { display:inline-block; padding:0.5rem 0.8rem; border-radius:6px; text-decoration:none; color:#fff; }
      .primary { background:#0366d6; }
      .danger { background:#d73a49; }
      .muted { color:#666; margin-top:0.8rem; font-size:0.9rem; }
      /* 간단한 toast */
      #toast {
        position: fixed;
        right: 20px;
        bottom: 20px;
        background: #111;
        color: #fff;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 240ms ease, transform 240ms ease;
        z-index: 9999;
      }
      #toast.show { opacity: 1; transform: translateY(0); }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>경로 기반 리다이렉트</h2>
      <p class="muted">교육용: 불충분한 검증(naive) 동작을 보여줍니다.</p>

      <div class="row">
        <!-- 절대 URL (차단될 대상) -->
        <a class="btn primary" href="/go?next=https://www.naver.com"><button style="all:unset; color:inherit; cursor:pointer;">네이버로 (절대 URL)</button></a>
        <!-- 프로토콜-상대 (naive 검사에서 통과하여 외부로 이동) -->
        <a class="btn danger" href="/go?next=//www.naver.com"><button style="all:unset; color:inherit; cursor:pointer;">//www.naver.com (프로토콜-상대)</button></a>
        <!-- 내부 경로(정상) -->
        <a class="btn" style="background:#2ea44f" href="/go?next=/dashboard"><button style="all:unset; color:inherit; cursor:pointer;">대시보드로 (내부)</button></a>
      </div>

      <p class="muted">절대 URL 버튼은 서버의 간단한 검사에 의해 차단되며, 차단 시 이 페이지에 알림(toast)이 표시됩니다.</p>
    </div>

    <div id="toast">/go?next에 절대 URL이 전달되어 차단되었습니다.</div>

    <script>
      // URL 파라미터에 blocked=1 있으면 toast 표시
      (function() {
        function qs(name) {
          const params = new URLSearchParams(location.search);
          return params.get(name);
        }
        if (qs('blocked') === '1') {
          const t = document.getElementById('toast');
          t.classList.add('show');
          // 3초 후 숨김
          setTimeout(() => t.classList.remove('show'), 3000);
        }
      })();
    </script>
  </body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(INDEX)

def naive_check(target: str) -> bool:
    # 불충분한 검증: 문자열이 '/'로 시작하는지만 확인
    # -> '/path'와 '//host'는 통과, 'https://host'는 통과하지 않음(차단)
    return target.startswith('/') if target else False

@app.route('/go')
def go():
    target = request.args.get('next') or url_for('index')
    # naive 검사 적용: '/'로 시작하지 않으면 차단 처리 (인덱스로 돌려보내고 blocked 플래그 추가)
    if not naive_check(target):
        return redirect(url_for('index', blocked='1'))
    # 검사 통과: 그대로 리다이렉트 (이 경우 //host 또는 /path 등)
    return redirect(target)

@app.route('/dashboard')
def dashboard():
    return "<h1>대시보드</h1><p>내부 페이지(데모)</p><p><a href='/'>홈으로 돌아가기</a></p>"

if __name__ == '__main__':
    app.run(debug=True)
`,
            },
            {
              type: 'ul',
              items: [
                [
                  { type: 'code', text: `/go?next=https://www.naver.com` },
                  `→ 문자열이`,
                  { type: 'code', text: '`/`' },
                  `로 시작하지 않아 이동이 차단됨.`,
                ],
                [
                  { type: 'code', text: `/go?next=//www.naver.com` },
                  ' → 서버가 ',
                  { type: 'code', text: `Location: //www.naver.com` },
                  '을 반환 → 브라우저가 스킴을 붙여 외부로 이동',
                ],
                [
                  { type: 'code', text: `/go?next=/dashboard` },
                  '→ 내부 대시보드로 이동',
                ],
              ],
            },
            {
              type: 'p',
              content: [
                '쿼리 파라미터 기반 리다이렉트는 ',
                { type: 'code', text: `go?next=https://naver.com` },
                ' 을 통해 외부로 나갔지만, 이번 예제같은 경우에는',
                { type: 'code', text: `naive_check` },
                ' 라는 함수에서',
                { type: 'code', text: `‘/’` },
                ' 로 시작하지 않으면 이동을 차단시켜버립니다.',
              ],
            },
            {
              type: 'p',
              content: [
                '다른 게시판(',
                { type: 'code', text: `dashboard` },
                ' 등)으로 이동시, 또는 프로토콜로 이동 시(',
                { type: 'code', text: `//host` },
                ')는 ',
                { type: 'code', text: `‘/’` },
                '로 시작하여 차단되지 않는 모습을 볼 수 있습니다.',
              ],
            },
            { type: 'h3', text: '핵심 포인트' },
            {
              type: 'code',
              text: `def naive_check(target: str) -> bool:
    return bool(target) and target.startswith('/')

target = request.args.get('next') or url_for('index')
if not naive_check(target):
    return redirect(url_for('index'))
return redirect(target)`,
            },
            {
              type: 'ul',
              items: [
                [
                  { type: 'code', text: 'naive_check' },
                  '는 ',
                  { type: 'code', text: `‘/’` },
                  ' 로 시작하는 문자열을 검사함.',
                ],
                [
                  '단순 ',
                  { type: 'code', text: `startswith('/')` },
                  ' 검사만으로는 ',
                  { type: 'code', text: `//host` },
                  '(프로토콜) 우회를 막을 수 없음.',
                ],
                [
                  '브라우저는 ',
                  { type: 'code', text: `Location: //host` },
                  '를 받으면 현재 스킴(',
                  { type: 'code', text: `http:` },
                  '/',
                  { type: 'code', text: `https:` },
                  ')을 붙여 외부로 이동함 → 공격자가 ',
                  { type: 'code', text: `//evil.com` },
                  '으로 우회 가능.',
                ],
              ],
            },
          ],
        },
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '5. 공격 시나리오 예시' },
    {
      type: 'ul',
      items: [
        [
          '이메일에 ',
          {
            type: 'code',
            text: 'https://trusted.com/redirect?u=https://phish.example.com/login',
          },
          ' 링크 삽입 → 사용자가 클릭하면 신뢰 도메인 → 즉시 악성 로그인 페이지로 이동 → 자격증명 탈취. (위험도: 높음)',
        ],
        [
          'OAuth/SSO 인증 콜백을 이용한 리디렉트 우회: 로그인/인증 흐름에서 ',
          { type: 'code', text: 'redirect_uri' },
          ' 파라미터를 악용. (위험도: 매우 높음 - 인증 코드/토큰 탈취 가능)',
        ],
        [
          '광고/검색 결과 합성: 정상 검색결과로 보이게 하여 클릭 유도. (위험도: 중간~높음 - 사회공학적 공격에 취약)',
        ],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '6. 방어 원칙 (요약)' },
    {
      type: 'ul',
      items: [
        [
          '허용목록(allowlist, whitelist) 적용: 리다이렉트 가능한 도메인/경로만 명시적으로 허용. (도메인·포트·스킴까지 정확히 매칭)',
        ],
        [
          '상대경로만 허용: 외부 스킴(도메인 포함) 리다이렉트를 금지하고, 내부 경로(',
          { type: 'code', text: '/dashboard' },
          ', ',
          { type: 'code', text: '/profile' },
          ')만 허용.',
        ],
        [
          '도메인 비교 시 정확하게: 정규 표현식으로 느슨하게 검사하지 말고, 정확한 도메인/포트/스킴을 매칭. 예: ',
          { type: 'code', text: 'https://app.example.com:443' },
          ' 과 같은 정확한 비교.',
        ],
        [
          '스킴 차단: ',
          { type: 'code', text: 'javascript:' },
          ', ',
          { type: 'code', text: 'data:' },
          ', ',
          { type: 'code', text: 'vbscript:' },
          ' 등 위험한 스킴을 금지.',
        ],
        [
          '사용자에게 경고 페이지 제공(옵션): 외부로 이동 시 "지금 외부 사이트로 이동합니다. 계속하시겠습니까?" 안내 및 외부 도메인 표시.',
        ],
        [
          '로그 및 모니터링: 리다이렉트 요청을 기록해 이상 패턴 탐지. 예: 단기간에 외부 도메인으로의 시도가 급증하면 알림.',
        ],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '7. 프레임워크별 권장 방법 (요점)' },
    {
      type: 'ul',
      items: [
        [
          'Django: ',
          { type: 'code', text: 'django.utils.http.is_safe_url()' },
          ' 또는 ',
          { type: 'code', text: 'urlsafe' },
          ' 기능 사용해 안전성 검증. (상대경로 허용/도메인 허용 체크)',
        ],
        [
          'Flask: ',
          { type: 'code', text: 'werkzeug.urls.url_parse' },
          '로 파싱해 ',
          { type: 'code', text: 'netloc' },
          '이 없거나 허용목록과 일치하는지 확인.',
        ],
        [
          'Express: ',
          { type: 'code', text: 'new URL()' },
          '으로 파싱 후 ',
          { type: 'code', text: 'hostname' },
          ' 비교; ',
          { type: 'code', text: 'res.redirect()' },
          ' 전에 검증.',
        ],
        [
          'Spring (Java): ',
          { type: 'code', text: 'UriComponentsBuilder' },
          '로 파싱 검증; 외부 리다이렉트 금지 정책.',
        ],
        [
          'ASP.NET: ',
          { type: 'code', text: 'Url.IsLocalUrl()' },
          ' 사용해 로컬(상대) URL인지 확인.',
        ],
        [
          '(프레임워크 내부에 이미 제공되는 유틸이 있으면 그걸 이용하는 게 안전)',
        ],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '8. 탐지 및 테스트 방법' },
    {
      type: 'ul',
      items: [['테스트 명령 (curl)']],
    },
    {
      type: 'code',
      text: `curl -i "http://127.0.0.1:5000/go?next=https://evil.com"
# 서버가 Location: https://evil.com을 반환하면 외부 리다이렉트 허용.

curl -i "http://127.0.0.1:5000/go?next=//evil.com"
# Location: //evil.com 확인.

curl -i -L "http://127.0.0.1:5000/go?next=//evil.com"
# 리다이렉트 따라가기`,
    },
    {
      type: 'ul',
      items: [['우회 시도 케이스 (테스트에 포함)']],
    },
    {
      type: 'code',
      text: `//evil.com
%2F%2Fevil.com
//trusted.com @evil.com
https://trusted.com @evil.com`,
    },
    {
      type: 'principle',
      text: '테스트는 절대 실제 서비스에 대해 공격하지 마세요. 항상 허가된/격리된 환경에서 수행.',
    },
    { type: 'hr' },
    { type: 'h2', text: '9. 체크리스트 (개발/리뷰용)' },
    {
      type: 'checklist',
      items: [
        ['리다이렉트 대상이 외부 URL일 경우 허용목록을 사용하고 있는가?'],
        ['상대경로만 허용하도록 설계되어 있는가?'],
        [
          { type: 'code', text: 'javascript:' },
          ', ',
          { type: 'code', text: 'data:' },
          ' 같은 위험한 스킴을 차단하는가?',
        ],
        [
          'OAuth/SSO 콜백 등 민감한 플로우에 대해 철저한 검증(',
          { type: 'code', text: 'redirect_uri' },
          ' 확인)을 하고 있는가?',
        ],
        ['리디렉트 입력을 로그로 기록하고 모니터링 하는가?'],
        ['사용자에게 외부로 리다이렉트할 때 경고 UI가 제공되는가(옵션)?'],
      ],
    },
  ],
};
