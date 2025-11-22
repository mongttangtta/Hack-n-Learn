# init_db.py (CSRF 실습 전용)
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

    # 샘플 사용자 (app.py와 동일하게 맞춤)
    users = [
        ('admin','admin123','Administrator',100000),
        ('alice','alice123','Alice',5000),
        ('bob','bob123','Bob',2000),
    ]
    for u in users:
        c.execute(
            "INSERT INTO users (username,password,display_name,balance) VALUES (?,?,?,?)",
            u
        )

    # 🔐 CSRF 전용 FLAG (오직 flags 테이블에만 저장)
    FLAG = "Base64(RkxBR3tDU1JGX0FUVEFDS19TVUNDRVNTfQ)"
    c.execute("INSERT INTO flags (flag) VALUES (?)", (FLAG,))

    # 공지사항/자유게시판 글들 (플래그 관련 텍스트는 절대 넣지 않음)
    notices = [
        ("notice", "서버 이용 안내", "관리자",
         "이 서버는 교육용 실습 환경입니다. 외부에 공개하지 마세요."),
        ("notice", "보안 안내", "관리자",
         "의심스러운 링크나 첨부파일은 열지 마세요."),
        ("notice", "영업시간 안내", "관리자",
         "창구 영업시간은 평일 09:00 - 17:30 입니다."),
        ("notice", "시스템 점검 내역(예시)", "관리자",
         "정기 점검이 정상적으로 완료되었습니다. 기록은 내부 시스템에 보관됩니다.")
    ]
    frees = [
        ("free", "오늘 실습 재밌네요!", "alice",
         "계좌 송금 화면이 실제 인터넷뱅킹 같아요."),
        ("free", "송금 기능 테스트", "bob",
         "테스트 송금 했는데 잔액이 잘 반영됩니다."),
        ("free", "로그인 성공했어요", "alice",
         "홈 화면에서 내 계좌 잔액까지 확인했습니다."),
        ("free", "버그 제보", "bob",
         "가끔 모바일 화면에서 버튼 정렬이 깨지는 것 같아요.")
    ]
    for p in notices + frees:
        c.execute(
            "INSERT INTO posts (board, title, author, content) VALUES (?,?,?,?)",
            p
        )

    conn.commit()
    conn.close()
    print("DB initialized:", DB)
    print("CSRF FLAG stored in flags table (NOT in posts).")

if __name__ == "__main__":
    init()

