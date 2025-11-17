import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Award } from 'lucide-react';
import heroimg from '../assets/images/community2.jpg';
import HeroSection from '../components/HeroSection';

interface RankingItem {
  rank: number;
  nickname: string;
  tier: string;
  points: number;
}

const getTierBadge = (tier: string) => {
  const commonProps = { className: 'w-5 h-5 ml-1' }; // Added ml-1 for spacing
  switch (tier) {
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
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/ranking');
        // Assuming response.data.data contains the structure { users: [], totalUsers: ... }
        setRankings(response.data.data.users);
      } catch (err) {
        setError('Failed to fetch rankings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

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
        <h1 className="text-h2 font-bold my-10">전체 랭킹</h1>
        <div className=" mx-auto bg-card-background border-2 border-edge rounded-lg shadow-lg p-6">
          {rankings.length === 0 ? (
            <p className="text-center text-lg">랭킹 데이터가 없습니다.</p>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-edge">
                  <th className="py-3 px-4 text-lg font-semibold">순위</th>
                  <th className="py-3 px-4 text-lg font-semibold">사용자명</th>
                  <th className="py-3 px-4 text-lg font-semibold">티어</th>
                  <th className="py-3 px-4 text-lg font-semibold">점수</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((item) => (
                  <tr
                    key={item.rank}
                    className="border-b border-edge last:border-b-0"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
