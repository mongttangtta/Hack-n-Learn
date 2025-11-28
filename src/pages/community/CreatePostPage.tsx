import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuthStore } from '../../store/authStore';

const POST_TYPES = [
  { id: '692212bf9791aa282263d57d', label: '자유' },
  { id: '692212bf9791aa282263d58d', label: '질문' },
  { id: '692212bf9791aa282263d59d', label: '정보' },
];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState(POST_TYPES[1].id); // Default to '질문'
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login'); // Redirect to login page
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div className="text-center p-20">Loading user data...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center p-20">
        You must be logged in to create a post. Redirecting to login...
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/community/posts', {
        title,
        content,
        type,
        nickname: user?.nickname,
      });
      alert('게시글이 성공적으로 작성되었습니다.');
      navigate('/community/qna');
    } catch (err: any) {
      console.error('게시글 작성 실패:', err.response?.data || err.message);
      setError(
        '게시글 작성에 실패했습니다. (' +
          (err.response?.data?.message || 'Server Error') +
          ')'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-primary-text max-w-[1440px] mx-auto">
      <h1 className="text-2xl font-bold mb-6">게시글 작성</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-2">
            게시글 유형
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 bg-input-background border border-edge rounded-[20px] text-primary-text focus:outline-none focus:ring-2 focus:ring-accent-primary1"
          >
            {POST_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            제목
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            required
            className="w-full h-64 p-4 bg-input-background border border-edge rounded-lg text-primary-text focus:outline-none focus:ring-2 focus:ring-accent-primary1 resize-none"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/community/qna')}
            type="button"
          >
            취소
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? '작성 중...' : '작성하기'}
          </Button>
        </div>
      </form>
    </div>
  );
}
