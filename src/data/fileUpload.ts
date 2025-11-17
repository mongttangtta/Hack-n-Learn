import heroImage from '../assets/images/이론학습 상세.png';
import fileUpload1 from '../assets/images/fileUpload/fileUpload1.png';
import fileUpload2 from '../assets/images/fileUpload/fileUpload2.png';
import fileUpload3 from '../assets/images/fileUpload/fileUpload3.png';
import fileUpload4 from '../assets/images/fileUpload/fileUpload4.png';
import fileUpload5 from '../assets/images/fileUpload/fileUpload5.png';
import fileUpload6 from '../assets/images/fileUpload/fileUpload6.png';
import fileUpload7 from '../assets/images/fileUpload/fileUpload7.png';
import fileUpload8 from '../assets/images/fileUpload/fileUpload8.png';
import fileUpload9 from '../assets/images/fileUpload/fileUpload9.png';
import fileUpload10 from '../assets/images/fileUpload/fileUpload10.png';
import fileUpload11 from '../assets/images/fileUpload/fileUpload11.png';
import fileUpload12 from '../assets/images/fileUpload/fileUpload12.png';
import fileUpload13 from '../assets/images/fileUpload/fileUpload13.png';
import fileUpload14 from '../assets/images/fileUpload/fileUpload14.png';
import fileUpload15 from '../assets/images/fileUpload/fileUpload15.png';
import fileUpload16 from '../assets/images/fileUpload/fileUpload16.png';
import fileUpload17 from '../assets/images/fileUpload/fileUpload17.png';
import fileUpload18 from '../assets/images/fileUpload/fileUpload18.png';
import type { LearningTopic } from '../types/learning';

