import { useState } from 'react';
import { Bell, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { name: '서비스 소개', path: '/about' },
    { name: '이론 학습', path: '/learning' },
    { name: '실전 문제', path: '/challenge' },
    { name: '커뮤니티', path: '/community' },
    { name: '랭킹', path: '/ranking' },
  ];

  return (
    <header className="bg-[#21213f]">
      <nav className="container mx-auto py-4 flex justify-between items-center">
        <Link to="/">
          <img src={logo} alt="Hack 'n' Learn" className="h-6" />
        </Link>

        <div className="hidden md:flex items-center space-x-15 text-body1 text-primary-text">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-accent-primary1 transition-colors ${
                location.pathname.startsWith(link.path) ? 'text-accent-primary1 font-bold' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4 text-primary-text">
          <Bell />
          <span className="flex">
            <User />
            이준수님
          </span>
          <Link
            to="/logout"
            className="text-sm text-secondary-text hover:text-white transition-colors border rounded-[5px] px-1 py-0.5"
          >
            로그아웃
          </Link>
        </div>
      </nav>
    </header>
  );
}
