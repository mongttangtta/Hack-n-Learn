# init_db.py (Directory Traversal + File Upload 실습 전용)
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

    # 🔐 CSRF + File Upload 실습용 FLAG
    FLAG = "FLAG{profile_upload_traversal_success}"
    c.execute("INSERT INTO flags (flag) VALUES (?)", (FLAG,))

    # 공지사항/자유게시판 글들 (플래그 관련 텍스트는 절대 넣지 않음)
    notices = [
        ("notice", "업데이트 안내", "관리자",
         "프로필 사진 기능이 업데이트 되었습니다. 이용해보시고 불편하신 사항은 고객센터로 문의주세요."),
        ("notice", "보안사고 대응 안내", "관리자",
         "최근 HallymBank에서 보안사고가 터져 중요한 문서는 private 폴더로 이동되었습니다. 불편을 겪으신 고객분들 모두 죄송합니다."),
        ("notice", "서버 이용 안내", "관리자",
         "이 서버는 교육용 실습 환경입니다. 외부에 공개하지 마세요."),
        ("notice", "보안 안내", "관리자",
         "의심스러운 링크나 첨부파일은 열지 마세요."),
    ]

    frees = [
        ("free", "프로필기능 업데이트?????", "alice",
         "개발자님 느낌 있으시네요.. 점점 사이트가 진화하는 느낌 아주 좋아요 "),
        ("free", "프로필에 취약점있음", "bob",
         "아ㅋㅋ 프로필 사진 업로드에 File Upload 취약점 있는거 찾았다ㅋㅋ private 폴더 안에 볼 수 있음ㅋㅋ"),
        ("free", "월급...", "alice",
         "왜 내 월급만 동결이지...? 물가는 오르는데... 뭐먹고 살으라고..."),
        ("free", "프로필 업데이트", "bob",
         "프로필기능 업데이트 된거 취약점 있나 체크해볼게요~ 아, 벤더에 이미 말씀드렸으니까 여러분도 해보고싶으시면 말씀드려보세요!!")
    ]

    for p in notices + frees:
        c.execute(
            "INSERT INTO posts (board, title, author, content) VALUES (?,?,?,?)",
            p
        )

    conn.commit()
    conn.close()
    print("DB initialized:", DB)
    print("FLAG stored in flags table.")

if __name__ == "__main__":
    init()

