// src/components/ChallengeHeader.tsx

import React from 'react';
import logo from '../../assets/images/logo.png'; // Import logo

interface HeaderProps {
  title: string;
  subtitle: string;
  score: number;
}

const ChallengeHeader: React.FC<HeaderProps> = ({ title, subtitle, score }) => {
  return (
    <header className="bg-[#21213f] ">
      <nav className="container mx-auto py-4 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <img src={logo} alt="Hack 'n' Learn" className="h-6" />{' '}
          {/* Replaced with image */}
          <span className="text-h3 text-primary-text">
            {title} - {subtitle}
          </span>
        </div>
        <div className="text-lg font-bold text-white">
          현재 점수: <span className="text-cyan-400">{score}점</span>
        </div>
      </nav>
    </header>
  );
};

export default ChallengeHeader;
