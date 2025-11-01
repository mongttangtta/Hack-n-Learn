
# init_db.py
import sqlite3, os

DB = "vuln_bank.db"

def init():
    # 기존 DB 삭제 후 재생성 (교육용)
    if os.path.exists(DB):
        os.remove(DB)

    conn = sqlite3.connect(DB)
    c = conn.cursor()

    # users
    c.execute('''
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        display_name TEXT,
        balance INTEGER
    )
    ''')

    # flags: 플래그는 오직 여기만 저장
    c.execute('''
    CREATE TABLE flags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        flag TEXT
    )
    ''')

    # posts: 게시판 (board: 'notice' 또는 'free')
    c.execute('''
    CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        board TEXT,
        title TEXT,
        author TEXT,
        content TEXT
    )
    ''')

    # 샘플 사용자
    users = [
        ('admin','admin123','Administrator',100000),
        ('alice','alice123','Alice',5000),
        ('bob','bob123','Bob',3000),
    ]
    for u in users:
        c.execute("INSERT INTO users (username,password,display_name,balance) VALUES (?,?,?,?)", u)

    # 실제 FLAG는 오직 flags 테이블에만 저장
    FLAG = "FLAG{CAUGHT_YOU_BUDDY}"
    c.execute("INSERT INTO flags (flag) VALUES (?)", (FLAG,))

    # 공지사항/자유게시판 글들 (플래그 관련 텍스트는 절대 넣지 않음)
    notices = [
        ("notice", "서버 이용 안내", "관리자", "이 서버는 교육용 실습 환경입니다. 외부에 공개하지 마세요."),
        ("notice", "DB 초기화 방법", "관리자", "`python init_db.py` 명령으로 초기화할 수 있습니다."),
        ("notice", "중요: 운영시간 안내", "관리자", "운영시간은 평일 09:00 - 18:00 입니다. 문의는 내부 이메일로 주세요."),
        ("notice", "시스템 점검 내역(예시)", "관리자", "2025-10-15 02:34 시스템 점검이 완료되었습니다. 점검 기록은 별도 보관됩니다.")
    ]
    frees = [
        ("free", "오늘 실습 재밌네요!", "alice", "SQL Injection 구조를 직접 보니까 이해가 잘 돼요."),
        ("free", "XSS는 다음 주에 실습하나요?", "bob", "Cross Site Scripting도 기대돼요."),
        ("free", "로그인 성공했어요", "alice", "계좌 확인 기능까지 잘 됩니다."),
        ("free", "버그 제보", "bob", "홈 화면에서 간혹 스타일이 깨지는 문제 발견했습니다.")
    ]
    for p in notices + frees:
        c.execute("INSERT INTO posts (board, title, author, content) VALUES (?,?,?,?)", p)

    conn.commit()
    conn.close()
    print("DB initialized:", DB)
    print("FLAG stored in flags table (NOT in posts).")

if __name__ == "__main__":
    init()

