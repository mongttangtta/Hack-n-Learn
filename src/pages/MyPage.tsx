import type { ReactNode } from 'react';
import CircularProgress from '../components/CircularProgress';
import { ArrowRight, Settings, Award } from 'lucide-react';

// 프로필 섹션
const UserProfile = () => (
  <div className="flex flex-col items-center text-center my-12 relative bg-card-background p-5">
    {/* 프로필 이미지 */}
    <div className="relative mb-4">
      <img
        src="https://via.placeholder.com/128" // placeholder 이미지
        alt="프로필 이미지"
        className="w-32 h-32 rounded-full border-2 border-edge"
      />
      <span className="absolute top-0 right-0 bg-edge border-4 border-card-background rounded-full p-1 text-xs">
        <Settings className="w-4.5 h-4.5 text-[#121212]" />
      </span>
    </div>
    {/* 사용자 정보 */}
    <h2 className="text-h3 font-bold text-primary-text">홍길동</h2>
    <p className="text-secondary-text text-body">sql 마스터</p>
    <div className="flex">
      <Award className="w-5 h-5 text-award-gold mt-2" />
      <Award className="w-5 h-5 text-award-bronze mt-2" />
      <Award className="w-5 h-5 text-award-silver mt-2" />
      <Award className="w-5 h-5 text-award-platinum mt-2" />
      <Award className="w-5 h-5 text-award-diamond mt-2" />
    </div>{' '}
  </div>
);

// 나의 학습 진도 카드
const ProgressCard = () => (
  <div className="bg-card-background p-6 rounded-lg border border-gray-700 h-full">
    <h3 className="text-body font-bold text-primary-text mb-6">
      나의 학습 진도
    </h3>
    <div className="flex justify-between items-start text-center">
      {/* 이론 학습 */}
      <div className="">
        <p className="mb-4 text-primary-text font-semibold">이론 학습 진행도</p>
        <CircularProgress
          percentage={50}
          colorStart="var(--color-accent-primary1)"
          colorEnd="var(--color-accent-primary2)"
        />
        <p className="text-secondary-text text-sm mt-1">
          XSS (Cross-Site Scripting)
          <br />을 마지막으로 결부하였습니다.
        </p>
      </div>
      {/* 실전 문제 */}
      <div className="">
        <p className="mb-4 text-primary-text font-semibold">실전 문제 진행도</p>
        <CircularProgress
          percentage={30}
          colorStart="var(--color-accent-warning)"
          colorEnd="var(--color-accent-caution)"
        />
        <p className="text-secondary-text text-sm mt-1">
          최근 푼 문제:
          <br />
          XSS (Cross-Site Scripting) - Stored
        </p>
      </div>
    </div>
  </div>
);

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
  return (
    <div className="bg-main min-h-screen">
      <main className="container mx-auto px-6 py-8">
        {/* 프로필 섹션 */}
        <UserProfile />

        {/* 메인 대시보드 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 학습 진도 (lg 화면에서 1/3 차지) */}
          <div className="lg:col-span-1">
            <ProgressCard />
          </div>

          {/* 우측: 풀이 이력 & 오답 노트 (lg 화면에서 2/3 차지) */}
          <div className="lg:col-span-2 space-y-6">
            <InfoCard title="나의 풀이 이력">
              <p className="text-primary-text  p-2 rounded-md cursor-pointer transition-colors">
                XSS (Cross-Site Scripting) - Stored
              </p>
              {/* ... 다른 이력들 */}
            </InfoCard>

            <InfoCard title="문제 오답노트">
              <p className="text-secondary-text text-center py-4">
                오답 노트가 비어있습니다.
              </p>
            </InfoCard>
          </div>
        </div>
      </main>
      -
    </div>
  );
}
