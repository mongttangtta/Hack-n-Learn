import { useParams } from 'react-router-dom';
import NewsArticle from '../components/community/NewsArticle';
import Button from '../components/Button';

export default function CommunityPostDetailPage() {
  const { id } = useParams();

  // Dummy data for the post
  const post = {
    title: '제로데이 취약점, 긴급 패치 권고',
    author: '관리자',
    date: '2024.07.25',
    views: 1234,
    summary: '최근 발견된 제로데이 취약점에 대한 긴급 패치가 필요합니다.',
    imageUrl: 'https://placehold.co/1920x421',
    content:
      '[ 뉴스 본문 텍스트 내용 ]<br />... 최근 발견된 제로데이 취약점에 대한 긴급 패치가 필요합니다.<br />',
  };

  const comments = [
    {
      author: '사용자A',
      date: '2024.07.25 14:30',
      content: '빠른 정보 감사합니다!',
    },
    {
      author: '사용자B',
      date: '2024.07.29 14:30',
      content: '어떤 시스템에 영향을 미치나요?',
    },
  ];

  return (
    <div className=" text-primary-text min-h-screen">
      <div className=" mx-auto p-8">
        <NewsArticle post={post} />
        <hr className="text-edge" />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">댓글</h2>
          <div className=" rounded-lg mb-4">
            <textarea
              className="w-full bg-transparent  text-primary-text"
              placeholder="댓글을 입력하세요..."
            ></textarea>
            <div className="flex justify-end mt-2">
              <Button
                variant="primary"
                className="w-auto h-auto text-white font-bold py-2 px-4 rounded-lg"
              >
                등록
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index}>
                <div className="flex items-center mb-2">
                  <span className="font-bold mr-2">{comment.author}</span>
                  <span className="text-sm text-secondary-text">
                    {comment.date}
                  </span>
                </div>
                <p>{comment.content}</p>
                {index < comments.length - 1 && <hr className="text-edge my-4" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}