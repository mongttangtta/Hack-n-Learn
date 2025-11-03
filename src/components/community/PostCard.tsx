interface PostCardProps {
  imageUrl: string;
  title: string;
  date: string;
  onClick: () => void;
}

export default function PostCard({ imageUrl, title, date, onClick }: PostCardProps) {
  return (
    <article
      onClick={onClick}
      className="bg-card-background border-2 border-edge rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:border-accent-primary2 cursor-pointer"
    >
      <img className="w-full h-56 object-cover" src={imageUrl} alt={title} />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-text mb-2 h-14">
          {title}
        </h3>
        <p className="text-sm text-secondary-text">{date}</p>
      </div>
    </article>
  );
}
