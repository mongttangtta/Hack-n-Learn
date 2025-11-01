import { useParams } from 'react-router-dom';
import NewsArticle from '../components/community/NewsArticle';
import Button from '../components/Button';

export default function QnaDetailPage() {
  const { id } = useParams();

  // Dummy data for the post
  const post = {
    title: '리액트에서 상태 관리는 어떻게 하는 것이 가장 좋은가요?',
    author: '개발자A',
    date: '2024.07.30',
    views: 128,
    summary: '리액트에서 상태 관리는 어떻게 하는 것이 가장 좋은가요?',
    imageUrl: 'https://placehold.co/1920x421',
    content:
      "[ 문의글 본문 텍스트 내용 ]<br/>... 안녕하세요, 로그인을 시도할 때마다 '비밀번호가 일치하지 않습니다'라는 오류메시지가 계속 뜨고 있습니다. ...",
  };

  const adminAnswer = {
    author: '관리자',
    date: '2024.07.25 16:15',
    content:
      '... 안녕하세요, 문의하신 내용 확인했습니다. ... 본인 인증 후 비밀번호를 재설정 해 주시면 정상적으로 로그인하실 수 있습니다.',
  };

  return (
    <div className=" text-primary-text min-h-screen">
      <div className=" mx-auto p-8">
        <NewsArticle post={post} />
        <hr className="text-edge" />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">관리자 답변</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <span className="font-bold mr-2">{adminAnswer.author}</span>
                <span className="text-sm text-secondary-text">
                  {adminAnswer.date}
                </span>
              </div>
              <p>{adminAnswer.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
