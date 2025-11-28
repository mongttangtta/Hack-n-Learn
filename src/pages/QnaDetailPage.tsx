import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button'; // Assuming Button component is needed for delete
import type { Post } from '../types/community'; // Import the shared Post interface
import QnaPost from '@/components/community/qnaPost';
// Import the shared Post interface

export default function QnaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Initialize useNavigate
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/community/posts/${id}`);
        setPost(response.data.data);
      } catch (err) {
        setError('Failed to fetch post.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/community/posts/${id}`);
        alert('게시글이 삭제되었습니다.');
        navigate('/community/qna'); // Navigate back to QnA board
      } catch (err) {
        setError('게시글 삭제에 실패했습니다.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-20">Loading post...</div>;
  }

  if (error) {
    return <div className="text-center p-20 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center p-20">Post not found.</div>;
  }

  // Adapt the fetched post data to the format expected by NewsArticle
  const newsArticlePost = {
    title: post.title,
    author:
      typeof post.author === 'string'
        ? post.author
        : post.author.username ||
          post.author.name ||
          post.author.nickname ||
          'Unknown',
    date: new Date(post.createdAt).toLocaleDateString(),
    summary: '', // Post interface from community.ts does not have summary
    content: post.content,
    views: post.views,
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
        <QnaPost post={newsArticlePost} />

        <div className="flex justify-end mt-4 space-x-2">
          <Button
            variant="secondary" // Assuming a 'secondary' variant for edit button
            onClick={() => navigate(`/community/qna/${id}/edit`)}
            className="w-auto px-4 py-2 font-bold rounded-lg"
          >
            수정
          </Button>
          <Button
            variant="danger" // Assuming a 'danger' variant for delete button
            onClick={handleDelete}
            className="w-auto px-4 py-2 text-white font-bold rounded-lg"
          >
            삭제
          </Button>
        </div>

        <hr className="text-edge mt-4" />

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
