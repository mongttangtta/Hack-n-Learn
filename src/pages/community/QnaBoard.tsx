import Button from '../../components/Button';
import Input from '../../components/Input';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCommunityPage } from '../../components/community/useCommunityPage';

interface PostItem {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
}

export default function QnaBoard() {
  const navigate = useNavigate();
  const context = useCommunityPage();
  const currentPage = context?.currentPage || 1;
  const setTotalPages = context?.setTotalPages;
  const pageSize = 10; // Assuming a default page size for QnA board

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/community/posts', {
          params: {
            page: currentPage,
            limit: pageSize,
          },
        });
        setPosts(response.data.data.items);
        if (setTotalPages) {
          setTotalPages(Math.ceil(response.data.data.total / pageSize));
        }
      } catch (err) {
        setError('Failed to fetch posts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, setTotalPages, pageSize]);

  const handleRowClick = (id: number) => {
    navigate(`/community/qna/${id}`);
  };

  if (loading) {
    return <div className="text-center p-20">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center p-20 text-red-500">{error}</div>;
  }

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
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-b border-edge hover:bg-card-background cursor-pointer"
              onClick={() => handleRowClick(post.id)}
            >
              <td className="p-4">{post.id}</td>
              <td className="p-4">{post.title}</td>
              <td className="p-4">{post.author}</td>
              <td className="p-4">{post.date}</td>
              <td className="p-4">{post.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
