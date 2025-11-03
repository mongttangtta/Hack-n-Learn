import { useOutletContext } from 'react-router-dom';

export function useCommunityPage() {
  return useOutletContext<{
    currentPage: number;
    handlePageChange: (page: number) => void;
    setTotalPages: (pages: number) => void;
  }>();
}
