import React, { useEffect, useState } from 'react';
import { Award, Trophy, Medal, Crown, X } from 'lucide-react'; // 아이콘 추가
import heroimg from '../assets/images/community2.jpg';
import HeroSection from '../components/HeroSection';
import Pagination from '../components/Pagination';
import { fetchRankings, fetchMyRanking } from '../services/rankingService';
import type { RankingUser } from '../types/ranking';
import Button from '@/components/Button';
import TiltedCard from '../components/TiltedCard'; // TiltedCard import
import { twMerge } from 'tailwind-merge'; // Import twMerge

const getTierBadge = (tier: string, className: string = '') => {
  // Added className prop
  const commonBaseClass = 'w-5 h-5 ml-1'; // Base styles
  const combinedClassName = twMerge(commonBaseClass, className);

  switch (tier.toLowerCase()) {
    case 'bronze':
      return (
        <Award className={twMerge(combinedClassName, 'text-award-bronze')} />
      );
    case 'silver':
      return (
        <Award className={twMerge(combinedClassName, 'text-award-silver')} />
      );
    case 'gold':
      return (
        <Award className={twMerge(combinedClassName, 'text-award-gold')} />
      );
    case 'platinum':
      return (
        <Award className={twMerge(combinedClassName, 'text-award-platinum')} />
      );
    case 'diamond':
      return (
        <Award className={twMerge(combinedClassName, 'text-award-diamond')} />
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

        if (myRankingResult.status === 'fulfilled') {
          setMyRanking(myRankingResult.value);
        } else {
          console.warn('Could not fetch my ranking:', myRankingResult.reason);
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

  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen text-primary-text flex items-center justify-center">
        <h1 className="text-4xl font-bold">Loading Rankings...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-red-500 flex items-center justify-center">
        <h1 className="text-4xl font-bold">{error}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen mb-20 text-primary-text">
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

        <div className="mx-auto bg-card-background border-2 border-edge rounded-lg shadow-lg p-6">
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

      {/* TiltedCard Modal for My Ranking */}
      {isModalOpen && myRanking && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute -top-12 right-0 text-primary-text hover:text-accent-primary1 transition-colors z-50"
              onClick={closeModal}
            >
              <X size={32} />
            </button>

            <TiltedCard
              // 아바타 이미지가 없으면 기본 이미지 사용 (Unsplash 예시)
              imageSrc={
                'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop'
              }
              altText={`${myRanking.nickname} Ranking Card`}
              captionText={`${myRanking.tier.toUpperCase()} TIER`}
              containerHeight="400px"
              containerWidth="400px"
              imageHeight="400px"
              imageWidth="400px"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <div className="w-[400px] h-[400px] flex flex-col justify-between p-6 bg-black/40 ">
                  {/* Top: Rank Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-accent-primary1 font-bold text-lg tracking-wider">
                        RANKING
                      </span>
                      <span className="text-5xl font-black text-primary-text drop-shadow-lg italic">
                        #{myRanking.rank}
                      </span>
                    </div>
                    {/* Rank Badge Icon */}
                    <div className="bg-primary-text/20 p-2 rounded-full backdrop-blur-md">
                      {myRanking.rank === 1 ? (
                        <Crown
                          size={32}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      ) : myRanking.rank <= 3 ? (
                        <Trophy size={28} className="text-gray-300" />
                      ) : (
                        <Medal size={28} className="text-accent-primary2" />
                      )}
                    </div>
                  </div>

                  {/* Center: Nickname & Tier */}
                  <div className="text-center my-auto">
                    <h2 className="text-3xl font-bold text-primary-text drop-shadow-md mb-2">
                      {myRanking.nickname}
                    </h2>
                    <span className="flex justify-center items-center">
                      {getTierBadge(myRanking.tier, 'w-8 h-8')}
                    </span>
                  </div>

                  {/* Bottom: Score */}
                  <div className="mt-auto pt-4 border-t border-primary-text">
                    <div className="flex justify-between items-end">
                      <span className="text-secondary-text  text-sm">
                        Total Score
                      </span>
                      <span className="text-2xl font-mono font-bold text-accent-primary2">
                        {myRanking.points.toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingPage;
