import React from 'react';
import { Github } from 'lucide-react';

interface SocialButtonProps {
  provider: 'google' | 'github';
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function SocialButton({
  provider,
  children,
  onClick,
}: SocialButtonProps) {
  const baseStyle =
    'w-full flex items-center justify-center px-6 py-3 rounded-[3px] text-[14px]  transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const providerStyles = {
    google: 'bg-white text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    github: 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-600',
  };

  const providerIcons = {
    google: <span className="font-bold text-xl">G</span>,
    github: <Github className="w-6 h-6" />,
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${providerStyles[provider]}`}
    >
      <div className="mr-4">{providerIcons[provider]}</div>
      {children}
    </button>
  );
}
