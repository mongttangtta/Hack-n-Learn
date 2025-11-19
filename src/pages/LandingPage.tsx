import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import logo from '../assets/images/logo.png'; // Assuming logo can be used as a hero image or a placeholder

const LandingPage: React.FC = () => {
  return (
    <div>
      <HeroSection
        imageUrl={logo} // Using logo as a placeholder, ideally a more thematic image would be used
        title={
          <span className="text-white text-5xl">
            해킹과 보안, 이제 즐겁게 배우고 도전하세요!
          </span>
        }
        subtitle={
          <span className="text-white text-lg">
            이론 학습부터 실전 문제 해결까지, 당신의 보안 역량을 한 단계 업그레이드 시켜줄 최고의 플랫폼.
          </span>
        }
      />

      {/* Feature Highlights Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-20">
          <h2 className="text-4xl font-bold text-center mb-12">핵심 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/learning" className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300 block">
              <h3 className="text-2xl font-semibold mb-4">체계적인 이론 학습</h3>
              <p className="text-gray-700">다양한 보안 취약점에 대한 깊이 있는 이론을 학습하고 지식을 쌓으세요.</p>
            </Link>
            <Link to="/challenge" className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300 block">
              <h3 className="text-2xl font-semibold mb-4">실전과 같은 도전 과제</h3>
              <p className="text-gray-700">실제 해킹 시나리오를 경험하며 문제 해결 능력을 향상시키세요.</p>
            </Link>
            <Link to="/community" className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300 block">
              <h3 className="text-2xl font-semibold mb-4">함께 성장하는 커뮤니티</h3>
              <p className="text-gray-700">질문하고, 토론하고, 랭킹을 통해 다른 학습자들과 교류하세요.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-20">
          <h2 className="text-4xl font-bold text-center mb-12">어떻게 작동하나요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl text-accent-primary1 mb-4">1</div>
              <h3 className="text-2xl font-semibold mb-2">배우기</h3>
              <p className="text-gray-700">다양한 보안 이론 학습 콘텐츠를 탐색하세요.</p>
            </div>
            <div>
              <div className="text-5xl text-accent-primary1 mb-4">2</div>
              <h3 className="text-2xl font-semibold mb-2">도전하기</h3>
              <p className="text-gray-700">실전 챌린지를 통해 학습 내용을 적용하고 실력을 키우세요.</p>
            </div>
            <div>
              <div className="text-5xl text-accent-primary1 mb-4">3</div>
              <h3 className="text-2xl font-semibold mb-2">성장하기</h3>
              <p className="text-gray-700">커뮤니티에서 교류하고 랭킹을 통해 실력 향상을 확인하세요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-16 bg-accent-primary1 text-white text-center">
        <div className="container mx-auto px-20">
          <h2 className="text-4xl font-bold mb-6">지금 바로 Hack-n-Learn과 함께하세요!</h2>
          <Link to="/learning" className="bg-white text-accent-primary1 font-bold py-3 px-8 rounded-full text-xl hover:bg-gray-200 transition duration-300 inline-block">
            학습 시작하기
          </Link>
          <Link to="/challenge" className="bg-white text-accent-primary1 font-bold py-3 px-8 rounded-full text-xl hover:bg-gray-200 transition duration-300 inline-block ml-4">
            도전 과제 풀기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