export const fileUpload: LearningTopic = {
  id: 'file-upload',
  title: 'File Upload',
  subtitle:
    '파일 업로드 시 확장자 검증이 부실하면, 웹셸 같은 악성 파일을 올려 서버 장악이 가능.',
  imageUrl: heroImage,
  description:
    '파일 업로드 시 확장자 검증이 부실하면, 웹셸 같은 악성 파일을 올려 서버 장악이 가능.',
  difficulty: '어려워요',
  isCompleted: false,
  content: [
    { type: 'h2', text: '1. 개요 & 학습 목표' },
    {
      type: 'ul',
      items: [
        ['파일 업로드 취약점의 종류와 발생 원리를 이해한다.'],
        [
          '악성 파일(웹셸, 스크립트 등) 업로드로 인한 피해 시나리오를 알 수 있다.',
        ],
        ['안전한 업로드 파이프라인(검증 → 저장 → 서빙)을 설계·구현할 수 있다.'],
        ['프레임워크·언어별 권장 패턴을 적용해 취약점을 제거할 수 있다.'],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '2. 파일 업로드 취약점이란?' },
    {
      type: 'p',
      content: [
        'File Upload 취약점은 애플리케이션이 사용자가 업로드한 파일을 적절히 검증·제한·저장하지 않을 때 발생합니다. 공격자는 이를 이용해 웹셸 업로드·원격 코드 실행(RCE)·권한 상승·서비스 거부(대용량 파일)·민감정보 유출(임시 파일 경로 노출) 등을 유발할 수 있습니다.',
      ],
    },
    { type: 'h3', text: '훔칠 수 있는 것 / 가능한 피해' },
    {
      type: 'ul',
      items: [
        ['웹셸 업로드 → 원격 명령 실행, 서버 완전 장악'],
        ['악성 스크립트(php, jsp, aspx) 업로드 후 실행 → DB·파일시스템 탈취'],
        ['이미지/문서 내 악성 페이로드(라이브러리 취약점으로 인한 RCE)'],
        ['대용량 파일 업로드 → 디스크 공간 고갈(DoS)'],
        ['악성 압축 파일(Zip Bomb) → 압축 해제 시 자원 고갈'],
        ['임시파일/디렉터리 노출 → 민감 정보 유출'],
        ['MIME/확장자 위조로 인한 클라이언트측 공격 (XSS 등)'],
      ],
    },
    { type: 'h3', text: '문제의 핵심' },
    {
      type: 'ul',
      items: [
        [
          '파일 ',
          '**확장자만**',
          ' 검사하거나, 클라이언트 제공 메타데이터(MIME type)만 신뢰하면 취약.',
        ],
        [
          '업로드된 파일을 ',
          '**웹루트**',
          '에 그대로 저장하고 실행 권한을 허용하면 치명적.',
        ],
        ['파일 내부 컨텐츠(매직 바이트)와 실제 확장자가 불일치할 수 있음.'],
        ['파일명/경로 검증 미흡 → 디렉터리 트래버설, 덮어쓰기 가능.'],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '3. File Upload의 기본 개념' },
    { type: 'h3', text: '3.1 파일 업로드 기능의 본질' },
    {
      type: 'p',
      content: [
        '웹 애플리케이션의 파일 업로드 기능은 사용자가 자신의 디바이스에서 선택한 파일을 서버로 전송하여 저장하거나, 변환·처리·공유하는 기능입니다.',
      ],
    },
    {
      type: 'ul',
      items: [
        ['프로필 이미지 업로드 (SNS, 커뮤니티)'],
        ['증명서·첨부파일 업로드 (전자정부, 취업 사이트)'],
        ['데이터 파일 제출 (과제 제출, 리포트)'],
        ['이미지/동영상 변환 (썸네일, 인코딩)'],
      ],
    },
    {
      type: 'p',
      content: [
        '즉, 서버는 외부 사용자가 생성한 “파일이라는 데이터 blob”을 받아서 저장하고, 때로는 가공하거나 다른 사용자에게 제공합니다. 이 과정에서 입력값을 ‘문자열’로 받는 로그인 폼보다 훨씬 위험한 이유는 파일 내부에는 코드, 실행 명령, 시스템 공격 벡터가 함께 들어갈 수 있기 때문입니다.',
      ],
    },
    { type: 'h3', text: '3.2 “파일 업로드”가 위험한 이유' },
    {
      type: 'p',
      content: [
        '파일 업로드 취약점은 단순히 “잘못된 확장자”의 문제가 아닙니다. 핵심은 “서버가 외부의 파일을 믿고 처리한다”는 신뢰 문제입니다.',
      ],
    },
    {
      type: 'p',
      content: ['서버 입장에서 파일 업로드 과정은 3단계로 나눌 수 있습니다.'],
    },
    {
      type: 'ul',
      items: [
        ['브라우저에서 서버로 파일이 전송되는 수신단계'],
        ['서버가 파일을 임시 디렉터리나 지정된 경로에 저장하는 저장단계'],
        ['저장된 파일을 열거나 실행 / 다운로드하는 활용단계'],
      ],
    },
    {
      type: 'p',
      content: [
        '이 중 어느 한 단계라도 적절히 검증하지 않으면 다음과 같은 문제가 발생할 수 있습니다.',
      ],
    },
    {
      type: 'ul',
      items: [
        ['악성 스크립트를 업로드하고 바로 실행 (웹셸)'],
        ['기존 시스템 파일을 덮어씀'],
        ['이미지 처리 라이브러리 RCE'],
        ['압축 해제 중 경로 조작 (Zip Slip)'],
        ['과도한 업로드로 DoS 발생'],
      ],
    },
    { type: 'h3', text: '3.3 신뢰할 수 없는 입력 - 파일의 메타데이터' },
    {
      type: 'p',
      content: [
        '파일은 단순한 내용 외에도 여러 형태의 메타데이터를 함께 전송합니다. 이 중 대부분은 공격자가 조작 가능한 값입니다.',
      ],
    },
    {
      type: 'nested-list',
      items: [
        {
          content: ['**파일명**'],
          subItems: [
            ['브라우저에서 보낸 이름 그대로 서버에 저장하면 경로 조작, 확장자 우회 가능'],
            [{ type: 'code', text: 'profile.php' }, ', ', { type: 'code', text: '../../etc/passwd' }, ', ', { type: 'code', text: 'shell.php.jpg' }, ' 등'],
          ],
        },
        {
          content: ['**MIME 타입 (Content-Type)**'],
          subItems: [
            ['클라이언트가 임의 조작 가능. 헤더 신뢰 금지'],
            [{ type: 'code', text: 'image/png' }, ', ', { type: 'code', text: 'application/pdf' }],
          ],
        },
        {
          content: ['**파일 확장자**'],
          subItems: [
            ['일부 서버는 마지막 확장자만 검사'],
            [{ type: 'code', text: 'boom.php.jpg' }, ', ', { type: 'code', text: 'shell.php.jpg' }],
          ],
        },
        {
          content: ['**파일 내용 (매직 바이트)**'],
          subItems: [
            ['실제 포맷을 구별할 수 있는 시그니처로, 서버가 직접 확인해야함'],
            [{ type: 'code', text: '\\xFF\\xD8\\xFF (JPEG)' }, ', ', { type: 'code', text: '\\x89PNG (PNG)' }],
          ],
        },
      ],
    },
    {
      type: 'p',
      content: [
        '즉, 확장자나 MIME Type만으로는 실제 파일 종류를 판단할 수 없습니다.',
      ],
    },
    {
      type: 'p',
      content: [
        '공격자는 언제든지 이미지처럼 보이지만 내부에는 PHP코드를 가진 파일을 만들어낼 수 있습니다.',
      ],
    },
    { type: 'h3', text: '3.4 서버 저장 위치의 중요성' },
    {
      type: 'p',
      content: ['서버가 파일을 어디에 저장하느냐는 매우 중요한 요소입니다.'],
    },
    {
      type: 'nested-list',
      items: [
        {
          content: ['**웹루트 내부 저장**', ' (', { type: 'code', text: '/var/www/html/uploads/' }, ')'],
          subItems: [
            ['웹서버가 ', { type: 'code', text: '/uploads/' }, ' 폴더를 그대로 노출하면 사용자가 직접 URL로 접근이 가능합니다.'],
            ['공격자가 스크립트를 올리면 ', { type: 'code', text: 'uploads/shell.php' }, '에 직접 접근해 실행시킬 수 있습니다.'],
          ],
        },
        {
          content: ['**웹루트 외부 저장**', ' (', { type: 'code', text: '/data/uploads/' }, ')'],
          subItems: [
            ['사용자는 업로드한 파일의 실제 경로를 알 수 없고, 서버가 필요할 때만 다운로드용으로 전달됩니다.'],
            ['코드 실행 위험이 근본적으로 차단됩니다.'],
          ],
        },
      ],
    },
    {
      type: 'p',
      content: ['**즉, 저장 경로 설계가 File Upload 취약점의 핵심입니다.**'],
    },
    { type: 'h3', text: '3.5 파일명 처리 원칙' },
    {
      type: 'p',
      content: ['파일명은 단순 문자열이 아니라 공격의 통로가 됩니다.'],
    },
    {
      type: 'p',
      content: [
        '서버가 업로드된 파일을 원래 이름 그대로 저장하면 다음과 같은 문제가 발생합니다.',
      ],
    },
    {
      type: 'nested-list',
      items: [
        {
          content: ['경로삽입'],
          subItems: [
            ['파일이 상위 디렉토리로 저장됨'],
            [{ type: 'code', text: '../../../../etc/passwd' }],
          ],
        },
        {
          content: ['덮어쓰기'],
          subItems: [
            ['기존 시스템 파일을 덮어씀'],
            [{ type: 'code', text: 'config.php' }],
          ],
        },
        {
          content: ['이중확장'],
          subItems: [
            ['확장자 검사 우회'],
            [{ type: 'code', text: 'evil.php.jpg' }],
          ],
        },
        {
          content: ['유니코드 혼동'],
          subItems: [
            ['필터 우회'],
            [{ type: 'code', text: 'shell.pHp' }],
          ],
        },
        {
          content: ['대소문자 변형'],
          subItems: [
            ['대소문자 구분 무시 시스템에서 우회 가능'],
            [{ type: 'code', text: 'SHELL.PHP' }],
          ],
        },
      ],
    },
    { type: 'h3', text: '3.6 권한 설정과 실행 제한' },
    {
      type: 'p',
      content: [
        '업로드 폴더의 권한이 잘못 설정되어 있으면 공격자가 업로드한 파일을 실행할 수 있습니다.',
      ],
    },
    {
      type: 'nested-list',
      items: [
        {
          content: ['디렉터리 권한'],
          subItems: [
            ['업로드 폴더는 오직 웹 앱 프로세스만 접근 가능해야함'],
            [{ type: 'code', text: 'chmod 700' }, ' 또는 ', { type: 'code', text: 'chmod 750' }],
          ],
        },
        {
          content: ['파일 권한'],
          subItems: [
            ['실행권한을 제거하여 읽기/쓰기만 가능해야함'],
            [{ type: 'code', text: 'chmod 600' }],
          ],
        },
        {
          content: ['웹서버 설정'],
          subItems: [
            ['업로드 폴더에서 스크립트 실행 방지'],
            [{ type: 'code', text: 'Options -ExecCGI' }, ', ', { type: 'code', text: 'RemoveHandler.php' }, ' 등'],
          ],
        },
      ],
    },
    { type: 'h3', text: '3.7 크기 제한 / 속도 제한' },
    {
      type: 'p',
      content: [
        '공격자는 단 몇 번의 요청으로도 서버 자원을 고갈시킬 수 있습니다.',
      ],
    },
    {
      type: 'nested-list',
      items: [
        {
          content: ['대용량 파일 업로드(DoS)'],
          subItems: [
            ['1GB 파일을 무한 업로드시 디스크가 가득 참'],
          ],
        },
        {
          content: ['Chunked Transfer Abuse'],
          subItems: [
            ['HTTP Body를 천천히 보내는 Slow POST 공격'],
          ],
        },
        {
          content: ['압축 폭탄(Zip Bomb)'],
          subItems: [
            ['작은 파일이 압축 해제 후 수 GB가 되어 서버 메모리가 초과됨'],
          ],
        },
      ],
    },
    { type: 'h3', text: '3.8 다층 방어' },
    {
      type: 'p',
      content: [
        'File Upload 취약점은 앞서 살펴보았듯 한 가지 검사로 끝나지 않습니다.',
      ],
    },
    {
      type: 'p',
      content: [
        '“화이트리스트 + 경로분리 + 랜덤명 + 권한제한 + 콘텐츠 검사” 를 조합해야 합니다.',
      ],
    },
    {
      type: 'nested-list',
      items: [
        {
          content: ['1. 입력검증'],
          subItems: [
            ['확장자, MIME, 매직바이트 검증'],
            [
              { type: 'code', text: '.jpg' },
              ', ',
              { type: 'code', text: 'image/jpeg' },
              ', ',
              { type: 'code', text: '\\xFF\\xD8' },
              ' 확인',
            ],
          ],
        },
        {
          content: ['2. 파일명 / 경로 검증'],
          subItems: [
            ['사용자 입력 이름 금지'],
            [
              { type: 'code', text: 'secure_filename' },
              ', ',
              { type: 'code', text: 'UUID' },
            ],
          ],
        },
        {
          content: ['3. 저장 위치 제한'],
          subItems: [['웹루트 외부']],
        },
        {
          content: ['4. 권한 최소화'],
          subItems: [
            ['읽기 / 쓰기만 가능'],
            [{ type: 'code', text: 'chmod 600' }],
          ],
        },
        {
          content: ['5. 사후 검사'],
          subItems: [['업로드 완료 후 자동 검사'], ['AV/샌드박스']],
        },
        {
          content: ['6. 제공 시 인증/인가'],
          subItems: [
            ['다운로드만 허용'],
            [
              {
                type: 'code',
                text: 'send_file(. . ., as_attachment=True)',
              },
            ],
          ],
        },
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '4. File Upload의 주요 유형' },
    {
      type: 'grid',
      items: [
        {
          title: '1. 검증',
          text: '공격자가 웹 애플리케이션의 업로드 기능(예: 프로필 이미지, 게시판 첨부파일 등)을 악용하여 악성 스크립트나 실행파일을 업로드함 → 서버가 확장자, MIME 타입, 저장 경로 등을 제대로 검증하지 않고 그대로 서버 디렉터리에 저장함 → 공격자가 업로드된 파일의 접근 경로(URL)를 알아내 직접 요청하여 악성 코드가 실행되거나, 서버 파일 시스템에 임의 파일 쓰기·덮어쓰기·명령 실행이 발생함.',
          footer: '위험도: 매우 높음',
          isToggle: true,
          details: [
            {
              type: 'warning',
              message:
                '이번 실습은 실제로 php코드를 입력하고 실행시켜보는 실습입니다. 꼭 로컬에서만 실행시키고, 로컬이라고 하더라도 절대로 악성코드나 위험한 코드는 작성하면 안됩니다. 실습범주 외의 작업을 하다가 생긴 어떤 불이익도 책임지지 않습니다.',
            },
            { type: 'h3', text: 'File Upload 취약점 (검증 미흡)' },
            {
              type: 'ul',
              items: [
                [
                  '1번부터 5번까지의 File Upload 취약점을 따라하고 이해해보세요.',
                ],
              ],
            },
            {
              type: 'code',
              text: `# fileupload_vuln.py
from flask import Flask, request, render_template_string
import os
import zipfile

app = Flask(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_ROOT = os.path.join(BASE_DIR, "static/uploads")
os.makedirs(UPLOAD_ROOT, exist_ok=True)

HTML_FORM = """
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>🌿 {{ title }}</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
body { background-color:#f8f9fa; }
.container { max-width: 700px; margin-top: 60px; }
.card { border-radius: 15px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); }
.card-header { font-weight: bold; background: linear-gradient(90deg,#0066cc,#00b4d8); color:white; }
footer { margin-top:50px; color:#888; font-size:14px; text-align:center; }
.navbar { background-color:#002b5b; }
.navbar a { color:white !important; }
</style>
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark px-3">
 <a class="navbar-brand fw-bold" href="/">📁 File Upload Labs</a>
</nav>

<div class="container">
  <div class="card">
    <div class="card-header">{{ title }}</div>
    <div class="card-body">
      <form method="post" enctype="multipart/form-data">
        <div class="mb-3">
          <input type="file" name="file" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">파일 업로드</button>
      </form>
      {% if message %}
      <div class="alert alert-info mt-4" role="alert">{{ message|safe }}</div>
      {% endif %}
    </div>
  </div>
</div>

<footer class="mt-4">⚠️ 교육용 예제입니다. 실제 서버에 절대 배포하지 마세요.</footer>
</body>
</html>
"""

# 1️⃣ 확장자 필터링 누락
@app.route("/upload1", methods=["GET", "POST"])
def upload1():
    title = "#1 확장자 필터링 누락"
    if request.method == "POST":
        f = request.files["file"]
        path = os.path.join(UPLOAD_ROOT, f.filename)
        f.save(path)
        msg = f"<b>{f.filename}</b> 저장됨: {path} (아무 확장자도 허용됨)"
        return render_template_string(HTML_FORM, title=title, message=msg)
    return render_template_string(HTML_FORM, title=title)

# 2️⃣ MIME 타입 신뢰 (Content-Type 위조)
@app.route("/upload2", methods=["GET", "POST"])
def upload2():
    title = "#2 MIME 타입 신뢰"
    if request.method == "POST":
        f = request.files["file"]
        if f.mimetype.startswith("image/"):
            path = os.path.join(UPLOAD_ROOT, f.filename)
            f.save(path)
            msg = f"<b>{f.filename}</b> 저장됨 (MIME={f.mimetype})"
        else:
            msg = f"MIME '{f.mimetype}' 은 허용되지 않음"
        return render_template_string(HTML_FORM, title=title, message=msg)
    return render_template_string(HTML_FORM, title=title)

# 3️⃣ 이중 확장자 / 숨김 확장자 우회
@app.route("/upload3", methods=["GET", "POST"])
def upload3():
    title = "#3 이중 확장자 검사 우회"
    if request.method == "POST":
        f = request.files["file"]
        filename = f.filename
        if filename.lower().endswith((".jpg", ".png", ".gif")):
            path = os.path.join(UPLOAD_ROOT, filename)
            f.save(path)
            msg = f"{filename} 업로드 성공 (이중 확장자 가능)"
        else:
            msg = "이미지 확장자만 허용됨"
        return render_template_string(HTML_FORM, title=title, message=msg)
    return render_template_string(HTML_FORM, title=title)

# 4️⃣ 경로 조작 (Directory Traversal)
@app.route("/upload4", methods=["GET", "POST"])
def upload4():
    title = "#4 경로 조작 (Traversal)"
    if request.method == "POST":
        f = request.files["file"]
        filename = f.filename
        path = os.path.join(UPLOAD_ROOT, filename)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        f.save(path)
        msg = f"<b>{filename}</b> 저장됨: {path} (../ 경로 조작 가능)"
        return render_template_string(HTML_FORM, title=title, message=msg)
    return render_template_string(HTML_FORM, title=title)

# 5️⃣ Zip Slip (압축 해제 시 경로 탈출)
@app.route("/upload5", methods=["GET", "POST"])
def upload5():
    title = "#5 Zip Slip (경로 탈출)"
    if request.method == "POST":
        f = request.files["file"]
        zip_path = os.path.join(UPLOAD_ROOT, f.filename)
        f.save(zip_path)
        try:
            with zipfile.ZipFile(zip_path, "r") as zf:
                for member in zf.namelist():
                    target_path = os.path.normpath(os.path.join(UPLOAD_ROOT, member))
                    if not target_path.startswith(BASE_DIR):
                        print(f"[!] OUTSIDE EXTRACTION: {target_path}")
                    print(f"[*] Extracting {member} -> {target_path}")
                    os.makedirs(os.path.dirname(target_path), exist_ok=True)
                    with open(target_path, "wb") as out:
                        out.write(zf.read(member))
            msg = f"<b>{f.filename}</b> 압축 해제 완료 (경로 검증 없음)"
        except Exception as e:
            msg = f"압축 해제 중 오류 발생: {e}"
        return render_template_string(HTML_FORM, title=title, message=msg)
    return render_template_string(HTML_FORM, title=title)

# 🏠 index (스타일 통일)
@app.route("/")
def index():
    return render_template_string("""
    <!DOCTYPE html>
    <html lang="ko">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>📁 File Upload Vulnerability Labs</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
    body { background-color:#f8f9fa; }
    .container { max-width: 700px; margin-top: 80px; }
    .card { border-radius: 15px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); }
    .card-header { font-weight: bold; background: linear-gradient(90deg,#0066cc,#00b4d8); color:white; }
    .list-group a { text-decoration:none; }
    footer { margin-top:50px; color:#888; font-size:14px; text-align:center; }
    .navbar { background-color:#002b5b; }
    .navbar a { color:white !important; }
    </style>
    </head>
    <body>
    <nav class="navbar navbar-expand-lg navbar-dark px-3">
     <a class="navbar-brand fw-bold" href="/">📁 File Upload Labs</a>
    </nav>

    <div class="container">
      <div class="card">
        <div class="card-header">File Upload Vulnerability Labs</div>
        <div class="card-body">
          <div class="list-group">
            <a href="/upload1" class="list-group-item list-group-item-action">#1 확장자 필터링 누락</a>
            <a href="/upload2" class="list-group-item list-group-item-action">#2 MIME 타입 신뢰</a>
            <a href="/upload3" class="list-group-item list-group-item-action">#3 이중 확장자 우회</a>
            <a href="/upload4" class="list-group-item list-group-item-action">#4 경로 조작</a>
            <a href="/upload5" class="list-group-item list-group-item-action">#5 Zip Slip (경로 탈출)</a>
          </div>
        </div>
      </div>
    </div>

    <footer class="mt-4">⚠️ 교육용 예제입니다. 실서버에 배포 금지</footer>
    </body>
    </html>
    """)

if __name__ == "__main__":
    app.run(debug=True)
`,
            },
            {
              type: 'image',
              src: fileUpload1,
              alt: '스크린샷 2025-11-12 오후 10.27.32',
            },
            {
              type: 'p',
              content: ['각 취약점별로 실습을 진행해보겠습니다.'],
            },
            {
              type: 'p',
              content: ['- 준비'],
            },
            {
              type: 'ul',
              items: [
                ['php 다운로드 확인'],
                [{ type: 'code', text: 'php -V' }],
                [
                  '→ php가 다운로드 되어있지 않다면 자료실에서 “php”를 검색하세요.',
                ],
              ],
            },
            { type: 'h3', text: '1. 확장자 필터링 누락' },
            {
              type: 'p',
              content: ['- 준비'],
            },
            {
              type: 'ul',
              items: [[{ type: 'code', text: 'upload1.php' }, ' 파일 생성']],
            },
            {
              type: 'code',
              text: `<?php
echo "UPLOAD TEST : Hello from uploaded PHP file";
?>`,
            },
            {
              type: 'ul',
              items: [['php 다운로드 확인 / 서버 열기']],
            },
            {
              type: 'code',
              text: 'php -S 127.0.0.1:5000 -t static/upload',
            },
            {
              type: 'image',
              src: fileUpload2,
              alt: '스크린샷 2025-11-12 오후 10.28.21',
            },
            {
              type: 'ul',
              items: [
                [
                  '1. 파일 선택을 눌러 미리 만들어두었던 ',
                  { type: 'code', text: 'upload1.php' },
                  ' 를 업로드 합니다.',
                ],
              ],
            },
            {
              type: 'image',
              src: fileUpload3,
              alt: '스크린샷 2025-11-12 오후 11.01.58',
            },
            {
              type: 'ul',
              items: [
                ['1. 파일을 업로드 하면 php 파일이 저장된 경로가 뜨게 됩니다.'],
              ],
            },
            {
              type: 'image',
              src: fileUpload4,
              alt: '스크린샷 2025-11-12 오후 11.05.47',
            },
            {
              type: 'ul',
              items: [
                [
                  '1. php 서버를 열고 ',
                  { type: 'code', text: '127.0.0.1:8000/upload1.php' },
                  ' 에 접속합니다.',
                ],
              ],
            },
            {
              type: 'p',
              content: [
                '1번 실습처럼 파일 확장자 검사 없이 아무 파일이나 저장이 된다면 서버에서 PHP를 처리할 때 위 문자열이 표시될 수 있습니다.',
              ],
            },
            { type: 'h3', text: '핵심 포인트' },
            {
              type: 'code',
              text: `path = os.path.join(UPLOAD_ROOT, f.filename)
f.save(path)`,
            },
            {
              type: 'ul',
              items: [
                ['사용자가 업로드한 파일 이름(f.filename)을 그대로 저장함.'],
                [
                  '확장자(',
                  { type: 'code', text: '.php' },
                  ', ',
                  { type: 'code', text: '.exe' },
                  ', ',
                  { type: 'code', text: '.jsp' },
                  ', ',
                  { type: 'code', text: '.html' },
                  ' 등)에 대한 검증/제한이 전혀 없음.',
                ],
                [
                  '따라서 공격자가 PHP나 ASP 등 서버사이드 스크립트를 업로드하면 서버에서 해당 파일이 직접 실행될 수 있음.',
                ],
              ],
            },
            { type: 'hr' },
            { type: 'h3', text: '2. MIME 타입 신뢰' },
            {
              type: 'p',
              content: ['- 준비'],
            },
            {
              type: 'ul',
              items: [[{ type: 'code', text: 'upload2.php' }, ' 파일 생성']],
            },
            {
              type: 'code',
              text: `<?php
echo "MIME TEST : This is a harmless PHP file.";
?>`,
            },
            {
              type: 'image',
              src: fileUpload6,
              alt: '스크린샷 2025-11-13 오전 12.06.00',
            },
            {
              type: 'ul',
              items: [
                [
                  '1. 파일 선택을 눌러 ',
                  { type: 'code', text: 'upload2.php' },
                  ' 파일을 선택하고 파일을 업로드 하세요.',
                ],
              ],
            },
            {
              type: 'image',
              src: fileUpload5,
              alt: '스크린샷 2025-11-13 오전 12.05.05',
            },
            {
              type: 'ul',
              items: [
                [
                  '1. 이번 실습에서는 ',
                  { type: 'code', text: '.php' },
                  ' 파일은 필터링되고 이미지 파일일 경우만 파일 업로드가 가능합니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: `curl -i -X POST \\
  -F "file=@upload2.php;type=image/png" \\
  http://127.0.0.1:5000/upload2`,
            },
            {
              type: 'ul',
              items: [
                [
                  '1. 새로운 터미널을 열고 ',
                  { type: 'code', text: 'upload2.php' },
                  ' 파일이 있는 곳에서 ',
                  { type: 'code', text: 'curl' },
                  ' 명령어를 사용합니다.',
                ],
                ['파일의 타입을 이미지로 바꿔버립니다.'],
              ],
            },
            {
              type: 'code',
              text: `HTTP/1.1 200 OK
Server: Werkzeug/3.1.3 Python/3.13.7
Date: Wed, 12 Nov 2025 15:35:40 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 1558
Connection: close`,
            },
            {
              type: 'ul',
              items: [
                [
                  '위와 같은 코드가 뜨면 정상적으로 업로드가 완료된 상황입니다.',
                ],
              ],
            },
            {
              type: 'image',
              src: fileUpload7,
              alt: '스크린샷 2025-11-13 오전 12.37.20',
            },
            {
              type: 'ul',
              items: [['1. php서버에서 결과를 확인합니다.']],
            },
            { type: 'h3', text: '핵심 포인트' },
            {
              type: 'code',
              text: `if f.mimetype.startswith("image/"):
    path = os.path.join(UPLOAD_ROOT, f.filename)
    f.save(path)`,
            },
            {
              type: 'ul',
              items: [
                [
                  '브라우저가 전송하는 Content-Type 헤더(',
                  { type: 'code', text: 'image/png' },
                  ', ',
                  { type: 'code', text: 'image/jepg' },
                  ' 등)를 그대로 신뢰함.',
                ],
                [
                  '이 값은 클라이언트가 임의 조작 가능함(',
                  { type: 'code', text: 'curl' },
                  ', ',
                  { type: 'code', text: 'Burp' },
                  ', ',
                  { type: 'code', text: 'Postman' },
                  ' 등).',
                ],
                [
                  '실제 파일 내용이 PHP 코드여도 ',
                  { type: 'code', text: 'image/png' },
                  '라고 보내면 통과함.',
                ],
              ],
            },
            { type: 'hr' },
            { type: 'h3', text: '3. 이중 확장자 검사 우회' },
            {
              type: 'p',
              content: ['- 준비'],
            },
            {
              type: 'ul',
              items: [[{ type: 'code', text: 'upload3.php' }, ' 파일 생성']],
            },
            {
              type: 'code',
              text: `<?php
echo "Double-extension TEST : hello BUDDY"
?>`,
            },
            {
              type: 'ul',
              items: [[{ type: 'code', text: 'upload3.php' }, ' 파일명 변경']],
            },
            {
              type: 'code',
              text: 'cp upload3.php upload3.php.jpg',
            },
            {
              type: 'image',
              src: fileUpload9,
              alt: '스크린샷 2025-11-13 오전 12.43.53',
            },
            {
              type: 'ul',
              items: [
                [
                  '1. 파일 선택을 눌러 ',
                  { type: 'code', text: 'upload3.php' },
                  ' 파일을 선택하고 파일 업로드 버튼을 누릅니다.',
                ],
              ],
            },
            {
              type: 'image',
              src: fileUpload8,
              alt: '스크린샷 2025-11-13 오전 12.43.17',
            },
            {
              type: 'ul',
              items: [
                [
                  '1. 이번 실습도 이미지 파일만 업로드가 가능한 모습을 볼 수 있습니다.',
                ],
              ],
            },
            {
              type: 'image',
              src: fileUpload10,
              alt: '스크린샷 2025-11-13 오전 12.45.04',
            },
            {
              type: 'ul',
              items: [
                [
                  '1. 처음 준비해뒀던 upload3.php.jpg 파일은 정상적으로 업로드 되는것을 볼 수 있습니다.',
                ],
              ],
            },
            {
              type: 'image',
              src: fileUpload11,
              alt: '스크린샷 2025-11-13 오전 1.00.24',
            },
            {
              type: 'ul',
              items: [
                ['1. php 서버에서는 이렇게 깨진 이미지로 보입니다.'],
                [
                  '브라우저가 ',
                  { type: 'code', text: 'upload3.php.jpg' },
                  '를 이미지로 인식하고, 이미지로 보여주려 하기 때문입니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: 'curl -s http://127.0.0.1:8000/upload3.php.jpg',
            },
            {
              type: 'p',
              content: [
                'php 서버로 curl 명령어를 날려보면 아래와 같은 결과가 나옵니다.',
              ],
            },
            {
              type: 'image',
              src: fileUpload12,
              alt: '스크린샷 2025-11-13 오전 1.01.51',
            },
            {
              type: 'p',
              content: [
                '이중 확장자 취약점은 서버가 단순히 확장자만 체크하면 업로드가 통과되지만, 서버가 ',
                { type: 'code', text: '.php' },
                '로 파싱하지 않기 때문에 PHP가 실행되지는 않습니다.',
              ],
            },
            {
              type: 'ul',
              items: [
                [
                  '파일명 끝이 ',
                  { type: 'code', text: '.jpg' },
                  '로 끝나기 때문에 서버는 이 파일을 정적 이미지 파일로 보고 PHP엔진으로 보내지 않습니다.',
                ],
                [
                  '단, 서버가 잘못 구성되어 있거나 리라이트/프록시로 모든 요청을 PHP로 포워딩하면 ',
                  { type: 'code', text: '.php.jpg' },
                  '도 파싱될 수 있습니다.',
                ],
              ],
            },
            { type: 'h3', text: '핵심 포인트' },
            {
              type: 'code',
              text: `if filename.lower().endswith((".jpg", ".png", ".gif")):
    f.save(path)`,
            },
            {
              type: 'ul',
              items: [
                [
                  '마지막 확장자만 검사하여 ',
                  { type: 'code', text: 'shell.php.jpg' },
                  '같은 이중 확장자는 통과함.',
                ],
                [
                  '서버 설정(Apache, Nginx등)에 따라 ',
                  { type: 'code', text: '.php.jpg' },
                  '도 PHP로 해석될 수 있음. (특히 Apache의 ',
                  { type: 'code', text: 'AddHandler' },
                  ' 설정 시)',
                ],
              ],
            },
            { type: 'hr' },
            { type: 'h3', text: '4. 경로 조작' },
            {
              type: 'p',
              content: ['- 준비'],
            },
            {
              type: 'ul',
              items: [[{ type: 'code', text: 'upload4.php' }, ' 파일 생성']],
            },
            {
              type: 'code',
              text: `<?php
echo "You Just Activated My Trap Card"
?>`,
            },
            {
              type: 'image',
              src: fileUpload13,
              alt: '스크린샷 2025-11-14 오후 8.54.29',
            },
            {
              type: 'ul',
              items: [
                ['1. 먼저 정상 업로드를 해서 기본 경로를 확인해봅니다.'],
                [
                  '정상업로드의 경우 브라우저에서 파일을 선택해서 업로드 해도 되지만, 파일 이름을 조작해서 올릴 경우 ',
                  { type: 'code', text: 'curl' },
                  ' 명령어를 사용해야 합니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: 'curl -X POST -F "file=@upload4.php" http://127.0.0.1:5000/upload4',
            },
            {
              type: 'p',
              content: [
                '그럼 출력된 HTML 코드에서 하단에 다음과 같은 메시지를 확인할 수 있습니다.',
              ],
            },
            {
              type: 'ul',
              items: [
                [
                  'FLASK 서버는 업로드 처리 후 HTML 페이지 전체를 돌려주는데, 이 HTML이 브라우저에서는 깔끔하게 보이지만 ',
                  { type: 'code', text: 'curl' },
                  '에서는 그대로 문자열로 출력하게 됩니다.',
                ],
                [
                  '즉, 정상적으로 업로드가 되었다면 브라우저에서 업로드 됐어야 할 HTML 코드가 보입니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: `<div class="alert alert-info mt-4" role="alert">
	<b>upload4.php</b> 저장됨.
	<br>
	<code>
		/Users/jang-woohyeok/capstone/File_Upload/static/uploads/upload4.php
	</code>
</div>`,
            },
            {
              type: 'p',
              content: ['php서버에서도 php코드가 정상적으로 실행이 됩니다.'],
            },
            {
              type: 'image',
              src: fileUpload14,
              alt: '스크린샷 2025-11-14 오후 9.03.21',
            },
            {
              type: 'ul',
              items: [
                ['1. 파일 이름을 조작해서 상위 폴더로 탈출하게 만들어봅시다.'],
                [
                  { type: 'code', text: 'upload4.php' },
                  ' 라는 이름의 파일이 ',
                  { type: 'code', text: '../../evil_traversal.php' },
                  ' 라는 이름의 파일로 바뀌게 됩니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: 'curl -X POST -F "file=@upload4.php;filename=../../evil_traversal.php" http://127.0.0.1:5000/upload4',
            },
            {
              type: 'p',
              content: [
                '마찬가지로 정상적으로 업로드가 되었다면 HTML코드를 확인할 수 있고, HTML 코드 하단에 다음과 같은 메시지를 확인할 수 있습니다.',
              ],
            },
            {
              type: 'code',
              text: `<div class="alert alert-info mt-4" role="alert">
	<b>../../evil_traversal.php</b> 저장됨.
	<br>
	<code>
		/Users/jang-woohyeok/capstone/File_Upload/static/uploads/../../evil_traversal.php
	</code>
</div>`,
            },
            {
              type: 'p',
              content: ['정상적인 파일 저장 경로는 다음과 같습니다.'],
            },
            {
              type: 'code',
              text: '/Users/jang-woohyeok/capstone/File_Upload/static/uploads/upload4.php',
            },
            {
              type: 'p',
              content: [
                '여기서 ',
                { type: 'code', text: 'upload4.php' },
                '의 이름을 조작한 후 저장된 경로는 다음과 같습니다.',
              ],
            },
            {
              type: 'code',
              text: '/Users/jang-woohyeok/capstone/File_Upload/static/uploads/../../evil_traversal.php',
            },
            {
              type: 'p',
              content: [
                { type: 'code', text: 'file_Upload' },
                ' 페이지 → ',
                { type: 'code', text: 'static' },
                ' 페이지 → ',
                { type: 'code', text: 'uploads' },
                ' 페이지에 업로드 되는데, 경로조작(',
                { type: 'code', text: '../' },
                ')이 두번 들어갔으므로',
              ],
            },
            {
              type: 'p',
              content: [
                { type: 'code', text: 'file_Upload' },
                ' 페이지 → ',
                { type: 'code', text: 'static' },
                ' 페이지 → ',
                { type: 'code', text: 'uploads' },
                ' 페이지 → ',
                { type: 'code', text: 'static' },
                ' 페이지 → ',
                { type: 'code', text: 'file_Upload' },
                ' 페이지 경로가 되어 ',
                { type: 'code', text: 'evil_traversal.php' },
                ' 파일은 ',
                { type: 'code', text: 'file_Upload' },
                ' 페이지에 저장됩니다.',
              ],
            },
            { type: 'h3', text: '핵심 포인트' },
            {
              type: 'code',
              text: `filename = f.filename        # ex) ../../app.py
path = os.path.join(UPLOAD_ROOT, filename)
os.makedirs(os.path.dirname(path), exist_ok=True)
f.save(path)`,
            },
            {
              type: 'ul',
              items: [
                [
                  '파일 이름에 포함된 ',
                  { type: 'code', text: '../' },
                  ' 같은 상대 경로를 그대로 허용함.',
                ],
                [
                  { type: 'code', text: 'os.path.join()' },
                  ' 은 문자열만 이어붙이므로 ',
                  { type: 'code', text: 'UPLOAD_ROOT/../../app.py' },
                  ' → ',
                  { type: 'code', text: 'BASE_DIR/app.py' },
                  ' 와 같은 상위 디렉터리에 접근 가능',
                ],
                [
                  '공격자는 ',
                  { type: 'code', text: '../../app.py' },
                  '로 지정해 Flask 서버 파일을 덮어쓰기 할 수 있음',
                ],
              ],
            },
            { type: 'hr' },
            { type: 'h3', text: '5. Zip Slip' },
            {
              type: 'p',
              content: ['- 준비'],
            },
            {
              type: 'ul',
              items: [[{ type: 'code', text: 'upload5.php' }, ' 파일 생성']],
            },
            {
              type: 'code',
              text: `<?php
echo "ZIP_SLIP_ATTACK";
?>`,
            },
            {
              type: 'ul',
              items: [
                [{ type: 'code', text: 'make_zip_slip.py' }, ' 파일 생성'],
              ],
            },
            {
              type: 'code',
              text: `import zipfile

with zipfile.ZipFile("zip_slip_attack.zip", "w") as zf:
    # ../ 경로를 포함한 파일을 zip에 추가
    zf.writestr("../../upload5.php", "<?php echo 'ZIP SLIP WORKED'; ?>")
print("✅ zip_slip_attack.zip created")`,
            },
            {
              type: 'ul',
              items: [
                [{ type: 'code', text: 'make_zip_slip.py' }, ' 실행'],
                [
                  '환경에 따라 ',
                  { type: 'code', text: 'python' },
                  ' 명령어 혹은 ',
                  { type: 'code', text: 'python3' },
                  ' 명령어를 사용합니다.',
                ],
                [
                  '실행 후 ',
                  { type: 'code', text: 'ls' },
                  ' 명령어를 통해 ',
                  { type: 'code', text: 'zip_slip_attack.zip' },
                  ' 파일이 생성되었는지 확인합니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: 'python make_zip_slip.py',
            },
            {
              type: 'image',
              src: fileUpload16,
              alt: '스크린샷 2025-11-14 오후 9.21.28',
            },
            {
              type: 'image',
              src: fileUpload15,
              alt: '스크린샷 2025-11-14 오후 9.20.01',
            },
            {
              type: 'ul',
              items: [['1. 일반 php파일을 업로드하게 되면']],
            },
            {
              type: 'image',
              src: fileUpload17,
              alt: '스크린샷 2025-11-14 오후 9.23.26',
            },
            {
              type: 'ul',
              items: [
                ['1. 다음과 같이 확장자 필터링에 걸려 오류가 발생하게 됩니다.'],
              ],
            },
            {
              type: 'image',
              src: fileUpload18,
              alt: '스크린샷 2025-11-14 오후 9.24.45',
            },
            {
              type: 'ul',
              items: [
                [
                  '1. 미리 만들어둔 zip파일을 업로드하게 되면 “압축 해제 완료” 라고 뜨면서 업로드에 성공하게 됩니다.',
                ],
              ],
            },
            {
              type: 'ul',
              items: [
                [
                  '1. 4번 실습과 마찬가지로 ',
                  { type: 'code', text: 'File_Upload' },
                  ' 폴더에 ',
                  { type: 'code', text: 'upload5.php' },
                  '가 저장된 것을 볼 수 있습니다.',
                ],
                ['만약 실패했다면?'],
                [
                  { type: 'code', text: 'zipfile' },
                  '은 실제 파일 시스템 접근 전에 ',
                  { type: 'code', text: 'os.path.normpath()' },
                  '로 경로를 정리하기 때문에 macOS / Python 3.11+ / 최신 zipfile 모듈은 보안 강화를 위해 일부 경로를 자동으로 무시하는 경우가 있습니다.',
                ],
                ['수동으로 Zip Slip 동작 재현하기'],
                [{ type: 'code', text: 'force_zip_extract.py' }, ' 파일 생성'],
                [
                  { type: 'code', text: 'ZIP_PATH' },
                  '는 ',
                  { type: 'code', text: 'zip_slip_attack.zip' },
                  ' 이 있는 위치로 지정해야합니다.',
                ],
                [
                  { type: 'code', text: 'zip_slip_attack.zip' },
                  ' 파일이 있는 위치에서 ',
                  { type: 'code', text: 'pwd' },
                  ' 명령어를 통해 경로를 확인할 수 있습니다.',
                ],
              ],
            },
            {
              type: 'code',
              text: `import os, zipfile

# 현재 파일이 실제로 있는 위치를 절대경로로 지정
ZIP_PATH = "/Users/jang-woohyeok/Desktop/WooHyeok/capstone/File_Upload/static/uploads/zip_slip_attack.zip"
UPLOAD_ROOT = os.path.abspath("/Users/jang-woohyeok/Desktop/WooHyeok/capstone/File_Upload/static/uploads")

with zipfile.ZipFile(ZIP_PATH, "r") as zf:
    for member in zf.namelist():
        target = os.path.join(UPLOAD_ROOT, member)
        print(f"[*] Extracting {member} → {target}")
        # 강제로 extractall()처럼 풀기 (경로 검증 없음)
        zf.extract(member, UPLOAD_ROOT)`,
            },
            {
              type: 'ul',
              items: [['실행']],
            },
            {
              type: 'code',
              text: 'python force_zip_extract.py',
            },
            { type: 'h3', text: '핵심 포인트' },
            {
              type: 'code',
              text: `with zipfile.ZipFile(zip_path, "r") as zf:
    for member in zf.namelist():
        target_path = os.path.normpath(os.path.join(UPLOAD_ROOT, member))
        with open(target_path, "wb") as out:
            out.write(zf.read(member))`,
            },
            {
              type: 'ul',
              items: [
                [
                  { type: 'code', text: 'ZipFile.extractall()' },
                  ' 또는 수동 추출 시 파일명 내부의 경로(../)를 검증하지 않음.',
                ],
                [
                  { type: 'code', text: 'os.path.normpath()' },
                  '로 정규화는 하지만, 이후 “이 경로가 안전한지”(',
                  { type: 'code', text: 'startswith(UPLOAD_ROOT)' },
                  ')에 대한 검증이 없음.',
                ],
                [
                  '공격자는 zip 내부에 ',
                  { type: 'code', text: '../../app.py' },
                  ' 같은 경로를 포함시켜 압축 해제 시 상위 디렉터리에 파일 생성/덮어쓰기가 가능함.',
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
        'File Upload 취약점은 “',
        '**어떤 파일을, 어디에, 어떻게 저장하느냐**',
        '”에 따라 대응이 달라집니다. 같은 파일이라도 저장 위치나 확장자, MIME, 실행 권한에 따라 단순 데이터일 수도 있고, 코드로 실행될 수도 있기 때문입니다. 이를 피하려면 업로드된 파일을 코드가 아닌 단순 데이터로 취급해야 합니다. 단일 확장자 검사만으로는 절대 안전하지 않으며 아래 설명된 모든 단계별 컨텍스트를 안전하게 처리해야 합니다.',
      ],
    },
    {
      type: 'p',
      content: [
        '쉽게 말해 “jpg만 허용”이나 “MIME만 검사” 같은 단일 규칙으로는 안전하지 않으며, 컨텍스트별 원칙을 지켜야 합니다.',
      ],
    },
    { type: 'h3', text: '컨텍스트별 원칙' },
    { type: 'h4', text: '1. 파일명 → 화이트리스트 + 랜덤 이름화' },
    {
      type: 'ul',
      items: [
        [
          '업로드 된 파일명(',
          { type: 'code', text: 'f.filename' },
          ')은 절대 그대로 저장하지 말고, 허용 확장자만 통과시켜야 합니다.',
        ],
        [
          '또한 동일 파일명 덮어쓰기나 경로 조작을 방지하기 위해 서버가 직접 랜덤 이름을 생성합니다.',
        ],
      ],
    },
    {
      type: 'code',
      text: `ALLOWED_EXT = {"jpg", "png", "gif", "pdf"}
ext = f.filename.rsplit(".", 1)[-1].lower()
if ext not in ALLOWED_EXT:
    abort(400, "허용되지 않은 확장자입니다.")

save_name = f"{uuid.uuid4().hex}.{ext}"
f.save(os.path.join(SAFE_DIR, save_name))`,
    },
    {
      type: 'ul',
      items: [
        [
          '화이트리스트 : ',
          { type: 'code', text: 'jpg' },
          ', ',
          { type: 'code', text: 'png' },
          ', ',
          { type: 'code', text: 'gif' },
          ', ',
          { type: 'code', text: 'pdf' },
          ' 외의 확장자는 “400에러 - 허용되지 않은 확장자입니다.” 처리',
        ],
      ],
    },
    { type: 'h4', text: '2. MIME → 신뢰하지 말고 직접 판별' },
    {
      type: 'ul',
      items: [
        [
          '클라이언트가 보내는 Content-Type은 완전히 조작 가능하므로 믿으면 안됩니다.',
        ],
        ['서버가 파일 내용을 직접 분석해야 합니다.'],
        [
          'ex : Python의 ',
          { type: 'code', text: 'imghdr' },
          ', ',
          { type: 'code', text: 'python-magic' },
          ', ',
          { type: 'code', text: 'Pillow' },
          ' 등으로 실제 포맷을 식별합니다.',
        ],
      ],
    },
    {
      type: 'code',
      text: `import magic

mime = magic.from_buffer(f.read(2048), mime=True)
if not mime.startswith("image/"):
    abort(400, "이미지 파일이 아닙니다.")
f.seek(0)  # 파일 포인터 초기화 후 저장`,
    },
    {
      type: 'ul',
      items: [
        [
          { type: 'code', text: 'mime.startswith(”image/”)' },
          ' → 클라이언트 값 신뢰 금지',
        ],
      ],
    },
    {
      type: 'h4',
      text: '3. 저장 경로 → 정규화 후 허용된 디렉터리 내부에만 접근 가능하게',
    },
    {
      type: 'ul',
      items: [
        [
          '업로드 경로는 반드시 절대경로로 정규화 한 후 허용된 업로드 디렉터리 내부인지 확인해야 합니다.',
        ],
        [
          { type: 'code', text: '../' },
          ' 경로 조작이나 심볼릭 링크를 통한 탈출을 차단합니다.',
        ],
      ],
    },
    {
      type: 'code',
      text: `target_path = os.path.abspath(os.path.join(UPLOAD_DIR, filename))
if not target_path.startswith(UPLOAD_DIR):
    abort(400, "경로 조작 시도 감지")`,
    },
    {
      type: 'ul',
      items: [
        [
          { type: 'code', text: 'os.path.abspath()' },
          ' + ',
          { type: 'code', text: 'startswith()' },
          ' 검증',
        ],
        [
          '단순 문자열 결합(',
          { type: 'code', text: 'UPLOAD_DIR + filename' },
          ') 금지',
        ],
      ],
    },
    { type: 'h4', text: '4. 실행 가능 파일 → 업로드 후 실행 불가로 격리' },
    {
      type: 'ul',
      items: [
        ['업로드된 파일은 웹 루트와 분리된 비실행 디렉터리에 저장해야 합니다.'],
        [
          '예를 들어 ',
          { type: 'code', text: '/var/www/uploads/' },
          ' 아래가 아니라 ',
          { type: 'code', text: '/var/data/uploads/' },
          ' 같이 웹 접근이 차단된 위치를 사용합니다.',
        ],
        [
          '웹에서 파일 접근이 필요하면, 별도의 안전한 다운로드 라우트로 서빙합니다.',
        ],
      ],
    },
    {
      type: 'code',
      text: `@app.route("/download/<name>")
def safe_download(name):
    path = os.path.join(UPLOAD_DIR, name)
    return send_file(path, as_attachment=True)`,
    },
    {
      type: 'ul',
      items: [
        ['웹서버가 직접 제공하지 않는 디렉터리에 저장.'],
        [{ type: 'code', text: '/static/uploads/' }, ' 같은 경로에 직접 저장'],
      ],
    },
    { type: 'h4', text: '5. 압축파일 해제 → Zip Slip 방지' },
    {
      type: 'ul',
      items: [
        [
          '압축파일 내부의 파일명을 반드시 정규화 하고, 허용된 디렉터리 외부로 벗어나는 경로(',
          { type: 'code', text: '../' },
          ')가 있는지 확인합니다.',
        ],
      ],
    },
    {
      type: 'code',
      text: `with zipfile.ZipFile(zip_path) as z:
    for member in z.namelist():
        target = os.path.abspath(os.path.join(UPLOAD_DIR, member))
        if not target.startswith(UPLOAD_DIR):
            abort(400, "경로 탈출 시도")
        z.extract(member, UPLOAD_DIR)`,
    },
    {
      type: 'ul',
      items: [
        [
          { type: 'code', text: 'os.path.abspath' },
          ' + ',
          { type: 'code', text: 'startswith()' },
          ' 검증',
        ],
        ['단순 ', { type: 'code', text: 'zf.extractall(UPLOAD_DIR)' }, ' 금지'],
      ],
    },
    { type: 'h4', text: '6. 파일 내용 검증' },
    {
      type: 'ul',
      items: [
        ['확장자만 믿지 말고, 실제 파일 내용 헤더(매직바이트)를 확인합니다.'],
        [
          'ex : JPEG는 ',
          { type: 'code', text: '0xFFD8' },
          ', PNG는 ',
          { type: 'code', text: '0x89504E47' },
          ', ZIP은 ',
          { type: 'code', text: '0x504B03' },
          ' 으로 시작해야 합니다.',
        ],
      ],
    },
    { type: 'h4', text: '7. 권한/실행 제한' },
    {
      type: 'ul',
      items: [
        ['업로드 디렉터리에는 실행권한(x)제거'],
        [
          '업로드 파일에는 ',
          { type: 'code', text: 'rw-r--r-- (644)' },
          ' 이하로 제한 → 그룹 및 기타 사용자는 읽기권한만, 루트 사용자는 읽기/쓰기 권한만.',
        ],
        ['서버는 파일을 실행하지 않고, 단지 저장/다운로드만 허용'],
      ],
    },
    { type: 'h4', text: '8. 로깅 + 탐지' },
    {
      type: 'ul',
      items: [
        [
          '업로드된 파일의 이름, 크기, IP, MIME, 결과(성공/차단)를 모두 로깅합니다.',
        ],
        [
          'WAF가 있다면 multipart boundary, filename, content-type 필드를 감시하도록 설정.',
        ],
      ],
    },
    { type: 'h3', text: '그 외 필수 수칙' },
    {
      type: 'ul',
      items: [
        ['**서버 계정 권한 최소화 :**', ' 업로드 디렉터리만 쓰기 가능하도록.'],
        [
          '**확장자 이중 검사 :**',
          ' 클라이언트(JS) + 서버(Python) 모두 검사하되, ',
          '**서버 검사 결과만 신뢰**',
          '.',
        ],
        [
          '**백엔드에서 직접 파일 제공 금지 :**',
          ' 업로드 파일 접근은 반드시 ',
          { type: 'code', text: 'send_file()' },
          ' 같은 API를 통해 제공.',
        ],
        [
          '**파일 크기 제한 :**',
          ' 대용량 업로드 DoS 방지 (',
          { type: 'code', text: 'MAX_CONTENT_LENGTH' },
          ' 등).',
        ],
        [
          '**정기 점검 :**',
          ' 업로드 디렉터리에 실행 가능한 스크립트나 ',
          { type: 'code', text: '.htaccess' },
          '가 생성되어 있지 않은지 주기적 검사.',
        ],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '6. 안전한 구현 예제' },
    { type: 'h3', text: '6.1 PHP (안전권장 패턴)' },
    {
      type: 'code',
      text: `// 안전 예시 (간단한 흐름)
$allowed_ext = ['jpg','jpeg','png','gif'];
$max_size = 5 * 1024 * 1024; // 5MB

if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
  $tmp = $_FILES['file']['tmp_name'];
  $finfo = finfo_open(FILEINFO_MIME_TYPE);
  $mime = finfo_file($finfo, $tmp);
  // 실제 MIME 확인
  $ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
  if (!in_array($ext, $allowed_ext)) die('Bad ext');
  if (!in_array($mime, ['image/jpeg','image/png','image/gif'])) die('Bad mime');
  if ($_FILES['file']['size'] > $max_size) die('Too large');

  // 랜덤 파일명 생성
  $newname = bin2hex(random_bytes(16)) . '.' . $ext;
  // 웹루트 밖의 디렉토리(예: /var/www/uploads_not_public)
  move_uploaded_file($tmp, "/var/www/uploads_not_public/" . $newname);

  // 필요 시 이미지 리사이즈/재인코딩하고 공개용으로 복사
  echo "Uploaded";
}`,
    },
    { type: 'h3', text: '6.2 Node.js (multer + file-type)' },
    {
      type: 'code',
      text: `const FileType = require('file-type');
// multer로 tmp 저장 후
const buffer = fs.readFileSync(req.file.path);
const type = await FileType.fromBuffer(buffer);
if (!type || !['image/jpeg','image/png','image/gif'].includes(type.mime)) {
  fs.unlinkSync(req.file.path);
  return res.status(400).send('Invalid file');
}
// 랜덤 이름, 웹루트 밖에 저장
const newName = crypto.randomBytes(16).toString('hex') + '.' + type.ext;
fs.renameSync(req.file.path, path.join('/var/uploads_not_public', newName));`,
    },
    { type: 'h3', text: '6.3 Python Flask (Pillow로 재인코딩)' },
    {
      type: 'code',
      text: `from PIL import Image
from werkzeug.utils import secure_filename
ALLOWED = {'png','jpg','jpeg','gif'}

f = request.files['file']
ext = f.filename.rsplit('.',1)[1].lower()
if ext not in ALLOWED:
    abort(400)
# 이미지 열어서 재저장 -> 악성 페이로드 제거 가능성 낮춤
img = Image.open(f.stream)
newname = secrets.token_hex(16) + '.' + ext
save_path = os.path.join('/var/uploads_not_public', newname)
img.save(save_path, optimize=True)`,
    },
    { type: 'hr' },
    { type: 'h2', text: '7. 체크리스트' },
    {
      type: 'checklist',
      items: [
        ['업로드된 파일을 ', '**웹 루트 밖**', '에 저장하고 있는가?'],
        ['파일 확장자 허용목록을 운영 중인가? (화이트리스트)'],
        ['서버 측에서 ', '**파일 MIME/매직바이트 검사**', '를 수행하는가?'],
        ['파일 이름을 난수화(원본명 사용 금지) 하고 경로 조작을 방지하는가?'],
        ['업로드 디렉토리에 실행 권한이 없는가?'],
        ['최대 파일 크기 및 파일수 제한을 설정했는가?'],
        ['업로드 후 재인코딩(이미지) 또는 변환을 수행하는가?'],
        ['AV 스캔/파일 스캔 프로세스를 도입했는가?'],
        ['업로드 로그(사용자·IP·타임스탬프·해시)를 남기는가?'],
        [
          '파일을 서빙할 때 ',
          { type: 'code', text: 'Content-Disposition: attachment' },
          ', ',
          { type: 'code', text: 'X-Content-Type-Options: nosniff' },
          ' 등을 설정하는가?',
        ],
      ],
    },
    { type: 'hr' },
    { type: 'h2', text: '8. 퀴즈 (확인용)' },
    {
      type: 'ul',
      items: [
        ['1. 파일 업로드 보안을 위해 파일명을 난수화하는 이유는?'],
        ['2. 확장자 검사만으로 충분하지 않은 이유는?'],
        ['3. 업로드 파일을 웹 루트 밖에 저장하면 어떤 장점이 있는가?'],
        ['4. 이미지 업로드 시 재인코딩을 권장하는 이유는?'],
      ],
    },
  ],
};
