import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NewsArticle from '../components/community/NewsArticle';
import Button from '../components/Button';

interface Post {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  imageUrl: string;
  content: string;
  views: number;
}

export default function CommunityPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/news/${id}`);
        // The API response structure for a single item might be slightly different
        // from the list, so we adjust to match the Post interface
        const fetchedPost = response.data.data;
        setPost({
          id: fetchedPost.id,
          title: fetchedPost.title,
          author: fetchedPost.writer || 'Unknown', // Map 'writer' from API to 'author', default to 'Unknown'
          date: fetchedPost.date || '', // Default to empty string if missing
          summary: fetchedPost.summary || '',
          imageUrl: (fetchedPost.images && fetchedPost.images.length > 0) ? fetchedPost.images[0] : '', // Map first image from 'images' array to 'imageUrl'
          content: fetchedPost.content || '',
          views: fetchedPost.views || 0,
        });
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

  if (loading) {
    return <div className="text-center p-20">Loading post...</div>;
  }

  if (error) {
    return <div className="text-center p-20 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center p-20">Post not found.</div>;
  }

  // Dummy data for comments (can be fetched from API later if needed)
  const comments = [
    {
      author: '사용자A',
      date: '2024.07.25 14:30',
      content: '빠른 정보 감사합니다!',
    },
    {
      author: '사용자B',
      date: '2024.07.29 14:30',
      content: '어떤 시스템에 영향을 미치나요?',
    },
  ];

  return (
    <div className=" text-primary-text min-h-screen">
      <div className=" mx-auto p-8">
        <NewsArticle post={post} />
        <hr className="text-edge" />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">댓글</h2>
          <div className=" rounded-lg mb-4">
            <textarea
              className="w-full bg-transparent  text-primary-text"
              placeholder="댓글을 입력하세요..."
            ></textarea>
            <div className="flex justify-end mt-2">
              <Button
                variant="primary"
                className="w-auto h-auto text-white font-bold py-2 px-4 rounded-lg"
              >
                등록
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index}>
                <div className="flex items-center mb-2">
                  <span className="font-bold mr-2">{comment.author}</span>
                  <span className="text-sm text-secondary-text">
                    {comment.date}
                  </span>
                </div>
                <p>{comment.content}</p>
                {index < comments.length - 1 && (
                  <hr className="text-edge my-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
