import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import CountUp from '@/components/CountUp';

interface HeaderProps {
  title: string;
  subtitle: string;
  score: number;
  onExitChallenge?: () => void;
}

const ChallengeHeader: React.FC<HeaderProps> = ({ title, subtitle, score, onExitChallenge }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (onExitChallenge) {
      onExitChallenge(); // Allow parent to handle exit logic (e.g., set shouldBlock to false)
    }
    navigate('/');
  };

  const handleExit = () => {
    if (onExitChallenge) {
      onExitChallenge(); // Allow parent to handle exit logic
    }
    navigate('/challenge');
  };

  return (
    <header className="bg-[#21213f]">
      <nav className="container mx-auto py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-10 cursor-pointer" 
          onClick={handleLogoClick}
        >
          <img src={logo} alt="Hack 'n' Learn" className="h-6" />
          <span className="text-h3 text-primary-text">
            {title} - {subtitle}
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-lg font-bold text-white flex items-center gap-2">
            현재 점수: 
            <span className="text-cyan-400">
              <CountUp 
                to={score} 
                duration={1} 
                separator=","
              />
              점
            </span>
          </div>
          
          <button 
            onClick={handleExit}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">나가기</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default ChallengeHeader;