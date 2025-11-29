<p align="center">
  <img src="https://img.shields.io/badge/Team-몽땅따-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Project-Hack--n--Learn-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
</p>

# 🌐 Hack-n-Learn: 인터랙티브 보안 실습 플랫폼
> **“입문자도 짧은 시간 안에 웹 취약점을 배우고, 직접 공격해볼 수 있는 AI기반 보안 교육 플랫폼”**
---
<br><br><br>

메인페이지 그림 띄우기

# 📑 0. 목차 (Table of Contents)

- [🌐 Hack-n-Learn: 인터랙티브 보안 실습 플랫폼](#-hack-n-learn-인터랙티브-보안-실습-플랫폼)
- [📚 1. 프로젝트 개요](#-1-프로젝트-개요)
  - [👥 1-1. 팀원 구성 및 소개](#-1-1-팀원-구성-및-소개)
  - [🚀 1-2. 서비스 소개](#-1-2-서비스-소개)
  - [🎯 1-3. 개발 배경 및 목표](#-1-3-개발-배경-및-목표)
  - [🗓️ 1-4. 개발 일정(WBS)](#️-1-4-개발-일정wbs)
- [🏛️ 2. 시스템 구조](#️-2-시스템-구조)
  - [🧰 2-1. 기술 스택](#-2-1-기술-스택)
  - [🧱 2-2. 세부 아키텍처 다이어그램](#-2-2-세부-아키텍처-다이어그램)
  - [📁 2-3. 디렉터리 구조 (Tree)](#-2-3-디렉터리-구조-tree)
  - [🖥️ 2-4. 서비스 구조](#️-2-4-서비스-구조)
  - [🗄️ 2-5. 데이터베이스 ERD](#️-2-5-데이터베이스-erd)
- [🔍 3. 주요 기능](#-3-주요-기능)
  - [📘 3-1. 서비스 기능](#-3-1-서비스)
  - [🤖 3-2. AI 챗봇 / AI 해설](#-3-2-ai-챗봇--ai-해설)
  - [🏆 3-3. 게임화 요소 (Gamification)](#-3-3-게임화-요소-gamification)


---
# 📚 1. 프로젝트 개요

## 👥 1-1. 팀원 구성 및 소개

### 🔧 역할 분담 (Front / Back / Security)
<table>
  <tr>
    <th style="text-align:center;">Frontend</th>
    <th style="text-align:center;">Backend</th>
    <th style="text-align:center;">Security</th>
  </tr>
  <tr>
    <td style="text-align:center;"><b>이준수 (PM)</b></td>
    <td style="text-align:center;"><b>최준호</b></td>
    <td style="text-align:center;"><b>장우혁</b></td>
  </tr>
  <tr>
    <td style="text-align:center;">프론트엔드 개발 / 퍼블리싱</td>
    <td style="text-align:center;">백엔드 개발 / API 설계</td>
    <td style="text-align:center;">취약점 실습 환경 제작</td>
  </tr>
  <tr>
    <td style="text-align:center;">UI/UX 구성 / 기능 구현</td>
    <td style="text-align:center;">DB 설계 / 서버 운영</td>
    <td style="text-align:center;">공격·방어 로직 구현, 문제 기획, 문서화</td>
  </tr>
</table>

## 📌 Project Documents
- **Notion :** [프로젝트 노션 링크](https://www.notion.so/2025-2-24e2f42bf16780e099c3e697969527cf)
- **Figma :** [프로젝트 피그마 링크](https://www.figma.com/design/WBl5nQpFn6xTuTadciknmj/Hack--n--Learn?node-id=354-51&t=f7VBh3QUKE77eR4L-1)

---

## 🚀 1-2. 서비스 소개

### 🔑 핵심 가치
- 입문자도 쉽게 배우는 웹 취약점 교육
- 모든 실습이 **100% 로컬에서 안전하게 실행 가능**
- 공격 → 로그 분석 → AI 해설까지 한 번에 제공
- 기존 Wargame보다 높은 접근성

### 🆚 차별점
- AI 기반 문제 해설 및 챗봇
- 현실적인 시나리오로 사용자의 몰입도 상승
- 실제 코드로 보는 취약점 실습
- 실습 서버 직접 구동
- 실시간 보안뉴스 제공

---

## 🎯 1-3. 개발 배경 및 목표

### ❗ 기존 Wargame의 한계
- 영문 기반
- 난이도 높음
- 로컬 실습 기반 부족
- 코드 단위 학습 어려움
- 상대적으로 부족한 방어기법

### 🔧 개선 방향
- Flask/PHP 로컬 서버 기반 실습 제공
- 단순 정답 확인이 아닌 **AI 해설 중심 구조**
- 취약점 학습의 입문 장벽 낮추기
- 각종 툴 없이도 공격 가능한 실습 제공

### 🎯 목표
- **웹 취약점 학습의 Full Stack Loop 제공**  
  (이론학습 → 실습을 통한 공격 → 방어기법 학습 → 퀴즈 → AI해설 → 복습)
- Security Mindset 습득
- 누구나 빠르게 취약점 이해 가능

---

## 🗓️ 1-4. 개발 일정(WBS)
<img width="1815" height="1029" alt="image" src="https://github.com/user-attachments/assets/710cf6ae-fec5-4fb3-a865-b97511003e6a" />

### 전체 타임라인 (9월~12월)
- **09월:** 기획·구조 설계
- **10월:** 이론학습·실습 환경 구축
- **11월:** 실전문제·커뮤니티 UI 구현
- **12월:** AI 통합 및 최종 발표

---

# 🏛️ 2. 시스템 구조

# 🧰 Tech Stack

## 🎨 Frontend

### 🎛 UI / Styling
<p align="left">
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/TailwindCSS/Typography-06B6D4?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/tw--animate--css-000000?style=for-the-badge"/>
</p>

> 반응형 UI, 컴포넌트 스타일링, Typography, 애니메이션 구성

---

### 🧩 프론트엔드 로직 / 상태 관리
<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/Zustand-4D3832?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/React--Router--DOM-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white"/>
  <img src="https://img.shields.io/badge/React--Hook--Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white"/>
</p>

> SPA 라우팅, 글로벌 상태 관리, 폼 검증 & UI 상태 관리

---

### 📡 통신 / 유틸리티
<p align="left">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/>
  <img src="https://img.shields.io/badge/clsx-000000?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/class--variance--authority-000000?style=for-the-badge"/>
</p>

> API 통신, 조건부 클래스 처리 유틸리티

---

### 🛠 개발 환경 & 빌드
<p align="left">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite%20React%20Plugin-646CFF?style=for-the-badge"/>
</p>

> 번들러, 정적 타입, 린팅, 개발 빌드 환경

---

<br>

## 🖥️ Backend

### 🚀 서버 프레임워크
<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
</p>

> API 서버, 라우팅, 미들웨어 구성

---

### 🔐 인증 / 보안
<p align="left">
  <img src="https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=black"/>
  <img src="https://img.shields.io/badge/Bcrypt-00599C?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Rate--Limit-black?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/CORS-black?style=for-the-badge"/>
</p>

> OAuth 로그인(Google/GitHub), 비밀번호 해시, 요청 제한, CORS 정책

---

### 🗄 데이터베이스 / 파일 저장소
<p align="left">
  <img src="https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white"/>
  <img src="https://img.shields.io/badge/Cloudflare%20R2-F38020?style=for-the-badge&logo=cloudflare&logoColor=white"/>
  <img src="https://img.shields.io/badge/Multer-1A1A1A?style=for-the-badge"/>
</p>

> 문서형 DB, ODM, S3-호환 스토리지, 파일 업로드

---

### 🤖 AI 연동
<p align="left">
  <img src="https://img.shields.io/badge/OpenAI%20SDK-412991?style=for-the-badge&logo=openai&logoColor=white"/>
  <img src="https://img.shields.io/badge/Axios/Fetch-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/>
</p>

> GPT 호출, AI 해설/챗봇 연동

---

### 🛠 서버 인프라 / 배포
<p align="left">
  <img src="https://img.shields.io/badge/AWS--EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"/>
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"/>
  <img src="https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/Nodemailer-219C20?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Dotenv-ECD53F?style=for-the-badge"/>
</p>

> Reverse Proxy, 무중단 배포, 컨테이너 운영, 자동 메일링, 환경 변수 관리

---

<br>

## 🛡️ Security / Labs

### 🧪 취약점 실습 환경
<p align="left">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white"/>
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white"/>
  <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white"/>
</p>

> 취약한 웹서버 제공, 실습 코드 제작, 플래그 검증 환경

---

### 🔍 보안 연구 / 공격·방어 로직 구현
<p align="left">
  <img src="https://img.shields.io/badge/Vulnerable--Labs-Danger?style=for-the-badge&logo=hackaday&logoColor=white"/>
  <img src="https://img.shields.io/badge/Security%20Research-FF0000?style=for-the-badge&logo=protonmail&logoColor=white"/>
</p>

> XSS, SQLi, CSRF 등 공격 로직 및 방어 기법 구현

---

## 🧱 2-2. 세부 아키텍처 다이어그램

<img width="1156" height="867" alt="image" src="https://github.com/user-attachments/assets/9a0ddec8-713a-42bb-849f-cfe3c648831c" />


---

## 📁 2-3. 디렉터리 구조 (Tree)

```
📦 Hack-n-Learn
┣ 📂 backend
┃ ┣ 📂 backup
┃ ┣ 📂 src
┃ ┃ ┣ 📂 config
┃ ┃ ┣ 📂 controllers
┃ ┃ ┣ 📂 cron
┃ ┃ ┣ 📂 middlewares
┃ ┃ ┣ 📂 models
┃ ┃ ┣ 📂 routes
┃ ┃ ┣ 📂 services
┃ ┃ ┣ 📂 socket
┃ ┃ ┣ 📂 utils
┃ ┃ ┣ 📜 app.js
┃ ┃ ┗ 📜 server.js
┃ ┗ 📜 ecosystem.config.js
┃
┣ 📂 Secure
┃ ┣ 📂 CSRF
┃ ┣ 📂 DT_FileUpload
┃ ┣ 📂 SQLi
┃ ┗ 📂 XSS
┃
┗ 📄 README.md
```

---

## 🖥️ 2-4. 서비스 구조
~~각 화면 사진 캡처하기~~

---

## 🗄️ 2-5. 데이터베이스 ERD

아래 ERD는 Hack-n-Learn의 주요 데이터 모델(User, Quiz, Problem, Process, Community 등)의  
관계 구조를 나타낸 것입니다.

<img width="3316" height="2851" alt="hacknlearn drawio" src="https://github.com/user-attachments/assets/c14f9312-e5bc-461c-ab78-ba83d7db2455" />


### 메인 화면

### 📘 이론학습

> 이론 → 실습 → 퀴즈 → AI 해설

### 🧪 실전문제
> 실제 서비스 기반 공격 시나리오 → FLAG 찾기 → AI 해설

### 🏛 커뮤니티
- 보안 뉴스
- 문의게시판
- 자료실 업로드/다운로드

---

# 🔍 3. 주요 기능

## 📘 3-1. 서비스

### ▣ 이론학습

#### 다루는 취약점 7개
- XSS
- Open Redirect
- SQL Injection
- CSRF
- Directory Traversal
- Command Injection
- File Upload

#### 학습 구조
1. 이론
2. 실습 코드(Flask)
3. 퀴즈
4. AI 해설

#### 추가 특징
- 단계별 난이도 상승
- 실습은 로컬에서 직접 구동 방식

---

### ▣ 실전문제
- XSS → 자유게시판에서 script 실행
- SQLi → blind SQLi / 공지사항에 숨겨진 flags 테이블에서 flag 추출
- CSRF → 송금 화면에서 악성코드 실행
- FileUpload → 프로필 사진 업로드 시 사진 이름을 바꿔 악성코드 실행

#### 포함 기능
- AI 자동 해설
- 단계별 문제 구성

---

### ▣ 커뮤니티 기능
- 보안뉴스 자동 크롤링
- 문의게시판
- 자료실

---

## 🤖 3-2. AI 챗봇 / AI 해설

### 제공 기능
- 챗봇
    - 자유 대화 방식으로, 쉽게 궁금증 해결 가능
- 퀴즈 AI 해설
    - 틀린 문제를 기반으로 왜 틀렸는지 이유 설명
- 실습 AI 해설
    - json 로그 기반 자동 분석

---

## 🏆 3-3. 게임화 요소 (Gamification)

- **칭호 시스템**
- **티어 시스템**
- **점수 시스템**
- **랭킹 페이지**
