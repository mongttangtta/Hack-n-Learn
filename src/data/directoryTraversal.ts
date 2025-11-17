import heroImage from '../assets/images/이론학습 상세.png';
import type { LearningTopic } from '../types/learning';

export const directoryTraversal: LearningTopic = {
  id: 'directory-traversal',
  title: 'Directory Traversal',
  subtitle:
    '입력값으로 ../ 등을 사용해 원래 의도된 범위를 벗어난 파일에 접근하는 취약점.',
  imageUrl: heroImage,
  description:
    '입력값으로 ../ 등을 사용해 원래 의도된 범위를 벗어난 파일에 접근하는 취약점.',
  difficulty: '보통',
  isCompleted: false,
  content: [
    { type: 'h2', text: '1. 개요 & 학습 목표' },
    {
      type: 'ul',
      items: [
        [
          'Directory Traversal(디렉토리 접근 취약점)의 개념과 발생 원리를 이해한다.',
        ],
        ['공격자가 어떻게 서버의 민감한 파일을 열람할 수 있는지 알 수 있다.'],
        ['취약한 코드 예제와 실제 공격 예제를 실습해본다.'],
        ['안전한 파일 처리 및 방어 방법을 익힌다.'],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '2. Directory Traversal이란?' },
    {
      type: 'p',
      content: [
        '애플리케이션이 사용자가 입력한 파일 경로를 검증하지 않고 그대로 사용하는 경우, 공격자가 ',
        { type: 'code', text: '../' },
        ' (상위 디렉터리 이동) 같은 특수 경로를 이용해 의도하지 않은 상위 디렉토리로 이동하여 민감한 파일에 접근하는 취약점 입니다. 예를 들어 파일 다운로드, 뷰어, 로그보기, 이미지 로딩 등에서 file 또는 path 파라미터에 조작된 경로를 넣으면 서버의 민감한 파일(설정파일, 소스, 비밀키 등)에 접근할 수 있습니다.',
      ],
    },
    { type: 'h3', text: '훔칠 수 있는 것 / 가능한 피해' },
    {
      type: 'ul',
      items: [
        [
          '서버 설정파일(예: ',
          { type: 'code', text: 'config.php' },
          ', ',
          { type: 'code', text: '.env' },
          ') → DB 비밀번호, API 키 유출',
        ],
        ['소스코드(애플리케이션 로직) → 취약점 추가 발견, 인증 우회 기회 제공'],
        ['인증·세션 파일(세션 저장소 파일 등) → 계정 탈취 또는 세션 재사용'],
        [
          '개인 정보가 담긴 파일(업로드된 문서 등) → 개인정보유출(이메일, 주민번호 등)',
        ],
        ['TLS/SSH 키, 인증서 파일 → 다른 시스템으로의 신뢰 기반 침해 가능'],
        [
          '시스템 파일(예: ',
          { type: 'code', text: '/etc/passwd' },
          ') 열람 → 정보 수집(사용자 목록), 추가 공격 설계',
        ],
        ['로그 파일 접근 → 민감한 내부 정보 또는 다른 서비스 자격증명 탐지'],
        ['서비스 장애: 민감한 파일 노출로 규정위반 / 평판 손상 / 법적 책임'],
      ],
    },
    { type: 'h3', text: '문제의 핵심' },
    {
      type: 'p',
      content: [
        '사용자 입력을 파일 시스템 경로의 일부로 취급하고, 입력값을 정규화(정규경로화)·검증·허용목록(allowlist) 없이 그대로 결합해서 파일을 읽거나 반환하면 발생.',
      ],
    },
    {
      type: 'p',
      content: [
        '핵심 원인은 입력값을 파일 경로와 분리하지 않음(경로 조작 방지 미실시)이며, 특히 상대경로(',
        { type: 'code', text: '..' },
        ')나 인코딩(',
        { type: 'code', text: '%2e%2e%2f' },
        ')을 통해 의도치 않은 위치로 이동할 수 있다는 점을 간과함.',
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '3. Directory traversal의 기본 개념' },
    {
      type: 'p',
      content: [
        'Directory Traversal(경로 탈출)은 웹앱이 파일(다운로드, 뷰, 로그, 이미지 등)을 제공할 때 사용자로부터 받은 입력값을 그대로 파일 시스템 경로의 일부로 결합해서 처리할 때 발생합니다. 공격자는 ',
        { type: 'code', text: '..' },
        ' 같은 상대경로, 역슬래시(',
        { type: 'code', text: '\\' },
        '), URL 인코딩(',
        { type: 'code', text: '%2e%2e%2f' },
        ') 등을 이용해 의도된 문서 루트(document root) 밖으로 이동하여 민감한 파일을 읽거나 다운로드하도록 유도할 수 있습니다. 기본적으로 문제는 사용자 입력을 파일 경로와 분리하지 않고 신뢰하기 때문에 생깁니다.',
      ],
    },
    {
      type: 'p',
      content: [
        '하지만 Directory Traversal 공격을 수행·분석하려면 먼저 목표 시스템의 운영체제, 웹서버/프레임워크, 파일 저장 구조, 파일 제공 로직 등을 파악하는 것이 중요합니다. 내부 접근이 가능하다면 애플리케이션 설정파일(.env, config.php, settings.py), 배포 스크립트나 저장소를 확인해 파일 저장 위치와 권한 구조를 바로 알 수 있습니다. 외부에서 조사할 때는 에러 메시지·응답패턴·파일 확장자 처리 방식·경로 구분자(윈도우 ',
        { type: 'code', text: '\\' },
        ' vs 유닉스 ',
        { type: 'code', text: '/' },
        ')·인코딩/디코딩 동작 등이 단서가 됩니다. 예컨대 특정 요청에서 ',
        { type: 'code', text: '/etc/passwd' },
        '와 유사한 응답이 노출되거나, ',
        { type: 'code', text: '..' },
        ' 포함 요청에서 다른 상태코드/본문이 반환되는 패턴을 보면 경로 접근 가능성을 유추할 수 있습니다.',
      ],
    },
    { type: 'h3', text: '3.1 기초 개념' },
    {
      type: 'ul',
      items: [
        [
          '절대경로 : ',
          { type: 'code', text: '/' },
          ' → 최상위 디렉터리를 기준으로 찾음',
        ],
        [
          '상대경로 : ',
          { type: 'code', text: './' },
          ' → 현재 디렉터리를 기준으로 찾음',
        ],
        [
          '상위 경로 이동 : ',
          { type: 'code', text: '../' },
          ' → 현재 디렉터리의 상위 디렉터리로 이동',
        ],
        ['웹앱에서 흔히 쓰이는 파일 다운로드 엔드포인트'],
        [{ type: 'code', text: 'download?filename=...' }],
        [
          '서버는 filename 파라미터로 받은 문자열을 파일 경로에 결합해서 해당 파일을 읽어 사용자에게 반환합니다.',
        ],
      ],
    },
    { type: 'h3', text: '3.2 취약점 확인 방법' },
    {
      type: 'p',
      content: [
        '웹 서비스에서 파라미터, 헤더 등의 사용자 요청이 서버에서 path 형태로 처리하는 부분은 모두 Directory traversal 취약점이 터질 가능성이 있습니다. 가장 쉽게 식별하는 방법은 다음과 같이 Response로 식별이 가능한 페이지를 요청하면서 ',
        { type: 'code', text: '../' },
        ' 등의 특수문자의 처리 상태를 파악하는 방법입니다.',
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '4. Directory Traversal의 주요 유형' },
    {
      type: 'grid',
      items: [
        {
          title: '1. 브라우저 주소창(직접 요청)',
          text: '사용자가 브라우저 주소창에 파일 요청 URL을 직접 입력(예: GET /download?filename=hello.txt) → 서버는 쿼리의 filename 값을 받아 FILES_DIR + filename 식으로 경로를 결합하고 realpath로 정규화하여 실제 파일 경로를 계산함 → 공격자는 filename에 상대경로 표기(..)를 넣어 의도한 공개 파일 위치에서 상위 디렉터리로 올라가도록 유도함(예: ../../etc/passwd처럼) → 서버가 정규화된 경로가 허용 범위 안이라고 판단하면 그 파일을 읽어 HTTP 응답으로 반환하므로 브라우저에서 민감 파일 내용을 바로 확인할 수 있음',
          footer: '위험도: 높음',
          isToggle: true,
          details: [
            {
              type: 'h3',
              text: '브라우저 주소창을 통한 Directory Traversal',
            },
            {
              type: 'ul',
              items: [
                ['notes.txt와 hello.txt를 다운받아보세요.'],
                ['상대경로로 민감파일인 passwd를 다운받아보세요.'],
              ],
            },
            {
              type: 'code',
              text: `# vuln_traversal.py
# http://127.0.0.1:8000/

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, unquote
import os
import html

HOST = "127.0.0.1"
PORT = 8000

ROOT = os.path.abspath(os.path.dirname(__file__))
FILES_DIR = os.path.join(ROOT, "public", "files")
ETC_DIR = os.path.join(ROOT, "etc")

os.makedirs(FILES_DIR, exist_ok=True)
os.makedirs(ETC_DIR, exist_ok=True)

with open(os.path.join(FILES_DIR, "hello.txt"), "w", encoding="utf-8") as f:
    f.write("Hello — this is a public file.\\n")
with open(os.path.join(FILES_DIR, "notes.txt"), "w", encoding="utf-8") as f:
    f.write("Some sample notes in public/files.\\n")

FLAG = "FLAG{etc_passwd_via_traversal}\\n"
with open(os.path.join(ETC_DIR, "passwd"), "w", encoding="utf-8") as f:
    f.write("root:x:0:0:root:/root:/bin/bash\\n")
    f.write(FLAG)
    f.write("daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\\n")

# --------------------------------------------------------------------
# 통일된 Hack-n-Learn 디자인 템플릿
# --------------------------------------------------------------------
INDEX_HTML = """
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Directory Traversal</title>
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
    h1 {
      margin-top: 0;
      color: #333;
    }
    .meta {
      color: #666;
      margin-bottom: 20px;
      line-height: 1.5em;
    }
    .section-title {
      font-weight: bold;
      margin-bottom: 8px;
      color: #444;
    }
    .file-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 18px;
    }
    .file-item {
      background: #fff;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #ddd;
    }
    a {
      color: #0b76ef;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    pre {
      background: #272822;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      margin-top: 18px;
    }
    .footer {
      margin-top: 20px;
      color: #777;
      font-size: 0.9em;
      line-height: 1.4em;
    }
    hr {
      border: none;
      border-top: 1px solid #eee;
      margin: 18px 0;
    }
  </style>
</head>

<body>
<div class="container">

  <h1>Directory Traversal</h1>
  <div class="meta">
    학습용 로컬 실습 서버입니다.<br>
    프로젝트 내부 <code>etc/passwd</code> 파일에 FLAG가 있으며,
    <b>../../etc/passwd</b> 형태의 경로 조작으로 접근할 수 있습니다.
  </div>

  <div class="section-title">Public Files</div>
  <div class="file-list">
    {% files %}
  </div>

  <hr>

  <div>
    <b>정상 요청</b><br>
    <a href="/download?filename=hello.txt">/download?filename=hello.txt</a>
  </div>

  <div style="margin-top:10px;">
    <b>트래버셜 예시 (목표)</b><br>
    <a href="/download?filename=../../etc/passwd">/download?filename=../../etc/passwd</a>
  </div>

  <div class="footer">
    ※ 로컬 교육용 전용입니다.<br>
    실제 시스템 파일(/etc/passwd 등)에는 접근할 수 없도록 차단되어 있습니다.
  </div>

</div>
</body>
</html>
"""

# --------------------------------------------------------------------

class SafeHandler(BaseHTTPRequestHandler):
    def send_text(self, status, text):
        data = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        u = urlparse(self.path)

        # ------------------------
        # Index Page
        # ------------------------
        if u.path in ("/", "/index.html"):
            try:
                files = os.listdir(FILES_DIR)
            except:
                files = []

            file_html = ""
            for f in files:
                esc = html.escape(f)
                file_html += f'<div class="file-item"><a href="/download?filename={esc}">{esc}</a></div>'

            page = INDEX_HTML.replace("{% files %}", file_html)
            content = page.encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        # ------------------------
        # Download Logic
        # ------------------------
        if u.path != "/download":
            self.send_response(404)
            self.end_headers()
            return

        qs = parse_qs(u.query)
        filename = qs.get("filename", [""])[0]
        filename = unquote(filename)

        if not filename:
            self.send_text(400, "filename required")
            return

        # 절대경로 차단
        if os.path.isabs(filename):
            self.send_text(403, "Absolute paths not allowed")
            return

        requested = os.path.realpath(os.path.join(FILES_DIR, filename))
        allowed_prefix = ROOT + os.sep

        # 프로젝트 밖 접근 차단
        if not (requested == ROOT or requested.startswith(allowed_prefix)):
            self.send_text(403, "Access denied (outside project root)")
            return

        # 파일 전송
        if os.path.isfile(requested):
            try:
                with open(requested, "rb") as f:
                    data = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/octet-stream")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
            except Exception as e:
                self.send_text(500, f"Error reading file: {e}")
        else:
            self.send_text(404, "File not found")

if __name__ == "__main__":
    print(f"Server running at http://{HOST}:{PORT}/")
    print(f"ROOT: {ROOT}")
    httpd = HTTPServer((HOST, PORT), SafeHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
        print("Stopped.")
`,
            },
            {
              type: 'p',
              content: ['[실습 이미지: 스크린샷 2025-11-08 오후 5.11.19.png]'],
            },
            {
              type: 'nested-list',
              items: [
                {
                  content: ['정상 요청'],
                  subItems: [
                    [
                      {
                        type: 'code',
                        text: '127.0.0.1:5000/download?filename=hello.txt',
                      },
                    ],
                  ],
                },
                {
                  content: ['공격 요청'],
                  subItems: [
                    [
                      {
                        type: 'code',
                        text: '127.0.0.1:5000/download?filename=../../etc/passwd',
                      },
                    ],
                    ['→ 시스템 계정 파일 출력'],
                  ],
                },
              ],
            },
            {
              type: 'ul',
              items: [
                [
                  '1. `notes.txt`와 `hello.txt`를 클릭하여 다운로드 받아봅니다.',
                ],
                [
                  '2. 주소창에 정상적인 요청을 통해 `notes.txt`와 `hello.txt`를 다운로드 받아봅니다.',
                ],
                [
                  '3. 주소창에 공격 요청을 통해 시스템의 `etc/passwd`에 접근하여 시스템 계정 파일을 다운로드 받아봅니다.',
                ],
              ],
            },
            {
              type: 'p',
              content: [
                '파일을 다운로드 받기 위해서는 공개된 폴더 하위의 파일 경로로 접근해야 합니다.',
              ],
            },
            {
              type: 'p',
              content: [
                '그러나 코드상에서 사용자가 입력한 ',
                { type: 'code', text: 'filename' },
                '을 그대로 이어 붙여서 파일경로로 찾기 때문에 ',
                { type: 'code', text: '..' },
                ' 명령어로 상위폴더로 이동이 가능합니다.',
              ],
            },
            { type: 'h3', text: '핵심 포인트' },
            {
              type: 'code',
              text: 'filename = qs.get("filename", [""])[0]',
            },
            {
              type: 'ul',
              items: [
                [
                  '사용자가 준 ',
                  { type: 'code', text: 'filename' },
                  '값을 가공 없이 그대로 받아옵니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: 'filename = unquote(filename)',
            },
            {
              type: 'ul',
              items: [
                [
                  'URL 인코딩을 해제해서 ',
                  { type: 'code', text: '%2e%2e' },
                  ' 같은 우회 표기를 실제 ',
                  { type: 'code', text: '..' },
                  '로 바꿔버립니다.',
                ],
                [
                  '서버가 디코딩을 한 뒤에 검사해야 우회가 막힙니다. 즉, 디코딩 전 후 모두 검증을 해야합니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: `if os.path.isabs(filename):
    self.send_text(403, "Absolute paths not allowed\\n")
    return`,
            },
            {
              type: 'ul',
              items: [
                [
                  '절대경로(',
                  { type: 'code', text: '/etc/passwd' },
                  ')는 막지만, ',
                  { type: 'code', text: '../../etc/passwd' },
                  ' 같은 상대경로는 여전히 허용될 수 있습니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: 'requested = os.path.realpath(os.path.join(FILES_DIR, filename))',
            },
            {
              type: 'ul',
              items: [
                [
                  { type: 'code', text: 'FILES_DIR + filename' },
                  ' 을 합친 뒤 ',
                  { type: 'code', text: 'realpath' },
                  '가 ',
                  { type: 'code', text: '..' },
                  '을 해석해 실제 절대경로로 바꿉니다.',
                ],
                [
                  '여기에서 ',
                  { type: 'code', text: '../../' },
                  '가 실제 경로로 바뀌어 버립니다.',
                ],
                [
                  '이 동작 자체는 정상적이지만, 이후 검사에서 어디까지 허용하는지가 중요합니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: `if os.path.isfile(requested):
    with open(requested, "rb") as f:
        data = f.read()
    ...
else:
    self.send_text(404, "File not found\\n")`,
            },
            {
              type: 'ul',
              items: [
                [
                  '파일 존재 여부만 확인하고 바로 반환합니다. 즉, 이미 위에서 허용된 경로이면 어떤 파일이든 내려줍니다.',
                ],
                [
                  '파일을 내보내기 전에 추가로 허용검사(확장자, 허용목록)를 해야합니다.',
                ],
              ],
            },
          ],
        },
        {
          title: '2. 브라우저 주소창 인코딩 우회',
          text: '1번 실습에서 이어지는 내용으로, 사용자 입력의 ../ 를 필터링 했을 경우 이를 우회하는 방법에 대해서 알아봅시다.',
          footer: '위험도: 높음',
          isToggle: true,
          details: [
            { type: 'h3', text: '인코딩을 통한 Directory Traversal' },
            {
              type: 'ul',
              items: [
                ['notes.txt와 hello.txt를 다운받아보세요.'],
                ['상대경로로 민감파일인 passwd를 다운받아보세요.'],
                [
                  '상대경로를 URL 인코딩하여 민감파일인 passwd를 다운받아보세요.',
                ],
              ],
            },
            {
              type: 'code',
              text: `# bypass_traversal.py
# 실행: python bypass_traversal.py
# 접속: http://127.0.0.1:8000/

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, unquote
import os, html, sys

SIMULATE_ONLY = False

HOST = "127.0.0.1"
PORT = 8000

ROOT = os.path.abspath(os.path.dirname(__file__))
FILES_DIR = os.path.join(ROOT, "public", "files")
ETC_DIR = os.path.join(ROOT, "etc")

os.makedirs(FILES_DIR, exist_ok=True)
os.makedirs(ETC_DIR, exist_ok=True)

with open(os.path.join(FILES_DIR, "hello.txt"), "w", encoding="utf-8") as f:
    f.write("Hello — this is a public file.\\n")

with open(os.path.join(FILES_DIR, "notes.txt"), "w", encoding="utf-8") as f:
    f.write("Some sample notes in public/files.\\n")

FLAG = "FLAG{etc_passwd_via_traversal}\\n"
with open(os.path.join(ETC_DIR, "passwd"), "w", encoding="utf-8") as f:
    f.write("root:x:0:0:root:/root:/bin/bash\\n")
    f.write(FLAG)
    f.write("daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\\n")

# --------------------------------------------------------------------
# 통일된 Hack-n-Learn 스타일 INDEX 페이지
# --------------------------------------------------------------------
INDEX_HTML = """
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Directory Traversal – Bypass</title>
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

  h1 {
    margin-top: 0;
    color: #333;
  }

  .meta {
    color: #666;
    margin-bottom: 20px;
    line-height: 1.5em;
  }

  .section-title {
    margin-top: 10px;
    font-weight: 600;
    color: #444;
  }

  .file-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }

  .file-item {
    background: #fff;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
  }

  a {
    color: #0b76ef;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  code {
    background: #eeeeee;
    padding: 2px 6px;
    border-radius: 4px;
  }

  hr {
    border: none;
    border-top: 1px solid #eee;
    margin: 20px 0;
  }

  .footer {
    margin-top: 25px;
    color: #777;
    font-size: 0.9em;
    line-height: 1.4em;
  }
</style>
</head>

<body>
<div class="container">

  <h1>Directory Traversal – Bypass Demo</h1>

  <div class="meta">
    이 페이지는 Directory Traversal <b>우회(bypass)</b> 시연용입니다.<br>
    프로젝트 내부 <code>etc/passwd</code> 파일에 FLAG가 있으며,<br>
    퍼센트 인코딩을 활용하면 필터를 우회하는 상황을 실습할 수 있습니다.
  </div>

  <div class="section-title">Public Files</div>
  <div class="file-list">
    {% files %}
  </div>

  <hr>

  <div>
    <b>정상 요청</b><br>
    <a href="/download?filename=hello.txt">/download?filename=hello.txt</a>
  </div>

  <div style="margin-top:12px;">
    <b>차단되는 입력(원문에 '../')</b><br>
    <a href="/download?filename=../../etc/passwd">/download?filename=../../etc/passwd</a>
  </div>

  <div style="margin-top:12px;">
    <b>인코딩 우회 (필터 우회 시연)</b><br>
    <a href="/download?filename=%2E%2E%2F%2E%2E%2Fetc%2Fpasswd">
      /download?filename=%2E%2E%2F%2E%2E%2Fetc%2Fpasswd
    </a>
  </div>

  <div class="footer">
    ※ 교육용 로컬 환경 전용입니다.<br>
    퍼센트 인코딩, 디코딩 순서 문제, 불완전 필터링 등 실제 취약 사례를 체험할 수 있도록 구성되었습니다.
  </div>

</div>
</body>
</html>
"""
# --------------------------------------------------------------------

class DemoHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stdout.write("%s - - [%s] %s\\n" %
                         (self.client_address[0], self.log_date_time_string(), format%args))

    def send_text(self, status, text):
        b = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        u = urlparse(self.path)

        # ------------------------
        # INDEX PAGE
        # ------------------------
        if u.path in ("/", "/index.html"):
            try:
                files = [f for f in os.listdir(FILES_DIR)
                         if os.path.isfile(os.path.join(FILES_DIR, f))]
            except:
                files = []

            file_html = ""
            for f in files:
                esc = html.escape(f)
                file_html += f'<div class="file-item"><a href="/download?filename={esc}">{esc}</a></div>'

            page = INDEX_HTML.replace("{% files %}", file_html)
            body = page.encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        # ------------------------
        # DOWNLOAD
        # ------------------------
        if u.path != "/download":
            self.send_response(404)
            self.end_headers()
            return

        raw_q = u.query
        raw_filename_enc = ""

        for part in raw_q.split("&"):
            if part.startswith("filename="):
                raw_filename_enc = part.split("=", 1)[1]
                break

        # 엉성한 필터 : "../" 원문 포함되면 차단
        if "../" in raw_filename_enc:
            self.send_text(403, "Blocked: '../' not allowed\\n")
            return

        filename = unquote(raw_filename_enc)

        if not filename:
            self.send_text(400, "filename required\\n")
            return

        if os.path.isabs(filename):
            self.send_text(403, "Absolute paths not allowed\\n")
            return

        requested = os.path.realpath(os.path.join(FILES_DIR, filename))

        self.log_message(
            "DEBUG raw_enc=%r after_unquote=%r requested=%r ROOT=%r",
            raw_filename_enc, filename, requested, ROOT
        )

        etc_passwd_path = os.path.realpath(os.path.join(ETC_DIR, "passwd"))

        # bypass 성공 시 — 프로젝트 내부 etc/passwd만 제공
        if os.path.normpath(requested) == os.path.normpath(etc_passwd_path):
            if SIMULATE_ONLY:
                msg = (
                    "SIMULATION: resolves to local etc/passwd.\\n"
                    f"raw_input: {raw_filename_enc}\\n"
                    f"after_unquote: {filename}\\n"
                    f"realpath: {requested}\\n"
                )
                self.send_text(200, msg)
                return
            else:
                try:
                    with open(etc_passwd_path, "rb") as f:
                        data = f.read()
                    self.send_response(200)
                    self.send_header("Content-Type", "application/octet-stream")
                    self.send_header("Content-Length", str(len(data)))
                    self.end_headers()
                    self.wfile.write(data)
                except Exception as e:
                    self.send_text(500, f"Error: {e}\\n")
                return

        allowed_prefix = ROOT + os.sep
        if not (requested.startswith(allowed_prefix) or requested == ROOT):
            self.send_text(403, "Access denied (outside project root)\\n")
            return

        if os.path.isfile(requested):
            try:
                with open(requested, "rb") as f:
                    data = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/octet-stream")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
            except Exception as e:
                self.send_text(500, f"Error reading file: {e}\\n")
        else:
            self.send_text(404, "File not found\\n")

if __name__ == "__main__":
    print(f"Starting demo server at http://{HOST}:{PORT}/ (SIMULATE_ONLY={SIMULATE_ONLY})")
    print(f"ROOT: {ROOT}")
    httpd = HTTPServer((HOST, PORT), DemoHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
        print("Stopped.")
`,
            },
            {
              type: 'p',
              content: ['[실습 이미지: 스크린샷 2025-11-08 오후 6.49.16.png]'],
            },
            {
              type: 'nested-list',
              items: [
                {
                  content: ['정상 요청'],
                  subItems: [
                    [
                      {
                        type: 'code',
                        text: '127.0.0.1:5000/download?filename=hello.txt',
                      },
                    ],
                  ],
                },
                {
                  content: ['필터링된 공격 요청'],
                  subItems: [
                    [
                      {
                        type: 'code',
                        text: '127.0.0.1:5000/download?filename=../../etc/passwd',
                      },
                    ],
                  ],
                },
                {
                  content: ['바이패스 공격 요청'],
                  subItems: [
                    [
                      {
                        type: 'code',
                        text: '127.0.0.1:5000/download?filename=%2E%2E%2F%2E%2E%2Fetc%2Fpasswd',
                      },
                    ],
                    [
                      {
                        type: 'code',
                        text: '127.0.0.1:5000/download?filename=..%2F..%2Fetc%2Fpasswd',
                      },
                    ],
                  ],
                },
              ],
            },
            {
              type: 'ul',
              items: [
                [
                  '1. `notes.txt`와 `hello.txt`를 클릭하여 다운로드 받아봅니다.',
                ],
                [
                  '2. 주소창에 정상적인 요청을 통해 `notes.txt`와 `hello.txt`를 다운로드 받아봅니다.',
                ],
                [
                  '3. 주소창에 `../`이 필터링된 공격 요청을 통해 시스템의 `etc/passwd`에 접근하여 시스템 계정 파일을 다운로드 받아봅니다.',
                ],
                [
                  '4. URL 인코딩 사이트에서 `../../etc/passwd` 를 인코딩합니다.',
                ],
                [
                  '5. URL 인코딩된 공격 요청을 통해 시스템의 `etc/passwd`에 접근하여 시스템 게정 파일을 다운로드 받아봅니다.',
                ],
              ],
            },
            {
              type: 'p',
              content: [
                '1번 실습에서 이어지는 내용으로, 2번 실습에서는 사용자 입력에서 ',
                { type: 'code', text: '../' },
                '를 필터링 하였습니다.',
              ],
            },
            {
              type: 'p',
              content: [
                '서버는 리터럴 ',
                { type: 'code', text: '“../”' },
                ' 문자열을 검사해서 차단합니다. 그러나 이 문자열이 URL 인코딩되어 ',
                { type: 'code', text: '%2E%2E%2F' },
                ' 형태로 들어오면 필터링이 우회되어 디코딩 후 실제 상위 디렉터리로 접근 가능해집니다.',
              ],
            },
            {
              type: 'p',
              content: [
                '필요에 따라 한번 인코딩된 ',
                { type: 'code', text: '%2E%2E%2F' },
                ' 문자열을 한번 더 인코딩 하여 ',
                { type: 'code', text: '%252E%252E%252F' },
                ' 문자열로 접근하기도 합니다. 이를 이중인코딩이라고 합니다.',
              ],
            },
            { type: 'h3', text: '핵심 포인트' },
            {
              type: 'code',
              text: `if "../" in raw_filename_enc:
    self.send_text(403, "Blocked: '../' not allowed\\n")
    return`,
            },
            {
              type: 'ul',
              items: [
                [
                  '사용자 입력에서 리터럴 "../" 가 원문에 포함되어 있으면 즉시 차단합니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: 'filename = unquote(raw_filename_enc)',
            },
            {
              type: 'ul',
              items: [
                ['한번만 디코딩을 합니다.'],
                [
                  '한번만 디코딩을 하면 이중 인코딩 같은 케이스(%252E…)를 놓칠 수 있습니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: 'requested = os.path.realpath(os.path.join(FILES_DIR, filename))',
            },
            {
              type: 'ul',
              items: [['정규화를 합니다.']],
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
        'Directory Traversal 방어의 핵심은 입력을 절대 경로, 실제 파일 경로로 정규화 한 뒤, 서버가 허용한 영역(공개된 파일)인지 확실히 확인하는 것 입니다. 특히 디코딩, 정규화, 검사 순서는 매우 중요합니다. 순서가 바뀔 경우 제대로 필터링 되지 않고 공격자에게 민감한 파일이 노출될 수 있습니다.',
      ],
    },
    { type: 'h3', text: '컨텍스트별 원칙' },
    {
      type: 'h4',
      text: '1) 경로 값(Path value) 자리 → 정규화(정확한 원화) 후 허용영역 검사(또는 바인딩/매핑)',
    },
    {
      type: 'ul',
      items: [
        [
          '사용자가 보내는 ',
          { type: 'code', text: 'filename=...' },
          ', ',
          { type: 'code', text: 'path=...' },
          ' 등은 그대로 파일 시스템 경로가 된다면 위험합니다. ',
          '**입력을 그대로 파일 시스템 API에 붙여넣지 말고**',
          ", 먼저 완전한 절대 경로로 정규화(디코딩 → 정규화 → 실경로 확인)한 뒤, 서비스가 제공하는 '루트(base directory)' 내부인지 검사해야 합니다.",
        ],
      ],
    },
    {
      type: 'h4',
      text: '2) 식별자(파일/디렉터리 이름) 자리 → 허용목록(allowlist) 매핑 또는 파일 ID 매핑',
    },
    {
      type: 'ul',
      items: [
        [
          '파일명 자체(특히 동적으로 디렉터리/파일명을 선택하는 경우)는 직접 삽입하면 안됩니다. 대신 ',
          '**내부 키 → 파일 경로**',
          ' 매핑 사용.',
        ],
        [
          '예를 들어 ',
          { type: 'code', text: '?file=terms' },
          ' 는 서버 내부 매핑을 통해 ',
          {
            type: 'code',
            text: "{'terms': 'public/terms_v2.pdf', 'policy': 'public/policy.pdf'}",
          },
          ' 이렇게 바꾸는게 좋습니다.',
        ],
        [
          '파일 이름은 민감한 파일에 접근하는 경로가 될 수 있으므로 바인딩이 불가합니다. 허용 목록에 있는 키만 허용하면 안전합니다.',
        ],
      ],
    },
    { type: 'h3', text: '정상적인 처리 순서는 다음과 같습니다.' },
    {
      type: 'nested-list',
      items: [
        {
          content: ['**1. 원문 읽기**'],
          subItems: [
            [
              '사용자가 입력한 원문(',
              { type: 'code', text: 'u.query' },
              ')을 읽습니다.',
            ],
          ],
        },
        {
          content: ['**2. 디코딩**'],
          subItems: [
            [
              { type: 'code', text: 'unquote()' },
              ' 를 반복해 이중/다중 인코딩을 풀어 완전한 절대 경로로 만듭니다.',
            ],
          ],
        },
        {
          content: ['**3. 정규화**'],
          subItems: [
            [
              'Unicode 정규화, NULL문자 제거, ',
              { type: 'code', text: '\\' },
              ' → ',
              { type: 'code', text: '/' },
              ' 통일 등',
            ],
          ],
        },
        {
          content: ['**4. 경로 결합 및 정규화**'],
          subItems: [
            [
              { type: 'code', text: 'os.path.join(…)' },
              ' → ',
              { type: 'code', text: 'os.path.realpath(…)' },
            ],
          ],
        },
        {
          content: ['**5. 허용 검사**'],
          subItems: [
            [
              'realpath가 프로젝트 루트 내부인지(외부로 나가면 민감한 파일이 있습니다.), 허용목록에 있는 파일인지 확인합니다.',
            ],
          ],
        },
        {
          content: ['**6. 응답**'],
          subItems: [['조건을 만족하면 파일 제공, 아니면 403/404 에러']],
        },
      ],
    },
    {
      type: 'p',
      content: [
        '디코딩과 정규화 후에 검사해야 모든 인코딩이나 표현 기법들을 일관되게 막을 수 있습니다. 문자열 필터는 보조적 수단일 뿐입니다.',
      ],
    },
    {
      type: 'p',
      content: ['**참고) 2번 실습 코드의 처리 순서**'],
    },
    {
      type: 'nested-list',
      items: [
        {
          content: ['**1. 원문 검사**'],
          subItems: [['리터럴 필터링']],
        },
        {
          content: ['**2. 한번만 디코딩**'],
        },
        {
          content: ['**3. 정규화**'],
        },
        {
          content: ['**4. 응답**'],
        },
      ],
    },
    {
      type: 'p',
      content: [
        '해당 실습코드의 문제는 디코딩을 한번만 하는 것과 정규화 이후 추가 검사 없이 바로 응답하는 것 입니다.',
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '6. 실전 방어 기법' },
    {
      type: 'nested-list',
      items: [
        {
          content: ['**1. Serve-by-ID(매핑) 방식 권장**'],
          subItems: [
            [
              '사용자에게 파일명(',
              { type: 'code', text: 'project/hello.txt' },
              ')을 직접 노출하지 말고 ID를 주고 서버에서 매핑.',
            ],
            ['(예: ', { type: 'code', text: 'GET /project/12345' }, ')'],
          ],
        },
        {
          content: [
            '**2. 정적 파일은 웹서버(nginx 같은)에게 맡기되, alias/try_files를 안전하게 구성**',
          ],
          subItems: [
            [
              'Nginx 예: ',
              { type: 'code', text: 'root' },
              '/',
              { type: 'code', text: 'alias' },
              ' 사용 시 경로 조합 규칙을 정확히 파악해서 설정. (',
              { type: 'code', text: 'alias' },
              ' 뒤에 ',
              { type: 'code', text: '..' },
              ' 우회가 안 되게)',
            ],
          ],
        },
        {
          content: ['**3. 절대경로 검사**'],
          subItems: [
            [
              { type: 'code', text: 'realpath(resolved)' },
              '가 공개되어있는 파일(',
              { type: 'code', text: 'BASE' },
              '의 하위)인지 검사. ',
              { type: 'code', text: 'os.path.commonpath' },
              ' 또는 ',
              { type: 'code', text: 'Path.resolve()' },
              ' 사용.',
            ],
          ],
        },
        {
          content: ['**4. 심볼릭 링크 취급 주의**'],
          subItems: [
            [
              '심볼릭 링크로 ',
              { type: 'code', text: 'BASE' },
              ' 밖으로 빠져나갈 수 있음. ',
              { type: 'code', text: 'resolve()' },
              '로 심볼릭 링크까지 해석 후 검사.',
            ],
          ],
        },
        {
          content: ['**5. 권한 최소화**'],
          subItems: [
            [
              '파일 제공용 계정(서비스)은 읽기 전용, 필요한 디렉터리에만 접근 권한. 웹서버는 루트 권한 금지.',
            ],
          ],
        },
        {
          content: ['**6. 에러/정보 노출 금지**'],
          subItems: [
            [
              '파일 경로/시스템 경로를 클라이언트에 직접 노출하지 말 것(에러 메시지).',
            ],
          ],
        },
        {
          content: ['**7. 로그 및 모니터링**'],
          subItems: [
            [
              '비정상적인 경로 요청(예: ',
              { type: 'code', text: '../../' },
              ', ',
              { type: 'code', text: '%2e%2e' },
              ') 빈도 로깅 후 차단 룰 적용.',
            ],
          ],
        },
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '7. 체크리스트' },
    {
      type: 'checklist',
      items: [
        ['사용자 입력을 파일 경로에 직접 연결하지 않았는가?'],
        ['처리 순서를 제대로 지켰는가?'],
        ['허용 목록(Whitelist) 기반 접근 제어를 적용했는가?'],
        [
          { type: 'code', text: 'realpath()' },
          ' / 정규화된 경로 검증을 사용했는가?',
        ],
        ['민감 파일은 웹 루트 밖에 위치하도록 했는가?'],
        ['웹 서버 권한이 최소 권한 원칙을 따르고 있는가?'],
      ],
    },
  ],
};
