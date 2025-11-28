interface Post {
  title: string;
  author: string;
  date: string;
  summary: string;
  imageUrl?: string;
  content: string;
  views: number;
  updatedAt?: string; // New property for modification time
}

interface NewsArticleProps {
  post: Post;
}

export default function QnaPost({ post }: NewsArticleProps) {
  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-secondary-text mb-8">
        <span>작성일: {post.date}</span>
        <span> | 작성자: {post.author}</span> |{' '}
        <span>조회수: {post.views}</span>
        {post.updatedAt &&
          new Date(post.updatedAt).toLocaleString() !== post.date && (
            <div>(수정됨: {new Date(post.updatedAt).toLocaleString()})</div>
          )}
      </div>
      <div className="mb-8 ">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
}
