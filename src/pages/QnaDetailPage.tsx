import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import type { Post, Comment, PostAuthor } from '../types/community';
import QnaPost from '@/components/community/qnaPost';
import { communityService } from '../services/communityService';
import { useAuthStore } from '@/store/authStore';

const CommentItem = ({
  comment,
  postId,
  onReplySuccess,
  depth = 0,
}: {
  comment: Comment;
  postId: string;
  onReplySuccess: () => void;
  depth?: number;
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);
  const [submitting, setSubmitting] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      await communityService.addReply(postId, comment._id, {
        content: replyContent,
      });
      setIsReplying(false);
      setReplyContent('');
      onReplySuccess();
    } catch (err) {
      console.error('Failed to submit reply:', err);
      alert('답글 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    setSubmitting(true);
    try {
      await communityService.updateComment(comment._id, {
        content: editContent,
      });
      setIsEditing(false);
      onReplySuccess();
    } catch (err) {
      console.error('Failed to update comment:', err);
      alert('댓글 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await communityService.deleteComment(comment._id);
        onReplySuccess();
      } catch (err) {
        console.error('Failed to delete comment:', err);
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  const renderAuthor = (author: PostAuthor) => {
    return author.nickname || 'Unknown';
  };

  return (
    <div
      className={`mt-4 ${
        depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-700' : ''
      }`}
    >
      <div className="flex items-center mb-2 justify-between">
        <div className="flex items-center">
          <span className="font-bold mr-2 text-primary-text">
            {renderAuthor(comment.author)}
          </span>
          <span className="text-sm text-secondary-text">
            {new Date(comment.createdAt).toLocaleString()}
            {comment.createdAt !== comment.updatedAt && (
              <span className="ml-2">
                (수정됨: {new Date(comment.updatedAt).toLocaleString()})
              </span>
            )}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setIsReplying(false);
              setEditContent(comment.content);
            }}
            className="text-sm text-gray-400 hover:underline font-medium"
          >
            {isEditing ? '취소' : '수정'}
          </button>
          {depth < 1 && (
            <button
              onClick={() => {
                setIsReplying(!isReplying);
                setIsEditing(false);
              }}
              className="text-sm text-blue-400 hover:underline font-medium"
            >
              {isReplying ? '취소' : '답글'}
            </button>
          )}
          <button
            onClick={handleDeleteComment}
            className="text-sm text-red-400 hover:underline font-medium"
          >
            삭제
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="mt-2 mb-2">
          <textarea
            className="w-full bg-transparent text-primary-text border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={2}
            disabled={submitting}
          />
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-auto h-auto px-4 py-2 text-sm"
              disabled={submitting || !editContent.trim()}
            >
              {submitting ? '수정 중...' : '수정 완료'}
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-primary-text mb-2 whitespace-pre-wrap">
          {comment.content}
        </p>
      )}

      {isReplying && (
        <form onSubmit={handleReplySubmit} className="mt-2 mb-4 pl-2">
          <textarea
            className="w-full bg-transparent text-primary-text border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="답글을 입력하세요..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={2}
            disabled={submitting}
          />
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-auto h-auto px-4 py-2 text-sm"
              disabled={submitting || !replyContent.trim()}
            >
              {submitting ? '등록 중...' : '답글 등록'}
            </Button>
          </div>
        </form>
      )}

      {comment.replies &&
        comment.replies.map((reply) => (
          <CommentItem
            key={reply._id}
            comment={reply}
            postId={postId}
            onReplySuccess={onReplySuccess}
            depth={depth + 1}
          />
        ))}
    </div>
  );
};

export default function QnaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const fetchComments = useCallback(async () => {
    if (!id) return;
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const commentsResponse = await axios.get(
        `/api/community/posts/${id}/comments`
      );
      setComments(commentsResponse.data.data || []);
    } catch (err) {
      setCommentsError('Failed to fetch comments.');
      console.error(err);
    } finally {
      setCommentsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);
      setError(null);
      setCommentsError(null);

      try {
        const postResponse = await axios.get(`/api/community/posts/${id}`);
        setPost(postResponse.data.data);
        await fetchComments();
      } catch (err) {
        setError('Failed to fetch post or comments.');
        setCommentsError('Failed to fetch comments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostAndComments();
    }
  }, [id, fetchComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await communityService.addComment(id, { content: newComment });
      setNewComment('');
      await fetchComments();
    } catch (err) {
      console.error('Failed to submit comment:', err);
      alert('댓글 등록에 실패했습니다.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/community/posts/${id}`);
        alert('게시글이 삭제되었습니다.');
        navigate('/community/qna');
      } catch (err) {
        setError('게시글 삭제에 실패했습니다.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-20">Loading post and comments...</div>;
  }

  if (error) {
    return <div className="text-center p-20 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center p-20">Post not found.</div>;
  }

  const qnaPostProps = {
    title: post.title,
    author:
      typeof post.author === 'string'
        ? post.author
        : post.author.nickname || 'Unknown',
    date: new Date(post.createdAt).toLocaleString(),
    summary: '',
    imageUrl: '',
    content: post.content,
    views: post.views,
    updatedAt: post.updatedAt,
  };

  return (
    <div className="text-primary-text min-h-screen">
      <div className="mx-auto p-8">
        <QnaPost post={qnaPostProps} />

        <div className="flex justify-end mt-4 space-x-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/community/qna/${id}/edit`)}
            className="w-auto px-4 rounded-lg"
          >
            수정
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            className="w-auto px-4 rounded-lg"
          >
            삭제
          </Button>
        </div>

        <hr className="text-edge mt-4" />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">댓글</h2>
          <form onSubmit={handleCommentSubmit} className="rounded-lg mb-4">
            <textarea
              className="w-full bg-transparent text-primary-text rounded-lg p-2 focus:outline-none focus:ring focus:ring-accent-primary1"
              placeholder={
                isAuthenticated
                  ? '댓글을 입력하세요...'
                  : '로그인하여 댓글을 작성하세요.'
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              disabled={submittingComment || !isAuthenticated}
            ></textarea>
            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-auto h-auto py-2 px-4 rounded-lg"
                disabled={
                  submittingComment || !newComment.trim() || !isAuthenticated
                }
              >
                {submittingComment ? '등록 중...' : '등록'}
              </Button>
            </div>
          </form>

          {commentsLoading ? (
            <div className="text-center p-20">댓글 불러오는 중...</div>
          ) : commentsError ? (
            <div className="text-center p-20 text-red-500">{commentsError}</div>
          ) : comments.length === 0 ? (
            <div className="text-center p-20">아직 댓글이 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id}>
                  <CommentItem
                    comment={comment}
                    postId={id!}
                    onReplySuccess={fetchComments}
                  />
                  <hr className="text-edge my-4 opacity-50" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
