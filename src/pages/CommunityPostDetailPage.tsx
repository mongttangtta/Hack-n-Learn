import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NewsArticle from '../components/community/NewsArticle';

interface Post {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  imageUrl: string;
  content: string;
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
          imageUrl:
            fetchedPost.images && fetchedPost.images.length > 0
              ? fetchedPost.images[0]
              : '', // Map first image from 'images' array to 'imageUrl'
          content: fetchedPost.content || '',
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

  return (
    <div className=" text-primary-text min-h-screen">
      <div className=" mx-auto p-8">
        <NewsArticle post={post} />
      </div>
    </div>
  );
}
