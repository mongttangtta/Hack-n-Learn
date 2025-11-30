import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import Button from '../components/Button';
import HeroImg from '../assets/images/이론학습 상세.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { problemService } from '../services/problemService';
import { fetchMyPageData } from '../services/userService';
import CountUp from '@/components/CountUp';
import StarBorder from '@/components/StarBorder';

const ChallengeResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, slug } = (location.state || { score: 0, slug: '' }) as {
    score: number;
    slug: string;
  };

  const [analysis, setAnalysis] = useState<string>('');
  const [totalUserPoints, setTotalUserPoints] = useState<number>(0);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const data = await fetchMyPageData();
        if (data.success && data.data && data.data.profile) {
          setTotalUserPoints(data.data.profile.points);
        }
      } catch (error) {
        console.error('Failed to fetch total user points:', error);
      }
    };

    fetchPoints();

    const handleLabAndEvents = async () => {
      if (!slug) return;

      try {
        const eventsResponse = await problemService.getContainerEvents(slug);
        if (eventsResponse.success && eventsResponse.analysis) {
          setAnalysis(eventsResponse.analysis.text);
        }
      } catch (error) {
        console.error('Error handling lab/events:', error);
        setAnalysis('분석 중 오류가 발생했습니다.');
      }
    };

    handleLabAndEvents();

    return () => {
      if (slug) {
        problemService
          .stopLab(slug)
          .then(() => console.log('Lab stopped successfully on unmount'))
          .catch((error) =>
            console.error('Error stopping lab on unmount:', error)
          );
      }
    };
  }, [slug]);

  const handleGoBack = () => {
    navigate('/challenge');
  };

  return (
    <>
      <HeroSection title="실전문제 결과" imageUrl={HeroImg} />
      <div className="min-h-screen py-12 px-10">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-h2 font-bold text-primary-text mb-10">
            ✨ 정답입니다! 축하합니다! 🎉
          </h2>
          <p className="text-primary-text text-base mb-10">
            당신은 <span className="font-bold"> SQLi Basic - Level 1</span>{' '}
            문제를 해결했습니다!
          </p>

          <div className="flex space-x-10 mb-10">
            <div>
              <p className="text-primary-text text-h3 text-base mb-6">
                획득 점수:{' '}
                <CountUp
                  from={0}
                  to={score}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text text-h1 text-bold"
                />
              </p>
            </div>
            <div>
              <p className="text-primary-text text-h3 text-base mb-6">
                총점:{' '}
                <CountUp
                  from={0}
                  to={totalUserPoints}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text text-h1 text-bold"
                />
              </p>
            </div>
          </div>

          <StarBorder
            as="div"
            className="custom-class w-full"
            color="cyan"
            speed="5s"
          >
            <h3 className="text-h2 font-bold text-primary-text mb-4">
              AI 해설
            </h3>
            <p className="text-primary-text text-base whitespace-pre-wrap">
              {analysis || 'AI가 실습 과정을 분석하고 있습니다...'}
            </p>
          </StarBorder>

          <div className="flex justify-center mt-8">
            <Button variant="secondary" onClick={handleGoBack}>
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChallengeResultPage;
