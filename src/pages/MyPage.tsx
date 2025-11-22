import { type ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import CircularProgress from '../components/CircularProgress';
import { ArrowRight, Settings, Award } from 'lucide-react';

// Interfaces based on the API response
interface Profile {
  nickname: string;
  tier: string;
  points: number;
  profileImageUrl: string;
}

interface QuizPart {
  title: string;
  progress: number;
  slug: string;
}

interface QuizProgress {
  summary: {
    totalQuizzes: number;
    solvedQuizzes: number;
    progress: number;
  };
  parts: QuizPart[];
}

interface PracticeItem {
  challengeId: string;
  title: string;
  // Add other fields if known, otherwise infer or keep minimal
}

interface Practice {
  total: number;
  successCount: number;
  successRate: number;
  practiceList: PracticeItem[];
}

interface MyPageData {
  profile: Profile;
  practice: Practice;
  quizProgress: QuizProgress;
}

// 프로필 섹션
const UserProfile = ({ profile }: { profile: Profile | null }) => {
  if (!profile) return <div className="p-5">Loading Profile...</div>;

  const getTierColorClass = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return 'text-award-bronze';
      case 'silver': return 'text-award-silver';
      case 'gold': return 'text-award-gold';
      case 'platinum': return 'text-award-platinum';
      case 'diamond': return 'text-award-diamond';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-col items-center text-center my-12 relative bg-card-background p-5 rounded-lg border border-gray-700">
      {/* 프로필 이미지 */}
      <div className="relative mb-4">
        <img
          src={profile.profileImageUrl || "https://via.placeholder.com/128"}
          alt="프로필 이미지"
          className="w-32 h-32 rounded-full border-2 border-edge object-cover"
        />
        <span className="absolute top-0 right-0 bg-edge border-4 border-card-background rounded-full p-1 text-xs">
          <Settings className="w-4.5 h-4.5 text-[#121212]" />
        </span>
      </div>
      {/* 사용자 정보 */}
      <h2 className="text-h3 font-bold text-primary-text">{profile.nickname}</h2>
      <p className="text-secondary-text text-body uppercase">{profile.tier}</p>
      <div className="flex gap-1">
        <Award
          className={`w-5 h-5 mt-2 ${getTierColorClass(profile.tier)}`}
        />
      </div>
      <p className="text-sm text-secondary-text mt-2">Points: {profile.points}</p>
    </div>
  );
};

// 나의 학습 진도 카드
const ProgressCard = ({
  quizProgress,
  practice,
}: {
  quizProgress: QuizProgress | null;
  practice: Practice | null;
}) => {
  if (!quizProgress || !practice)
    return <div className="p-6">Loading Progress...</div>;

  // Determine last learned topic (example logic: first with progress > 0 or just the first one)
  const lastLearnedTopic =
    quizProgress.parts.find((p) => p.progress > 0) || quizProgress.parts[0];

  // Determine last practice (example logic: first in list)
  const lastPractice =
    practice.practiceList.length > 0 ? practice.practiceList[0] : null;

  return (
    <div className="bg-card-background p-6 rounded-lg border border-gray-700 h-full">
      <h3 className="text-body font-bold text-primary-text mb-6">
        나의 학습 진도
      </h3>
      <div className="flex justify-between items-start text-center gap-4">
        {/* 이론 학습 */}
        <div className="flex-1 flex flex-col items-center">
          <p className="mb-4 text-primary-text font-semibold">
            이론 학습 진행도
          </p>
          <CircularProgress
            percentage={Math.round(quizProgress.summary.progress)}
            colorStart="var(--color-accent-primary1)"
            colorEnd="var(--color-accent-primary2)"
          />
          <p className="text-secondary-text text-sm mt-4">
            {lastLearnedTopic ? (
              <>
                {lastLearnedTopic.title}
                <br />
                을(를){' '}
                {lastLearnedTopic.progress > 0
                  ? '학습 중입니다.'
                  : '시작해보세요.'}
              </>
            ) : (
              '학습 기록이 없습니다.'
            )}
          </p>
        </div>
        {/* 실전 문제 */}
        <div className="flex-1 flex flex-col items-center">
          <p className="mb-4 text-primary-text font-semibold">
            실전 문제 진행도
          </p>
          <CircularProgress
            percentage={Math.round(practice.successRate)}
            colorStart="var(--color-accent-warning)"
            colorEnd="var(--color-accent-caution)"
          />
          <p className="text-secondary-text text-sm mt-4">
            {lastPractice ? (
              <>
                최근 푼 문제:
                <br />
                {lastPractice.title}
              </>
            ) : (
              '아직 푼 문제가 없습니다.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

// 우측 카드 (재사용)
interface InfoCardProps {
  title: string;
  children: ReactNode;
}

const InfoCard = ({ title, children }: InfoCardProps) => (
  <div className="bg-card-background p-6 rounded-lg border border-gray-700">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-body font-bold text-primary-text">{title}</h3>
      <button className="text-secondary-text hover:text-primary-text">
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
    <div>{children}</div>
  </div>
);

// 마이페이지 전체
export default function MyPage() {
  const [data, setData] = useState<MyPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/mypage');
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError('Failed to load data');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-main min-h-screen flex items-center justify-center text-primary-text">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-main min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-main min-h-screen">
      <main className="container mx-auto px-6 py-8">
        {/* 프로필 섹션 */}
        <UserProfile profile={data?.profile || null} />

        {/* 메인 대시보드 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 학습 진도 (lg 화면에서 1/3 차지) */}
          <div className="lg:col-span-1">
            <ProgressCard
              quizProgress={data?.quizProgress || null}
              practice={data?.practice || null}
            />
          </div>

          {/* 우측: 풀이 이력 & 오답 노트 (lg 화면에서 2/3 차지) */}
          <div className="lg:col-span-2 space-y-6">
            <InfoCard title="나의 풀이 이력">
              {data?.practice.practiceList &&
              data.practice.practiceList.length > 0 ? (
                data.practice.practiceList.map((item, index) => (
                  <p
                    key={index}
                    className="text-primary-text p-2 rounded-md cursor-pointer transition-colors hover:bg-gray-800"
                  >
                    {item.title}
                  </p>
                ))
              ) : (
                <p className="text-secondary-text text-center py-4">
                  풀이 이력이 없습니다.
                </p>
              )}
            </InfoCard>

            <InfoCard title="문제 오답노트">
              <p className="text-secondary-text text-center py-4">
                {/* Assuming logic for wrong answers needs filtering or a separate list, usually derived from practiceList or a specific API field not yet clear. For now, showing default. */}
                오답 노트가 비어있습니다.
              </p>
            </InfoCard>
          </div>
        </div>
      </main>
    </div>
  );
}
