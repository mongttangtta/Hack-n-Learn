import Stepper, { Step } from '@/components/Stepper';
import { useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';
import learningIntro from '../assets/images/이론학습 소개.png';
import rankingIntro from '../assets/images/rankingintro.png';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center w-full p-4">
      <div className="w-full max-w-[1440px]">
        <Stepper
          initialStep={1}
          onFinalStepCompleted={() => navigate('/learning')}
          backButtonText="prev"
          nextButtonText="next"
          stepCircleContainerClassName="max-w-4xl"
        >
          <Step>
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <h2 className="text-h1 font-bold text-primary-text mb-4">
                Hack <span className="text-accent-primary2">'N'</span> Learn
              </h2>
              <p className="text-body text-primary-text">
                웹 보안을 쉽고 재미있게 배울 수 있는
                <br />
                실습형 교육 플랫폼입니다.
              </p>
            </div>
          </Step>

          <Step>
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <h2 className="text-h1 font-bold text-primary-text mb-4">
                체계적인 이론 학습
              </h2>
              <p className="text-body text-primary-text">
                SQL Injection, XSS, CSRF 등<br />
                주요 웹 취약점의 원리와 방어 기법을
                <br />
                단계별로 학습할 수 있습니다.
                <br />
              </p>
            </div>
          </Step>
          <Step>
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <h2 className="text-h1 font-bold text-primary-text mb-4">
                이론 학습 상세 페이지
              </h2>
              <p className="text-body text-primary-text">
                각 취약점별 목차 소개와 함께
                <br />
                상세한 설명, 관련 이미지,
                <br />
                그리고 직접 따라 할 수 있는 실습 코드를 제공하여
                <br />
                이해도를 높이고 학습 경험을 풍부하게 합니다.
                <br />
              </p>
            </div>
          </Step>
          <Step>
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <h2 className="text-h1 font-bold text-primary-text mb-4">
                이론 학습 퀴즈
              </h2>
              <img src={learningIntro} alt="" />
              <p className="text-body text-primary-text">
                배운 이론을 퀴즈로 점검하며
                <br />
                학습 효과를 극대화하고,
                <br />
                취약점에 대한 이해를 확실하게 다질 수 있습니다.
                <br />
              </p>
            </div>
          </Step>
          <Step>
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <h2 className="text-h1 font-bold text-primary-text mb-4">
                실전 모의 해킹
              </h2>
              <p className="text-body text-primary-text">
                안전하게 구축된 가상 환경에서
                <br />
                직접 공격 코드를 작성하고 실행해보며
                <br />
                실전 감각을 익힐 수 있습니다.
              </p>
            </div>
          </Step>

          <Step>
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <h2 className="text-h1 font-bold text-primary-text mb-4">
                티어 시스템
              </h2>
              <div className="flex space-x-4 mb-2">
                <Award className="w-12 h-12 text-award-bronze" />
                <Award className="w-12 h-12 text-award-silver" />
                <Award className="w-12 h-12 text-award-gold" />
                <Award className="w-12 h-12 text-award-platinum" />
                <Award className="w-12 h-12 text-award-diamond" />
              </div>
              <p className="text-body text-primary-text">
                퀴즈와 실습을 통해 경험치를 획득하고
                <br />
                브론즈부터 다이아몬드까지 티어를 올려보세요.
                <br />
                성장의 즐거움을 느낄 수 있습니다.
              </p>
            </div>
          </Step>

          <Step>
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <h2 className="text-h1 font-bold text-primary-text mb-4">
                칭호 시스템
              </h2>
              <p className="text-body text-primary-text">
                특정 업적을 달성하면
                <br />
                다양하고 개성 넘치는 칭호를 획득할 수 있습니다.
                <br />
                나만의 프로필을 멋지게 장식해보세요.
              </p>
            </div>
          </Step>

          <Step>
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <h2 className="text-h1 font-bold text-primary-text mb-4">
                함께하는 커뮤니티
              </h2>
              <img src={rankingIntro} alt="" className="rounded-lg h-50 w-50" />
              <p className="text-body text-primary-text">
                다른 학습자들과 지식을 공유하고
                <br />
                랭킹 시스템을 통해 선의의 경쟁을 펼쳐보세요.
              </p>
            </div>
          </Step>

          <Step>
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <h2 className="text-h1 font-bold text-primary-text mb-6">
                준비 되셨나요?
              </h2>
              <p className="text-body text-primary-text mb-8">
                지금 바로 화이트 해커가 되기 위한
                <br />
                여정을 시작해보세요!
              </p>
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  );
}
