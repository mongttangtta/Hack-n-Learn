import { Bell, User } from 'lucide-react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import logo from '../assets/images/logo.png';

export default function Header() {
  const navLinks = [
    { name: '서비스 소개', path: '/about' },
    { name: '이론 학습', path: '/learning' },
    { name: '실전 문제', path: '/challenge' }, // Changed path
    { name: '커뮤니티', path: '/community' },
    { name: '랭킹', path: '/ranking' },
  ];

  return (
    <header className="bg-[#21213f]">
      <nav className="container mx-auto py-4 flex justify-between items-center">
        <NavLink to="/"> {/* Use NavLink for logo as well */}
          <img src={logo} alt="Hack 'n' Learn" className="h-6" />
        </NavLink>

        <div className="hidden md:flex items-center space-x-15 text-body1 text-primary-text">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `hover:text-accent-primary1 transition-colors ${
                  isActive ? 'text-accent-primary1 font-bold' : ''
                }`
              }
            >
              {link.name}
            </NavLink>
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
