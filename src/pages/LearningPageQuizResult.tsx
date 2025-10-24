import React from 'react';
import Header from '../layout/Header';
import HeroSection from '../components/HeroSection';
import Button from '../components/Button';
import HeroImg from '../assets/images/이론학습 상세.png';
import { useNavigate } from 'react-router-dom';

const LearningPageQuizResult: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/learningPageQuiz');
  };

  return (
    <>
      <Header />
      <HeroSection title="퀴즈 결과" imageUrl={HeroImg} />
      <div className="min-h-screen py-12 px-10">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-h2 font-bold text-primary-text mb-10">
            모든 이론 학습 과정이 끝났습니다. 수고하셨습니다
          </h2>
          <p className="text-primary-text text-base mb-4">
            당신은 <span className="font-bold">XSS (Cross-Site Scripting)</span>{' '}
            학습을 완료했습니다!
          </p>
          <p className="text-primary-text text-base mb-4">
            획득 점수: <span className="font-bold">90점</span>
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
            <h4 className="text-h3 font-bold text-primary-text mb-2">
              이준수님의 취약점
            </h4>
            <p className="text-primary-text text-base">
              방어 전략 우선순위 개념에 대해서 취약하신 것 같습니다. 그 부분을
              집중적으로 공부해 보시길 바랍니다
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="primary" onClick={handleGoBack} className="">
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearningPageQuizResult;
