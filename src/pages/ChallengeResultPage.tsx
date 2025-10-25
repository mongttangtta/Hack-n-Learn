import React from 'react';

import HeroSection from '../components/HeroSection';
import Button from '../components/Button';
import HeroImg from '../assets/images/이론학습 상세.png';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

const LearningPageQuizResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation
  const { score } = (location.state || { score: 0 }) as { score: number }; // Get score from state, default to 0

  const handleGoBack = () => {
    navigate('/challenge'); // Corrected path
  };

  return (
    <>
      <HeroSection title="실전문제 결과" imageUrl={HeroImg} />
      <div className="min-h-screen py-12 px-10">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-h2 font-bold text-primary-text mb-10">
            ✨ 정답입니다! 축하합니다! 🎉
          </h2>
          <p className="text-primary-text text-base mb-4">
            당신은 <span className="font-bold"> SQLi Basic - Level 1</span>{' '}
            문제를 해결했습니다!
          </p>
          <p className="text-primary-text text-base mb-4">
            획득 점수: <span className="font-bold">{score}점</span>
          </p>
          <p className="text-primary-text text-base mb-4">
            총점: <span className="font-bold">1230점</span>
          </p>
          <p className="text-primary-text text-base mb-6">
            새로운 칭호 <span className="font-bold">'웹 해킹 마스터'</span>를
            획득했습니다!
          </p>

          <div className="bg-card-background rounded-lg p-8 mt-20 mb-10 border-2 border-edge ">
            <h3 className="text-h2 font-bold text-primary-text mb-4">
              AI 해설
            </h3>

            <p className="text-primary-text text-base">
              방어 전략 우선순위 개념에 대해서 취약하신 것 같습니다. 그 부분을
              집중적으로 공부해 보시길 바랍니다
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="secondary" onClick={handleGoBack} className="">
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearningPageQuizResult;
