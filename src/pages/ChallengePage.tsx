import React, { useEffect, useMemo } from 'react';
import HeroSection from '../components/HeroSection';
import HeroImg from '../assets/images/실전문제.jpg';
import Carousel, { type CarouselItem } from '../components/Carousel';
import { useProblemStore } from '../store/problemStore';
import { CheckCircle, XCircle, AlertCircle, Lock } from 'lucide-react';
import Squares from '../components/Squares'; // Squares 컴포넌트 import

const ChallengePage: React.FC = () => {
  const { problemProgress, isLoading, error, fetchProblemProgress } =
    useProblemStore();

  useEffect(() => {
    fetchProblemProgress();
  }, [fetchProblemProgress]);

  // problemProgress 데이터를 CarouselItem 형태로 변환
  const carouselItems: CarouselItem[] = useMemo(() => {
    if (!problemProgress || problemProgress.length === 0) {
      return [];
    }

    return problemProgress.map((problem, index) => {
      let icon;
      let statusText = '';

      switch (problem.result) {
        case 'solved':
          icon = <CheckCircle className="h-4 w-4 text-green-500" />;
          statusText = 'Solved';
          break;
        case 'partial':
          icon = <AlertCircle className="h-4 w-4 text-accent-caution" />;
          statusText = 'Partial';
          break;
        case 'unsolved':
          icon = <XCircle className="h-4 w-4 text-red-500" />;
          statusText = 'Unsolved';
          break;
        default:
          icon = <Lock className="h-4 w-4 text-gray-500" />;
          statusText = 'Locked';
      }

      let difficultyEmoji = '';
      switch (problem.difficulty) {
        case 'easy':
          difficultyEmoji = '😊';
          break;
        case 'medium':
          difficultyEmoji = '🤔';
          break;
        case 'hard':
          difficultyEmoji = '🥵';
          break;
        default:
          difficultyEmoji = problem.difficulty;
      }

      return {
        id: index,
        title: problem.title,
        description: `Difficulty: ${difficultyEmoji} | Answer Rate: ${problem.answerRate}% | Status: ${statusText}`,
        icon: icon,
      };
    });
  }, [problemProgress]);

  return (
    <>
      <HeroSection
        title="실전 문제"
        imageUrl={HeroImg}
        subtitle="가상 세계의 방어선을 뚫고 목표를 쟁취하세요. 모든 공격과 방어의 흔적이 당신의 경험이 됩니다."
      />
      {/* 메인 컨테이너: 배경 위치 기준점 설정 (relative) */}
      <div className="min-h-screen py-12 px-10 relative overflow-hidden">
        {/* Squares 배경: absolute로 위치 잡고 z-index로 뒤로 보냄 */}
        <div className="absolute inset-0 -z-10">
          <Squares
            speed={0.5}
            squareSize={40}
            direction="diagonal"
            borderColor="#555" // 어두운 테마에 맞는 격자 색상
            hoverFillColor="#222" // 호버 시 채워질 색상
          />
        </div>

        {/* 기존 콘텐츠 */}
        <div className="max-w-[1440px] mx-auto relative z-10">
          <section className="mb-12 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-8 text-primary-text">
              문제 진행 상황
            </h2>

            {isLoading && (
              <div className="text-center py-10">Loading progress...</div>
            )}
            {error && (
              <div className="text-center py-10 text-red-500">{error}</div>
            )}

            {!isLoading && !error && carouselItems.length > 0 ? (
              <div
                style={{
                  height: '600px',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                className="text-primary-text"
              >
                <Carousel
                  items={carouselItems}
                  baseWidth={500}
                  autoplay={false}
                  loop={false}
                  round={true}
                />
              </div>
            ) : (
              !isLoading &&
              !error && (
                <div className="text-center py-10">
                  진행 중인 문제가 없습니다.
                </div>
              )
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default ChallengePage;
