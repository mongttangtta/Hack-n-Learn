# 🏦 HallymBank — Flask 기반 보안 실습 웹 애플리케이션

> **교육용 실습 전용 프로젝트입니다.**  
> 이 코드는 실제 서비스 환경에 절대 배포하거나 인터넷에 노출하지 마세요.  
> 로컬 환경에서만 Boolean-based Blind SQL Injection실습을 위한 학습용으로 설계되었습니다.

---

## 🚀 실행 방법

### 🧭 프로젝트 내려받기
원하는 폴더로 이동
```
cd C:\Users\내이름\Desktop
```

GitHub에서 프로젝트 클론
(👉 예: https://github.com/WhiteHatSchool/HallymBank.git 라고 가정)
```
git clone https://github.com/WhiteHatSchool/HallymBank.git
```

프로젝트 폴더로 이동
```
cd HallymBank
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

