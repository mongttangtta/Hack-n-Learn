import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Input from '../../components/Input';
import PostCard from '../../components/community/PostCard';
import { useCommunityPage } from '../../components/community/useCommunityPage';

interface NewsItem {
  title: string;
  link: string;
  summary: string;
}

export default function SecurityNews() {
  const context = useCommunityPage();
  const currentPage = context?.currentPage || 1;
  const setTotalPages = context?.setTotalPages;
  const pageSize = 8;

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null); // State for sorting

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/news', {
          params: {
            page: currentPage,
            limit: pageSize,
            ...(sortBy && { sortBy }), // Conditionally add sortBy parameter
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
  }, [currentPage, setTotalPages, pageSize, sortBy]); // Add sortBy to dependencies

  const handlePostClick = (link: string) => {
    window.open(link, '_blank'); // Open the news link in a new tab
  };

  const handleSortByLatest = () => {
    setSortBy('latest'); // Set sortBy to 'latest'
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

      {/* Sort Options */}
      <div className="flex justify-end items-center mb-6">
        <button
          className="flex items-center gap-2 text-primary-text"
          onClick={handleSortByLatest} // Attach onClick handler
        >
          최신순
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {news.map((post) => (
          <PostCard
            key={post.link} // Using link as key, assuming it's unique
            imageUrl="https://placehold.co/288x288" // Placeholder image
            title={post.title}
            date="N/A" // Placeholder date
            onClick={() => handlePostClick(post.link)}
          />
        ))}
      </div>
    </>
  );
}
