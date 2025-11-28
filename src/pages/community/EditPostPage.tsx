import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuthStore } from '../../store/authStore';
import type { Post } from '../../types/community';

const POST_TYPES = [
  { id: '692212bf9791aa282263d57d', label: '자유' },
  { id: '692212bf9791aa282263d58d', label: '질문' },
  { id: '692212bf9791aa282263d59d', label: '정보' },
];

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState(POST_TYPES[1].id); // Default to '질문'
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // For form submission
  const [fetchLoading, setFetchLoading] = useState(true); // For initial data fetch
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setFetchError('Post ID is missing.');
        setFetchLoading(false);
        return;
      }
      try {
        const response = await axios.get(`/api/community/posts/${id}`);
        const fetchedPost: Post = response.data.data;
        setTitle(fetchedPost.title);
        setContent(fetchedPost.content);
        setType(fetchedPost.type._id); // Assuming type is an object with _id
      } catch (err) {
        setFetchError('게시글 정보를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!id) {
      setError('Post ID is missing for update.');
      setLoading(false);
      return;
    }

    try {
      await axios.put(`/api/community/posts/${id}`, {
        title,
        content,
        type,
        nickname: user?.nickname,
      });
      alert('게시글이 성공적으로 수정되었습니다.');
      navigate(`/community/qna/${id}`);
    } catch (err: any) {
      console.error('게시글 수정 실패:', err.response?.data || err.message);
      setError(
        '게시글 수정에 실패했습니다. (' +
          (err.response?.data?.message || 'Server Error') +
          ')'
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center p-20">게시글 정보를 불러오는 중...</div>;
  }

  if (fetchError) {
    return <div className="text-center p-20 text-red-500">{fetchError}</div>;
  }

  return (
    <div className="p-8 text-primary-text max-w-[1440px] mx-auto">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
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
            onClick={() => navigate(`/community/qna/${id}`)}
            type="button"
          >
            취소
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? '수정 중...' : '수정하기'}
          </Button>
        </div>
      </form>
    </div>
  );
}
