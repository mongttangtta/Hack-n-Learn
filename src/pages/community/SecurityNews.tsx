import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Input from '../../components/Input';
import PostCard from '../../components/community/PostCard';
import { useCommunityPage } from '../../components/community/useCommunityPage';

// Data for the posts - this should ideally come from an API
const posts = [
  // ... (assuming more posts here)
  {
    id: 1,
    imageUrl: 'https://placehold.co/288x288',
    title: '제로데이 취약점, 긴급 패치 권고',
    date: '2024.07.25',
  },
  {
    id: 2,
    imageUrl: 'https://placehold.co/288x288',
    title: '제로데이 취약점, 긴급 패치 권고',
    date: '2024.07.25',
  },
  {
    id: 3,
    imageUrl: 'https://placehold.co/288x288',
    title: '제로데이 취약점, 긴급 패치 권고',
    date: '2024.07.25',
  },
  {
    id: 4,
    imageUrl: 'https://placehold.co/288x288',
    title: '제로데이 취약점, 긴급 패치 권고',
    date: '2024.07.25',
  },
  {
    id: 5,
    imageUrl: 'https://placehold.co/288x288',
    title: '제로데이 취약점, 긴급 패치 권고',
    date: '2024.07.25',
  },
  {
    id: 6,
    imageUrl: 'https://placehold.co/288x288',
    title: '제로데이 취약점, 긴급 패치 권고',
    date: '2024.07.25',
  },
  {
    id: 7,
    imageUrl: 'https://placehold.co/288x288',
    title: '제로데이 취약점, 긴급 패치 권고',
    date: '2024.07.25',
  },
  {
    id: 8,
    imageUrl: 'https://placehold.co/288x288',
    title: '제로데이 취약점, 긴급 패치 권고',
    date: '2024.07.25',
  },
  {
    id: 9,
    imageUrl: 'https://placehold.co/288x288',
    title: '제로데이 취약점, 긴급 패치 권고',
    date: '2024.07.25',
  },
  {
    id: 10,
    imageUrl: 'https://placehold.co/288x288',
    title: '제로데이 취약점, 긴급 패치 권고',
    date: '2024.07.25',
  },
  {
    id: 11,
    imageUrl: 'https://placehold.co/288x288',
    title: '제로데이 취약점, 긴급 패치 권고',
    date: '2024.07.25',
  },
  {
    id: 12,
    imageUrl: 'https://placehold.co/288x288',
    title: '제로데이 취약점, 긴급 패치 권고',
    date: '2024.07.25',
  },
];

export default function SecurityNews() {
  const navigate = useNavigate();
  const context = useCommunityPage();
  const currentPage = context?.currentPage || 1;
  const setTotalPages = context?.setTotalPages;
  const pageSize = 8;

  useEffect(() => {
    if (setTotalPages) {
      setTotalPages(Math.ceil(posts.length / pageSize));
    }
  }, [setTotalPages]);

  const handlePostClick = (postId: number) => {
    navigate(`/community/${postId}`);
  };

  const paginatedPosts = posts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {/* Search Bar */}
      <div className="p-20 mb-10">
        <Input placeholder="재미있는 이슈가 있나요?" />
      </div>

      {/* Sort Options */}
      <div className="flex justify-end items-center mb-6">
        <button className="flex items-center gap-2 text-primary-text">
          조회순
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {paginatedPosts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            onClick={() => handlePostClick(post.id)}
          />
        ))}
      </div>
    </>
  );
}
