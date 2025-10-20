import { useState } from 'react';
import { Bell, User } from 'lucide-react';
import logo from '../assets/images/logo.png';

export default function Header() {
  const [activeLink, setActiveLink] = useState('이론 학습');

  const navLinks = [
    '서비스 소개',
    '이론 학습',
    '실전 문제',
    '커뮤니티',
    '랭킹',
  ];

  return (
    <header className="bg-[#21213f]">
      <nav className="container mx-auto py-4 flex justify-between items-center">
        <a href="/">
          <img src={logo} alt="Hack 'n' Learn" className="h-6" />
        </a>

        <div className="hidden md:flex items-center space-x-15 text-body1 text-primary-text">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className={`hover:text-accent-primary1 transition-colors ${
                activeLink === link ? 'text-accent-primary1 font-bold' : ''
              }`}
              onClick={() => setActiveLink(link)}
            >
              {link}
            </a>
          ))}
        </div>
        <div className="flex items-center space-x-4 text-primary-text">
          <Bell />
          <span className="flex">
            <User />
            이준수님
          </span>
          <a
            href="#"
            className="text-sm text-secondary-text hover:text-white transition-colors border rounded-[5px] px-1 py-0.5"
          >
            로그아웃
          </a>
        </div>
      </nav>
    </header>
  );
}
