import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import heroimg from '../assets/images/community2.jpg';
import Pagination from '../components/Pagination';

// Main Community Page Component
export default function CommunityHome() {
  const location = useLocation();
  const [underlineStyle, setUnderlineStyle] = useState({});
  const navRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const navLinks = [
    { name: '보안 뉴스', path: '/community' },
    { name: '자유 게시판', path: '/community/qna' },
    { name: '자료실', path: '/community/archive' },
  ];

  useEffect(() => {
    if (navRef.current) {
      const activeLink = navRef.current.querySelector<HTMLElement>('.active');
      if (activeLink) {
        setUnderlineStyle({
          width: activeLink.clientWidth,
          left: activeLink.offsetLeft,
        });
      }
    }
  }, [location]);

  return (
    <div className=" text-primary-text min-h-screen ">
      <HeroSection
        imageUrl={heroimg}
        title={<span className="">커뮤니티</span>}
        subtitle="Hack 'n' Learn의 지식이 모이는 허브입니다."
      />

      <main className="pb-20">
        {/* Navigation Tabs */}
        <div className="bg-navigation p-2 flex justify-center">
          <nav className="relative flex items-center gap-30" ref={navRef}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `py-2 px-2 ${isActive ? 'active font-bold ' : ''}`
                }
                end={link.path === '/community'}
              >
                {link.name}
              </NavLink>
            ))}
            <div
              className="absolute bottom-0 h-0.5 bg-accent-primary1 transition-all duration-300"
              style={underlineStyle}
            />
          </nav>
        </div>

        <div className="max-w-[1440px] mx-auto px-10">
          <Outlet context={{ currentPage, handlePageChange, setTotalPages }} />

          {(location.pathname === '/community' ||
            location.pathname === '/community/qna') && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>
    </div>
  );
}
