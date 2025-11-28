import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCommunityPage } from '../../components/community/useCommunityPage';
import type { Post } from '../../types/community';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function QnaBoard() {
  const navigate = useNavigate();
  const context = useCommunityPage();
  const currentPage = context?.currentPage || 1;
  const setTotalPages = context?.setTotalPages;
  const pageSize = 10; // Assuming a default page size for QnA board
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'views'>('latest');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/community/posts', {
          params: {
            page: currentPage,
            limit: pageSize,
            sort: sortBy,
          },
        });
        setPosts(response.data.data.items);
        setTotalCount(response.data.data.total);
        console.log(response.data.data.items);
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
  }, [currentPage, setTotalPages, pageSize, sortBy]);

  const handleRowClick = (id: string) => {
    navigate(`/community/qna/${id}`);
  };
  if (loading) {
    return <div className="text-center p-20">Loading posts...</div>;
  }
  if (error) {
    return <div className="text-center p-20 text-red-500">{error}</div>;
  }
  const renderAuthor = (author: Post['author']) => {
    if (typeof author === 'string') return author;

    return author.username || 'Unknown'; // Simplified, assuming username is primary for display
  };

  return (
    <div className="p-8 text-primary-text">
      <div className="p-12 mb-10">
        <div className="w-full ">
          <Input placeholder="궁금한 것을 검색해보세요..." />
        </div>
        <div className="flex justify-between items-end mt-8">
          <div className="flex space-x-2 mb-2">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'latest'
                  ? 'bg-accent-primary1 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortBy('views')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'views'
                  ? 'bg-accent-primary1 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              조회순
            </button>
          </div>

          <Button onClick={() => navigate('/community/qna/create')}>
            질문하기
          </Button>
        </div>
      </div>

      <table className="w-full text-left mt-10">
        <thead>
          <tr className="border-b-2 border-edge">
            <th className="p-4">번호</th>
            <th className="p-4">제목</th>
            <th className="p-4">작성자</th>
            <th className="p-4">작성일</th>
            <th className="p-4">수정일</th>
            <th className="p-4">조회수</th>
          </tr>
        </thead>

        <tbody>
          {posts.map((post, index) => (
            <tr
              key={post._id}
              className="border-b border-edge hover:bg-card-background cursor-pointer"
              onClick={() => handleRowClick(post._id)}
            >
              <td className="p-4">
                {totalCount - ((currentPage - 1) * pageSize + index)}
              </td>
              <td className="p-4">{post.title}</td>
              <td className="p-4">{renderAuthor(post.author)}</td>
              <td className="p-4">
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4">
                {new Date(post.updatedAt).toLocaleDateString()}
              </td>
              <td className="p-4">{post.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
