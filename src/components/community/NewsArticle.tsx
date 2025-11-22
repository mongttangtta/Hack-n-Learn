interface Post {
  title: string;
  author: string;
  date: string;
  views: number;
  summary: string;
  imageUrl: string;
  content: string;
}

interface NewsArticleProps {
  post: Post;
}

export default function NewsArticle({ post }: NewsArticleProps) {
  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-secondary-text mb-4">
        <span>작성일: {post.date}</span> | <span>작성자: {post.author}</span> |{' '}
        <span>조회수: {post.views}</span>
      </div>
      <div className="mb-8 flex items-center">
        <div className="w-1.5 h-10 bg-accent-primary1 mr-4"></div>
        <p>{post.summary}</p>
      </div>
      <div className="mb-8">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-auto rounded-lg"
        />
      </div>
      <div className="mb-8">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
}
