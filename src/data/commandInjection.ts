import heroImage from '../assets/images/이론학습 상세.png';
import command1 from '../assets/images/commandInjection/command1.png';
import command2 from '../assets/images/commandInjection/command2.png';
import command3 from '../assets/images/commandInjection/command3.png';
import type { LearningTopic } from '../types/learning';

export const commandInjection: LearningTopic = {
  id: 'command-injection',
  title: 'Command Injection (명령어 삽입)',
  subtitle:
    '입력값이 서버의 시스템 명령어에 포함되어 임의의 명령 실행이 가능한 취약점.',
  imageUrl: heroImage,
  description:
    '입력값이 서버의 시스템 명령어에 포함되어 임의의 명령 실행이 가능한 취약점.',
  difficulty: '어려워요',
  isCompleted: false,
  content: [
    { type: 'h2', text: '1. 개요 & 학습 목표' },
    {
      type: 'ul',
      items: [
        ['커맨드 인젝션이 무엇인지, 어떻게 발생하는지 이해한다.'],
        ['취약한 서버 코드에서 외부 명령이 실행되는 과정을 직접 확인한다.'],
        [
          '공격자가 어떤 피해를 줄 수 있는지(파일 조회·변조·원격 코드 실행 등) 이해한다.',
        ],
        [
          '안전한 대체 구현 방법(쉘 호출 대신 API 사용, 인자 바인딩, 최소 권한 등)을 적용할 수 있다.',
        ],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '2. Command Injection이란?' },
    {
      type: 'p',
      content: [
        'Command Injection(명령어 주입)은 웹 애플리케이션이나 서비스가 사용자 입력을 운영체제의 쉘(또는 셸처럼 동작하는 인터프리터)에 검증 없이 그대로 연결해서 시스템 명령으로 실행할 때 발생하는 취약점입니다. 공격자는 쉘 메타문자(예: ',
        { type: 'code', text: ';' },
        ', ',
        { type: 'code', text: '&&' },
        ', ',
        { type: 'code', text: '|' },
        ', ',
        { type: 'code', text: '`' },
        ' 등)나 인자 조작을 이용해 원래 의도한 명령 뒤에 추가 명령을 붙이거나 다른 명령을 실행하게 만듭니다. 예: 파일 업로드 처리, 로그 보기, 서버 관리용 파라미터를 받는 기능 등에서 발생할 수 있습니다.',
      ],
    },
    {
      type: 'p',
      content: [
        '(중요) 이 취약점은 애플리케이션이 사용자 입력을 운영체제 명령의 일부로 취급할 때만 생깁니다 — 단순 문자열 처리/DB 쿼리와는 다른 범주입니다.',
      ],
    },
    { type: 'h3', text: '훔칠 수 있는 것 / 가능한 피해' },
    {
      type: 'ul',
      items: [
        ['서버 내부 파일(설정파일, 비밀번호 파일 등) 열람 → 민감정보 유출'],
        ['시스템 계정 권한으로 명령 실행 → 계정 탈취·영구적 접근(백도어 설치)'],
        ['서비스 중단(프로세스 종료, 리소스 소모 등)'],
        ['네트워크 상 다른 내부 시스템으로 수평 이동(스캔·이동)'],
        ['데이터 파괴 또는 무결성 훼손'],
        ['로그 조작으로 흔적 은닉'],
      ],
    },
    { type: 'h3', text: '문제의 핵심' },
    {
      type: 'p',
      content: [
        '사용자 입력을 운영체제 명령(쉘 명령) 과 분리하지 않고 단순 문자열로 이어붙여 실행하는 것에서 발생.',
      ],
    },
    {
      type: 'p',
      content: [
        '핵심 원인은 입력값을 쉘 명령과 분리하지 않음(즉, 파라미터화/인자 배열 사용 미흡)과 검증·허용목록(whitelist) 부재입니다.',
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '3. Command Injection의 기본 개념' },
    {
      type: 'p',
      content: [
        'Command Injection은 애플리케이션이 사용자 입력을 운영체제의 쉘 명령 문자열에 그대로 이어붙이거나 쉘로 전달하여 실행할 때 발생하는 취약점입니다. 공격자는 쉘 메타문자(예: ',
        { type: 'code', text: ';' },
        ', ',
        { type: 'code', text: '&&' },
        ', ',
        { type: 'code', text: '|' },
        ', ',
        { type: 'code', text: '`' },
        ', ',
        { type: 'code', text: '$()' },
        ' 등)나 특수 문법을 이용해 원래 의도된 명령 뒤에 임의 명령을 추가하거나 다른 동작을 실행하게 만듭니다. 예: 파일 내용 보기, 시스템 명령 실행, 백도어 설치, 권한 상승 등으로 이어질 수 있습니다.',
      ],
    },
    { type: 'h3', text: '3.1 쉘(운영체제 명령) 기초 개념' },
    {
      type: 'nested-list',
      items: [
        {
          content: ['유닉스/리눅스 쉘에서 흔한 메타문자와 의미'],
          subItems: [
            [{ type: 'code', text: ';' }, ' — 앞 명령 끝내고 다음 명령 실행'],
            [
              { type: 'code', text: '&&' },
              ' — 앞 명령이 성공하면 다음 명령 실행',
            ],
            [
              { type: 'code', text: '||' },
              ' — 앞 명령이 실패하면 다음 명령 실행',
            ],
            [
              { type: 'code', text: '|' },
              ' — 파이프(출력을 다음 명령 입력으로 연결)',
            ],
            [
              { type: 'code', text: '`cmd`' },
              ' 또는 ',
              { type: 'code', text: '$(cmd)' },
              ' — 명령 치환(출력으로 치환)',
            ],
            [
              { type: 'code', text: '>' },
              ' / ',
              { type: 'code', text: '>>' },
              ' — 리다이렉션(파일로 출력)',
            ],
          ],
        },
        {
          content: ['윈도우(cmd.exe)·PowerShell 메타문자 차이'],
          subItems: [
            [
              'Windows ',
              { type: 'code', text: '&' },
              ', ',
              { type: 'code', text: '|' },
              ', ',
              { type: 'code', text: '&&' },
              ', ',
              { type: 'code', text: '||' },
              ' 등, PowerShell은 ',
              { type: 'code', text: ';' },
              ', ',
              { type: 'code', text: '&' },
              ' 와 파워셸 고유 구문 존재 → 플랫폼에 따라 페이로드가 달라짐.',
            ],
          ],
        },
        {
          content: ['셸 명령 실행 방식'],
          subItems: [
            [
              '애플리케이션이 ',
              { type: 'code', text: 'system("some cmd " + user_input)' },
              '처럼 문자열을 쉘에 넘기면 쉘이 전체 문자열을 파싱·해석 → 메타문자가 작동함.',
            ],
            [
              '반면 ',
              { type: 'code', text: 'execve' },
              '/',
              { type: 'code', text: 'subprocess.run([...])' },
              '처럼 인자 배열로 호출하면 쉘이 관여하지 않고 메타문자 해석이 일어나지 않음(안전함).',
            ],
          ],
        },
      ],
    },
    { type: 'h3', text: '3.2 취약 예시와 기본 페이로드' },
    { type: 'p', content: ['Python'] },
    {
      type: 'code',
      text: `# user_input 이 사용자 입력이라고 가정
cmd = "ping -c 1 " + user_input
os.system(cmd)`,
    },
    {
      type: 'p',
      content: [
        '위 코드는 ',
        { type: 'code', text: 'user_input' },
        '에 쉘 메타문자가 들어가면 추가 명령이 실행됩니다.',
      ],
    },
    { type: 'p', content: ['공격자의 입력(예)'] },
    {
      type: 'ul',
      items: [[{ type: 'code', text: 'example.com; cat /etc/passwd' }]],
    },
    { type: 'p', content: ['최종으로 실행되는 쉘 문자열:'] },
    {
      type: 'code',
      text: 'ping -c 1 example.com; cat /etc/passwd',
    },
    {
      type: 'p',
      content: [
        '→ ',
        { type: 'code', text: 'ping' },
        ' 이후 ',
        { type: 'code', text: 'cat /etc/passwd' },
        '가 실행되어 민감 파일이 출력될 수 있습니다.',
      ],
    },
    { type: 'p', content: ['주요 페이로드 패턴'] },
    {
      type: 'ul',
      items: [
        [{ type: 'code', text: '; <cmd>' }, ' — 단순 명령 연결'],
        [{ type: 'code', text: '&& <cmd>' }, ' — 이전이 성공했을 때 실행'],
        [{ type: 'code', text: '| <cmd>' }, ' — 출력 파이프 연결'],
        [
          { type: 'code', text: '`cmd`' },
          ' 또는 ',
          { type: 'code', text: '$(cmd)' },
          ' — 명령 치환(특정 컨텍스트에서 유용)',
        ],
        [
          { type: 'code', text: '> /tmp/out' },
          ' — 파일로 출력해서 이후에 웹에서 읽게 만들기',
        ],
        [
          'Windows 예: ',
          {
            type: 'code',
            text: '& type C:\\Windows\\system32\\drivers\\etc\\hosts',
          },
        ],
      ],
    },
    {
      type: 'principle',
      text: '실전에서는 ;, && 등으로 뒤를 잘라내는 방식이 흔히 사용됩니다.',
    },
    {
      type: 'h3',
      text: '3.3 메타문자 우회·플랫폼 차이와 감지 포인트',
    },
    {
      type: 'nested-list',
      items: [
        {
          content: [
            '플랫폼 차이: 리눅스와 Windows는 메타문자/문장구조가 다르므로 페이로드도 달라짐. 예: PowerShell은 ',
            { type: 'code', text: ';' },
            ' 외에 ',
            { type: 'code', text: '|' },
            '의 동작이나 문자열 처리 방식이 다름.',
          ],
        },
        {
          content: ['감지 포인트(외부에서 조사할 때):'],
          subItems: [
            ['에러 메시지(명령 출력이 에러로 노출) — 운영체제 관련 에러 문구'],
            [
              '응답에 포함된 명령 출력(예: ',
              { type: 'code', text: 'whoami' },
              ', ',
              { type: 'code', text: 'id' },
              ' 출력)',
            ],
            [
              '응답 시간 지연(명령에 ',
              { type: 'code', text: 'sleep' },
              ' 혹은 ',
              { type: 'code', text: 'ping -c 10' },
              ' 같은 시간 소모 명령을 넣어 확인) — 타이밍 기반 탐지',
            ],
            [
              '파일 생성/수정(예: ',
              { type: 'code', text: '/tmp' },
              '에 파일이 만들어졌는지 체크)',
            ],
          ],
        },
        {
          content: [
            '내부 조사: 배포 스크립트, 서비스 실행 유닛(systemd), 애플리케이션 코드(어디서 ',
            { type: 'code', text: 'system' },
            '/',
            { type: 'code', text: 'exec' },
            ' 사용하는지) 확인으로 쉽게 찾아냄.',
          ],
        },
      ],
    },
    { type: 'h3', text: '3.4 Blind / Timing 기반 Command Injection' },
    {
      type: 'p',
      content: [
        '직접 명령 출력을 볼 수 없는 상황에서 공격자는 참/거짓이나 시간 기반으로 정보를 빼냅니다.',
      ],
    },
    {
      type: 'ul',
      items: [
        [
          '타이밍 기반: ',
          { type: 'code', text: '; sleep 5' },
          ' 또는 ',
          { type: 'code', text: '; ping -c 5 127.0.0.1' },
          ' 등으로 응답 지연을 유발. 요청-응답 시간이 늘어나면 명령 실행이 성공했음을 추정.',
        ],
        [
          '블라인드(간접): 명령으로 시스템 상태(파일 생성, 특정 포트 열림)를 변경하고, 이후 애플리케이션 동작이나 다른 리소스(웹페이지, 파일) 변화를 관찰해 성공 여부를 판단.',
        ],
        [
          '예: ',
          {
            type: 'code',
            text: '; if id | grep -q root; then sleep 5; fi',
          },
          ' 형태로 조건부 지연을 이용해 특정 값(예: 권한 여부)을 확인.',
        ],
      ],
    },
    { type: 'h3', text: '3.5 다양한 출현 위치(어디서 주의할 것인가)' },
    {
      type: 'ul',
      items: [
        [
          '파일명·경로 파라미터를 쉘 명령으로 실행할 때 (',
          { type: 'code', text: 'system("cat " + filename)' },
          ')',
        ],
        [
          '운영관리용 기능: 서버 상태 확인, 백업 스크립트, 이미지 처리(외부 툴 호출) 등',
        ],
        ['업로드된 파일 이름을 그대로 쉘에 전달하는 코드'],
        ['로그 처리나 이메일 전송에서 외부 명령을 호출하는 경우'],
        ['언어별 템플릿 엔진/라이브러리에서 내부적으로 쉘을 호출하는 경우'],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '4. Command injection의 주요 유형' },
    {
      type: 'grid',
      items: [
        {
          title: '핑 테스트',
          text: '공격자가 입력 필드에 악성 쉘 페이로드를 넣음 → 서버가 그 입력값을 검증·파라미터화 없이 문자열로 명령을 조합(cmd = "ping -c 3 {}".format(user_host))한 뒤 shell=True로 쉘에 넘겨 실행함 → 쉘이 ;, &&, 같은 메타문자를 해석하여 추가 명령(예: ; echo INJECTED, ; whoami, 또는 더 위험한 명령들)을 실행 → 서버가 실행 결과(또는 오류)를 HTTP 응답으로 그대로 반환하거나 페이지에 렌더링하여 공격자가 즉시 명령출력(사용자명, 환경변수, 파일내용 등)을 확인하거나 시스템을 조작(파일 읽기/수정/네트워크 호출 등)함.',
          footer: '위험도: 매우 높음',
          isToggle: true,
          details: [
            {
              type: 'warning',
              message:
                'whoami, echo, date 등 시스템에 해가 가지 않는 명령어만 사용하세요.',
            },
            { type: 'h3', text: 'Command injection' },
            {
              type: 'ul',
              items: [
                [
                  '취약한 버전에서 ',
                  { type: 'code', text: ';' },
                  ', ',
                  { type: 'code', text: '&&' },
                  ' 등 메타문자를 이용해 command injection 취약점을 확인해보세요.',
                ],
              ],
            },
            {
              type: 'code',
              text: `from flask import Flask, request, render_template_string, redirect, url_for
import subprocess
import ipaddress
import re
import html

app = Flask(__name__)

INDEX_HTML = """
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Command Injection - Ping 테스트</title>
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
    .desc {
      color: #666;
      margin-bottom: 20px;
      line-height: 1.5em;
    }
    .input-group {
      margin: 15px 0;
    }
    input[type=text] {
      width: 320px;
      padding: 8px;
      border: 1px solid #aaa;
      border-radius: 6px;
    }
    label {
      margin-right: 15px;
      cursor: pointer;
    }
    .btn {
      padding: 8px 18px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 15px;
    }
    .btn:hover {
      background: #005fcc;
    }
    .warning {
      margin-top: 20px;
      color: #999;
      font-size: 0.9em;
    }
    /* 출력 화면 카드 */
    .card {
      background: #ffffff;
      width: 760px;
      margin: 40px auto;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    pre {
      background: #272822;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      line-height: 1.3em;
      font-size: 0.95em;
    }
    .title-bad {
      color: #d9534f;
    }
    .title-good {
      color: #5cb85c;
    }
    .back-btn {
      display: inline-block;
      margin-top: 20px;
      background: #6c757d;
      color: white;
      padding: 8px 18px;
      border-radius: 6px;
      text-decoration: none;
    }
    .back-btn:hover {
      background: #545b62;
    }
  </style>
</head>
<body>

<div class="container">
  <h1>Command Injection – Ping 테스트</h1>

  <p class="desc">
    교육용 Command Injection 실습 페이지입니다.<br>
    “취약한 실행(vulnerable)” 과 “안전한 실행(safe)”의 차이를 비교해보세요.
  </p>

  <form action="/ping" method="get">

    <div class="input-group">
      <label><b>Host / IP 입력</b></label><br>
      <input type="text" name="host" value="127.0.0.1">
    </div>

    <div class="input-group">
      <label>
        <input type="radio" name="mode" value="vulnerable" checked>
        <span class="title-bad">취약한 실행</span>
      </label>

      <label>
        <input type="radio" name="mode" value="safe">
        <span class="title-good">안전한 실행</span>
      </label>
    </div>

    <button class="btn">Ping 실행</button>
  </form>

  <p class="warning">※ 이 실습 환경은 로컬 교육용입니다. 외부에 절대 공개하지 마세요.</p>
</div>

</body>
</html>
"""

@app.route("/")
def index():
    return render_template_string(INDEX_HTML)

@app.route("/ping")
def ping_dispatch():
    host = request.args.get("host", "")
    mode = request.args.get("mode", "vulnerable")

    if mode == "safe":
        return redirect(url_for("ping_safe", host=host))
    else:
        return redirect(url_for("ping_vulnerable", host=host))

# ----------------------------- #
#         취약한 실행 부분        #
# ----------------------------- #
@app.route("/ping-vulnerable")
def ping_vulnerable():
    user_host = request.args.get("host", "")
    if not user_host:
        return "host 파라미터를 주세요.", 400

    cmd = f"ping -c 3 {user_host}"

    try:
        out = subprocess.check_output(cmd, shell=True,
                                      stderr=subprocess.STDOUT,
                                      timeout=8, text=True)
    except subprocess.CalledProcessError as e:
        out = f"명령 오류:\\n{e.output}"
    except Exception as e:
        out = f"예외: {e}"

    cmd_escaped = html.escape(cmd)
    out_escaped = html.escape(out)

    page = f"""
    <div class="card">
      <h2 class="title-bad">취약한 실행 (vulnerable)</h2>
      <pre>명령어: {cmd_escaped}\\n\\n{out_escaped}</pre>
      <a href="/" class="back-btn">← 돌아가기</a>
    </div>
    """
    return page

# ----------------------------- #
#           안전 실행           #
# ----------------------------- #
@app.route("/ping-safe")
def ping_safe():
    user_host = request.args.get("host", "")
    if not user_host:
        return "host 파라미터를 주세요.", 400

    # IP 검사
    try:
        ipaddress.ip_address(user_host)
        is_ip = True
    except ValueError:
        is_ip = False

    # 단순 도메인 정규식
    domain_re = re.compile(r'^[A-Za-z0-9.-]{1,253}$')

    if not (is_ip or domain_re.match(user_host)):
        return "허용되지 않는 호스트 형식입니다.", 400

    cmd_list = ["ping", "-c", "3", user_host]

    try:
        out = subprocess.check_output(cmd_list,
                                      stderr=subprocess.STDOUT,
                                      timeout=8, text=True)
    except subprocess.CalledProcessError as e:
        out = f"명령 오류:\\n{e.output}"
    except Exception as e:
        out = f"예외: {e}"

    cmd_display = " ".join(cmd_list)
    cmd_escaped = html.escape(cmd_display)
    out_escaped = html.escape(out)

    page = f"""
    <div class="card">
      <h2 class="title-good">안전한 실행 (safe)</h2>
      <pre>명령어: {cmd_escaped}\\n\\n{out_escaped}</pre>
      <a href="/" class="back-btn">← 돌아가기</a>
    </div>
    """
    return page

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
`,
            },
            {
              type: 'image',
              src: command1,
              alt: 'Command Injection Example 1',
            },
            {
              type: 'image',
              src: command2,
              alt: 'Command Injection Example 2',
            },
            {
              type: 'image',
              src: command3,
              alt: 'Command Injection Example 3',
            },
            {
              type: 'ul',
              items: [
                [
                  '1. 취약한 모드와 안전한 모드에서 정상적으로 핑이 날아가는 동작을 확인합니다.',
                ],
                [
                  '2. 취약한 모드에서 ',
                  { type: 'code', text: '127.0.0.1; whoami' },
                  ' 를 입력하여 결과를 확인합니다.',
                ],
                [
                  '3. 안전한 모드에서 ',
                  { type: 'code', text: '127.0.0.1; whoami' },
                  ' 를 입력하여 결과를 확인합니다.',
                ],
              ],
            },
            {
              type: 'p',
              content: [
                '위 실습은 ',
                { type: 'code', text: 'ping -c' },
                ' 로 서로 핑을 날려 통신을 확인하는 코드입니다. 이 때 취약한 모드에서는 사용자의 입력을 그대로 시스템 함수에 넣게 되어 ',
                { type: 'code', text: 'whoami' },
                '가 동작하게 되고, ',
                { type: 'code', text: 'ping -c' },
                ' 명령어의 작업이 끝난 후 ',
                { type: 'code', text: 'whoami' },
                ' 명령까지 수행하는 모습을 볼 수 있습니다.',
              ],
            },
            { type: 'h3', text: '핵심포인트' },
            {
              type: 'code',
              text: 'cmd = "ping -c 3 {}".format(user_host)',
            },
            {
              type: 'ul',
              items: [
                [
                  '사용자 입력(',
                  { type: 'code', text: 'user_host' },
                  ')를 그대로 명령 문자열에 붙이면 ',
                  { type: 'code', text: ';' },
                  ', ',
                  { type: 'code', text: '&&' },
                  ', ',
                  { type: 'code', text: '`(백틱)' },
                  ' 등 쉘 메타문자를 통해 추가 명령이 주입될 수 있습니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: 'out = subprocess.check_output(cmd, shell=True, ...)',
            },
            {
              type: 'ul',
              items: [
                [
                  { type: 'code', text: 'shell=True' },
                  ' 는 문자열 전체를 ',
                  { type: 'code', text: '/bin/sh -c “…”' },
                  '로 실행하므로 쉘이 메타문자를 해석해 임의 명령을 실행합니다.',
                ],
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
        'Command Injection 방어는 “입력이 운영체제 명령의 어느 자리에 들어가느냐” 에 따라 대응이 달라집니다. 같은 문자열도 명령의 인수로 들어가면 안전할 수 있지만, 쉘(또는 명령 구조) 자리에 끼어들면 코드로 해석됩니다. 그래서 “특정 문자 치환” 같은 단일 규칙만으로는 안전하지 않고, 컨텍스트별 원칙을 지켜야 합니다.',
      ],
    },
    { type: 'hr' },
    { type: 'h3', text: '컨텍스트별 원칙' },
    { type: 'h4', text: '명령(실행 파일) 자리 → 허용목록(Whitelist)으로 매핑' },
    {
      type: 'ul',
      items: [
        [
          '실행할 프로그램(예: ',
          { type: 'code', text: 'ping' },
          ', ',
          { type: 'code', text: 'ls' },
          ', ',
          { type: 'code', text: 'cat' },
          ') 이름 자체는 사용자 입력을 그대로 넣을 수 없습니다. 외부 입력은 키/ID로 받아 내부 매핑에서 안전한 명령으로 치환해야 합니다.',
        ],
      ],
    },
    {
      type: 'code',
      text: `ALLOW = {"ping": ["ping", "-c", "1"], "date": ["date"]}
key = request.args.get("cmd_key")
cmd = ALLOW.get(key)
# 직접 user-provided string을 exec하지 않음`,
    },
    {
      type: 'h4',
      text: '인수(Argument / Value) 자리 → 인자 리스트 + 검증(또는 바인딩)',
    },
    {
      type: 'ul',
      items: [
        [
          '외부 입력을 명령의 인수로 넘길 때는 쉘을 거치지 않고 리스트 인자로 전달(e.g., ',
          { type: 'code', text: 'subprocess.run([...], shell=False)' },
          ')하고, 값 검증(화이트리스트/정규식/타입 체크)을 병행합니다.',
        ],
      ],
    },
    {
      type: 'code',
      text: `import subprocess
cmd_list = ["ping", "-c", "1", user_host]  # shell=False
subprocess.check_output(cmd_list, shell=False, timeout=5, text=True)`,
    },
    {
      type: 'ul',
      items: [
        [
          '리스트 인자로 실행하면 ',
          { type: 'code', text: ';' },
          ', ',
          { type: 'code', text: '&&' },
          ', ',
          { type: 'code', text: '`' },
          ', ',
          { type: 'code', text: '$(...)' },
          ' 같은 쉘 메타문자가 인수로만 처리되어 주입 불가합니다.',
        ],
      ],
    },
    {
      type: 'h4',
      text: '쉘 구조(Structure) 자리 → 절대 자유 입력 금지, 템플릿 분기 사용',
    },
    {
      type: 'ul',
      items: [
        [
          '파이프(',
          { type: 'code', text: '|' },
          '), 리다이렉션(',
          { type: 'code', text: '>' },
          '), 명령 연결자(',
          { type: 'code', text: ';' },
          ', ',
          { type: 'code', text: '&&' },
          ') 등 명령 구조는 입력으로 받지 말고, 필요한 경우 미리 정의된 템플릿(또는 분기)로만 처리합니다.',
        ],
      ],
    },
    {
      type: 'code',
      text: `# bad: user_supplied = "cmd1 | cmd2"
# good: op = "pipe" if req.query.pipe == "1" else None
# then select predefined patterns, don't concatenate raw string`,
    },
    {
      type: 'h4',
      text: '파일경로 / 파일명 자리 → 정규화(정규화된 절대경로) + 허용 디렉토리 검사',
    },
    {
      type: 'ul',
      items: [
        [
          '입력으로 파일경로를 받는 경우 URL인코딩/심볼릭 링크/',
          { type: 'code', text: '..' },
          ' 기법을 정상화(realpath)한 뒤 서비스 허용 영역(예: ',
          { type: 'code', text: '/srv/public' },
          ')에 포함되는지 검사합니다.',
        ],
      ],
    },
    {
      type: 'code',
      text: `import os
path = os.path.realpath(user_path)
if not path.startswith("/srv/public/"):
    reject()`,
    },
    { type: 'h4', text: '환경변수 / 작업디렉토리 → 검증 후 제한적으로 사용' },
    {
      type: 'ul',
      items: [
        [
          '환경변수에 사용자 입력을 직접 심어 ',
          { type: 'code', text: 'subprocess' },
          '로 전달하지 말 것. 필요한 값은 함수 인자나 내부 매핑으로 처리합니다.',
        ],
      ],
    },
    { type: 'h3', text: '그 외 필수 수칙' },
    {
      type: 'nested-list',
      items: [
        {
          content: [
            '절대 ',
            { type: 'code', text: 'shell=True' },
            '+ 문자열 결합 금지',
          ],
          subItems: [
            [
              { type: 'code', text: 'subprocess(..., shell=True)' },
              '로 사용자 입력을 포함한 문자열을 실행하면 쉘이 메타문자를 해석해 주입이 쉽습니다.. 가능한 한 ',
              { type: 'code', text: 'shell=False' },
              ' + 리스트 인자를 사용해야 합니다.',
            ],
          ],
        },
        {
          content: ['명령 화이트리스트(허용목록) 사용'],
          subItems: [
            [
              '실행 가능한 명령/옵션을 미리 정의해 내부 매핑으로만 호출하며 사용자가 직접 명령 문자열을 제공하는 방식은 사용하지 않습니다.',
            ],
          ],
        },
        {
          content: ['입력 검증은 다층으로'],
          subItems: [
            [
              '타입 검사(숫자/도메인/IP) → 길이 제한 → 정규식(허용 문자만) → 최종 화이트리스트 검증만으로 완벽하지 않음을 인지하고 ',
              { type: 'code', text: 'shell=False' },
              ' 등 다른 방어와 병행합니다.',
            ],
          ],
        },
        {
          content: ['최소 권한 원칙'],
          subItems: [
            [
              '애플리케이션은 가능한 낮은 권한으로 실행합니다. 컨테이너화 시에도 필요 권한(',
              { type: 'code', text: 'NET_RAW' },
              ' 등)만 허용하고 ',
              { type: 'code', text: 'privileged' },
              '는 피합니다.',
            ],
          ],
        },
        {
          content: ['타임아웃·리소스 제한'],
          subItems: [
            [
              '명령 실행시 ',
              { type: 'code', text: 'timeout' },
              '과 최대 출력 길이 제한을 두어 DoS/무한블록을 방지합니다.',
            ],
            [
              '예: ',
              { type: 'code', text: 'subprocess.check_output(..., timeout=8)' },
            ],
          ],
        },
        {
          content: ['출력 검열 및 이스케이프'],
          subItems: [
            [
              '사용자에게 보여주는 명령 출력은 항상 ',
              { type: 'code', text: 'html.escape()' },
              ' 등으로 이스케이프하고, 민감한 패턴(',
              { type: 'code', text: '/etc/shadow' },
              ')은 마스킹하거나 내부 로그로만 남깁니다.',
            ],
          ],
        },
        {
          content: ['로그·모니터링·감사'],
          subItems: [
            [
              '의심스러운 입력(세미콜론, 백틱, 네트워크 호출 키워드 등)을 로그에 남겨 탐지. 테스트는 교육용이라도 로깅을 권장합니다.',
            ],
          ],
        },
        {
          content: ['컨테이너·샌드박스화'],
          subItems: [
            [
              '외부 명령 실행이 필요한 경우 반드시 컨테이너/가상환경에서 격리·실행하고, seccomp·AppArmor·SELinux 등으로 시스템 콜/권한을 제한합니다.',
            ],
          ],
        },
        {
          content: ['에러 메시지 최소화'],
          subItems: [
            [
              '상세한 시스템 에러/스택트레이스는 클라이언트에 그대로 노출하지 말아야 합니다.(공격자 정보 수집에 악용됨).',
            ],
          ],
        },
        {
          content: ['명령 출력에 대한 길이·패턴 제어'],
          subItems: [
            [
              '응답 길이 제한, 특정 민감 패턴(예: ',
              { type: 'code', text: 'root:x:' },
              ') 탐지 시 자동 차단/마스킹 합니다.',
            ],
          ],
        },
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '6. 체크리스트' },
    {
      type: 'checklist',
      items: [
        ['사용자 입력을 OS 쉘 명령 문자열에 직접 붙여 실행하고 있지 않은가?'],
        [
          '쉘 호출이 불가피하면 ',
          { type: 'code', text: 'shell=False' },
          ' / 인자 배열로 호출하고 있는가?',
        ],
        ['입력에 대해 허용목록(allowlist)을 적용했는가?'],
        ['외부 명령 대신 가능한 네이티브 API를 사용하고 있는가?'],
        ['애플리케이션을 실행하는 시스템 계정에 최소 권한만 부여했는가?'],
        [
          '중요 파일(.env, config 등)이 웹 프로세스에서 읽을 필요가 없도록 권한을 제한했는가?',
        ],
        [
          '실행된 명령의 로그를 기록하고, 이상 징후(평소와 다른 명령/빈도)를 모니터링하고 있는가?',
        ],
      ],
    },
  ],
};
