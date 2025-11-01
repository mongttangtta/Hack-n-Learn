interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i ? 'bg-accent-primary1 text-white' : 'text-primary-text'
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <nav className="flex justify-center items-center gap-4 mt-12 text-primary-text">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="hover:text-accent-primary1 disabled:opacity-50"
      >
        [ &lt;&lt; ]
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="hover:text-accent-primary1 disabled:opacity-50"
      >
        [ &lt; ]
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="hover:text-accent-primary1 disabled:opacity-50"
      >
        [ &gt; ]
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="hover:text-accent-primary1 disabled:opacity-50"
      >
        [ &gt;&gt; ]
      </button>
    </nav>
  );
}
