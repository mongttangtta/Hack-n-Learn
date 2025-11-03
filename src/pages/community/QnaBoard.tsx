import Button from '../../components/Button';
import Input from '../../components/Input';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    id: 1,
    title: '리액트에서 상태 관리는 어떻게 하는 것이 가장 좋은가요?',
    author: '개발자A',
    date: '2024.07.30',
    views: 128,
  },
  {
    id: 2,
    title: '자바스크립트의 비동기 처리에 대한 질문',
    author: '코린이',
    date: '2024.07.29',
    views: 98,
  },
  {
    id: 3,
    title: 'Tailwind CSS와 Styled-Components 중 어떤 것을 사용해야 할까요?',
    author: '디자이너B',
    date: '2024.07.28',
    views: 256,
  },
  // ... more questions
];

export default function QnaBoard() {
  const navigate = useNavigate();

  const handleRowClick = (id: number) => {
    navigate(`/community/qna/${id}`);
  };

  return (
    <div className="p-8 text-primary-text">
      <div className="p-12 mb-10">
        <div className="w-full ">
          <Input placeholder="궁금한 것을 검색해보세요..." />
        </div>
        <div className="flex justify-end mt-8">
          <Button>질문하기</Button>
        </div>
      </div>
      <table className="w-full text-left mt-10">
        <thead>
          <tr className="border-b-2 border-edge">
            <th className="p-4">번호</th>
            <th className="p-4">제목</th>
            <th className="p-4">작성자</th>
            <th className="p-4">작성일</th>
            <th className="p-4">조회수</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr
              key={q.id}
              className="border-b border-edge hover:bg-card-background cursor-pointer"
              onClick={() => handleRowClick(q.id)}
            >
              <td className="p-4">{q.id}</td>
              <td className="p-4">{q.title}</td>
              <td className="p-4">{q.author}</td>
              <td className="p-4">{q.date}</td>
              <td className="p-4">{q.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
