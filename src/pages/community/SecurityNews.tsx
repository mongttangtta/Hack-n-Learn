import { ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import PostCard from '../../components/community/PostCard';
import { useCommunityPage } from '../../components/community/useCommunityPage';

interface NewsItem {
  id: string;
  title: string;
  link: string;
  summary: string;
  image: string;
  date: string; // API에서 넘어오는 날짜 필드 (예: '2025-11-27T...')
}

export default function SecurityNews() {
  const navigate = useNavigate();
  const context = useCommunityPage();
  const currentPage = context?.currentPage || 1;
  const setTotalPages = context?.setTotalPages;
  const pageSize = 8;

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 드롭다운 메뉴 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 뉴스 데이터 가져오기
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/news', {
          params: {
            page: currentPage,
            limit: pageSize,
          },
        });

        setNews(response.data.data.items);
        if (setTotalPages) {
          setTotalPages(Math.ceil(response.data.data.total / pageSize));
        }
      } catch (err) {
        setError('Failed to fetch news.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, setTotalPages, pageSize]); // sortBy 변경 시 재요청

  const handlePostClick = (id: string) => {
    navigate(`/community/${id}`);
  };

  if (loading) {
    return <div className="text-center p-20">Loading news...</div>;
  }

  if (error) {
    return <div className="text-center p-20 text-red-500">{error}</div>;
  }

  return (
    <>
      {/* Search Bar */}
      <div className="p-20 mb-10">
        <Input placeholder="재미있는 이슈가 있나요?" />
      </div>

      {/* Sort Options (Dropdown) */}
      <div
        className="flex justify-end items-center mb-6 relative"
        ref={dropdownRef}
      >
        <button
          className="flex items-center gap-2 text-primary-text px-4 py-2 hover:bg-card-background rounded-md transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {news.map((post) => (
            <PostCard
              key={post.id}
              imageUrl={post.image}
              title={post.title}
              date={post.date} // 날짜 포맷팅 적용
              onClick={() => handlePostClick(post.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
