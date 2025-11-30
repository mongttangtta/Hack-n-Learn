interface Post {
  title: string;
  author: string;
  date: string;
  summary: string;
  imageUrl?: string;
  content: string;
}

interface NewsArticleProps {
  post: Post;
}

export default function NewsArticle({ post }: NewsArticleProps) {
  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-secondary-text mb-8">
        <span>작성일: {post.date}</span> | <span>작성자: {post.author}</span>
      </div>
      <div className="mb-8">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-auto rounded-lg"
        />
      </div>
      <div className="mb-8 ">
        <div
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
