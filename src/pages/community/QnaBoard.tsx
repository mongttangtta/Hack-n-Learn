import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCommunityPage } from '../../components/community/useCommunityPage';
import type { Post } from '../../types/community';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { communityService } from '../../services/communityService';

const POST_TYPES = [
  { id: 'all', label: '전체' },
  { id: '692212bf9791aa282263d57c', label: '공지사항' },
  { id: '692212bf9791aa282263d57d', label: '질문' },
  { id: '692212bf9791aa282263d57e', label: '정보공유' },
  { id: '692212bf9791aa282263d57f', label: '팁과 노하우' },
  { id: '692212bf9791aa282263d580', label: '자유게시판' },
  { id: '692212bf9791aa282263d581', label: '에러/버그 신고' },
];

export default function QnaBoard() {
  const navigate = useNavigate();
  const context = useCommunityPage();
  const currentPage = context?.currentPage || 1;
  const setTotalPages = context?.setTotalPages;
  const handlePageChange = context?.handlePageChange;
  const pageSize = 10; // Assuming a default page size for QnA board
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [viewedPosts, setViewedPosts] = useState<Record<string, boolean>>({});
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {
          page: currentPage,
          limit: pageSize,
          keyword: searchQuery,
        };
        if (selectedType !== 'all') {
          params.type = selectedType;
        }

        const response = await axios.get('/api/community/posts', {
          params,
        });
        const fetchedPosts: Post[] = response.data.data.items;
        setPosts(fetchedPosts);
        setTotalCount(response.data.data.total);
        console.log(response.data.data);

        if (setTotalPages) {
          setTotalPages(Math.ceil(response.data.data.total / pageSize));
        }

        // Fetch viewed status for each post
        const viewedStatusPromises = fetchedPosts.map(async (post) => {
          const viewed = await communityService.checkPostViewed(post._id);
          return { postId: post._id, viewed };
        });

        const statuses = await Promise.all(viewedStatusPromises);
        const newViewedPosts = statuses.reduce((acc, { postId, viewed }) => {
          acc[postId] = viewed;
          return acc;
        }, {} as Record<string, boolean>);
        setViewedPosts(newViewedPosts);
      } catch (err) {
        setError('Failed to fetch posts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, setTotalPages, pageSize, searchQuery, selectedType]);

  const handleRowClick = (id: string) => {
    navigate(`/community/qna/${id}`);
  };

  const handleSearch = () => {
    setSearchQuery(inputValue);
    if (handlePageChange) {
      handlePageChange(1);
    }
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    if (handlePageChange) {
      handlePageChange(1);
    }
  };

  if (loading) {
    return <div className="text-center p-20">Loading posts...</div>;
  }
  if (error) {
    return <div className="text-center p-20 text-red-500">{error}</div>;
  }
  const renderAuthor = (post: Post) => {
    if (post.author && post.author.nickname) {
      return post.author.nickname;
    }
    return post.nickname || 'Unknown';
  };

  return (
    <div className="p-8 text-primary-text">
      <div className="p-12 mb-10">
        <div className="w-full ">
          <Input
            placeholder="궁금한 것을 검색해보세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>

        <div className="flex justify-between items-end mt-8">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {POST_TYPES.map((type) => (
                <Button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`rounded-lg w-full h-full px-3 py-1 transition-colors whitespace-nowrap ${
                    selectedType === type.id
                      ? 'bg-accent-primary1 '
                      : 'bg-card-background text-primary-text hover:bg-edge'
                  }`}
                >
                  {type.label}
                </Button>
              ))}
            </div>
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
            <th className="p-4">카테고리</th>
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
              <td className="p-4">{post.type?.name || '일반'}</td>
              <td
                className={`p-4 ${
                  viewedPosts[post._id]
                    ? 'text-secondary-text'
                    : 'text-primary-text'
                }`}
              >
                {post.title}
              </td>
              <td className="p-4">{renderAuthor(post)}</td>
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
