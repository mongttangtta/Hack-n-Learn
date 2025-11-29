import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import heroimg from '../assets/images/community2.jpg';
import HeroSection from '../components/HeroSection';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import { fetchRankings, fetchMyRanking } from '../services/rankingService';
import type { RankingUser } from '../types/ranking';
import Button from '@/components/Button';

const getTierBadge = (tier: string) => {
  const commonProps = { className: 'w-5 h-5 ml-1' }; // Added ml-1 for spacing
  switch (tier.toLowerCase()) {
    case 'bronze':
      return (
        <Award
          {...commonProps}
          className={`${commonProps.className} text-award-bronze`}
        />
      );
    case 'silver':
      return (
        <Award
          {...commonProps}
          className={`${commonProps.className} text-award-silver`}
        />
      );
    case 'gold':
      return (
        <Award
          {...commonProps}
          className={`${commonProps.className} text-award-gold`}
        />
      );
    case 'platinum':
      return (
        <Award
          {...commonProps}
          className={`${commonProps.className} text-award-platinum`}
        />
      );
    case 'diamond':
      return (
        <Award
          {...commonProps}
          className={`${commonProps.className} text-award-diamond`}
        />
      );
    default:
      return null;
  }
};

const RankingPage: React.FC = () => {
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [myRanking, setMyRanking] = useState<RankingUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 10;

  useEffect(() => {
    const loadRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        const [listResponse, myRankingResult] = await Promise.allSettled([
          fetchRankings(currentPage, limit),
          fetchMyRanking(),
        ]);

        // Handle List Response
        if (listResponse.status === 'fulfilled') {
          if (listResponse.value.success) {
            setRankings(listResponse.value.data.users);
            setTotalPages(listResponse.value.data.totalPages);
          } else {
            setError('Failed to fetch rankings.');
          }
        } else {
          setError('Failed to fetch rankings.');
          console.error(listResponse.reason);
        }

        // Handle My Ranking Response (Optional, strictly speaking, as user might not be logged in)
        if (myRankingResult.status === 'fulfilled') {
          setMyRanking(myRankingResult.value);
        } else {
          console.warn(
            'Could not fetch my ranking (user might be logged out):',
            myRankingResult.reason
          );
          // Do not set global error here, as viewing the list is still possible
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen  text-primary-text flex items-center justify-center">
        <h1 className="text-4xl font-bold">Loading Rankings...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  text-red-500 flex items-center justify-center">
        <h1 className="text-4xl font-bold">{error}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen mb-20  text-primary-text">
      <HeroSection imageUrl={heroimg} title="랭킹" />
      <div className="max-w-[1440px] px-10 mx-auto">
        <div className="flex justify-between items-center my-10">
          <h1 className="text-h2 font-bold">전체 랭킹</h1>
          {myRanking && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-accent-primary1 py-2 px-4 rounded-lg"
            >
              내 랭킹 보기
            </Button>
          )}
        </div>

        <div className=" mx-auto bg-card-background border-2 border-edge rounded-lg shadow-lg p-6">
          {rankings.length === 0 ? (
            <p className="text-center text-lg">랭킹 데이터가 없습니다.</p>
          ) : (
            <>
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-edge">
                    <th className="py-3 px-4 text-lg font-semibold w-[15%]">
                      순위
                    </th>
                    <th className="py-3 px-4 text-lg font-semibold w-[35%]">
                      사용자명
                    </th>
                    <th className="py-3 px-4 text-lg font-semibold w-[25%]">
                      티어
                    </th>
                    <th className="py-3 px-4 text-lg font-semibold w-[25%]">
                      점수
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((item) => (
                    <tr
                      key={item.rank}
                      className={`border-b border-edge last:border-b-0 ${
                        myRanking && myRanking.rank === item.rank
                          ? 'bg-gray-800/50'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-4">{item.rank}</td>
                      <td className="py-3 px-4">{item.nickname}</td>
                      <td className="py-3 px-4 flex items-center">
                        {item.tier} {getTierBadge(item.tier)}
                      </td>
                      <td className="py-3 px-4">{item.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>

      {/* My Ranking Modal */}
      {myRanking && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="내 랭킹 정보"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-edge pb-2">
              <span className="text-secondary-text font-medium">순위</span>
              <span className="text-xl font-bold text-accent-primary1">
                #{myRanking.rank}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-edge pb-2">
              <span className="text-secondary-text font-medium">사용자명</span>
              <span className="text-lg font-semibold">
                {myRanking.nickname}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-edge pb-2">
              <span className="text-secondary-text font-medium">티어</span>
              <span className="flex items-center text-lg font-semibold capitalize">
                {myRanking.tier} {getTierBadge(myRanking.tier)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-secondary-text font-medium">점수</span>
              <span className="text-lg font-bold">{myRanking.points} 점</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RankingPage;
