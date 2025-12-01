import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer'; // 1. Footer 컴포넌트 import
import AIChatBot from './components/AIChatBot';
import { useAuthStore } from './store/authStore';
import Toast from './components/Toast';

import Spinner from './components/Spinner';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkAuthStatus, isLoading } = useAuthStore();
  const [showSessionToast, setShowSessionToast] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    const handleSessionExpired = () => {
      setShowSessionToast(true);
      navigate('/');
    };

    window.addEventListener('session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, [navigate]);

  const isChallengePage =
    location.pathname.startsWith('/challenge') &&
    location.pathname !== '/challenge';

  const isLandingPage = location.pathname === '/';

  const hideHeaderFooter = isChallengePage || isLandingPage;

  const hideAIChatBot =
    isLandingPage ||
    location.pathname.startsWith('/challenge/') || // For ChallengeDetailPage and ChallengeResultPage
    location.pathname === '/learning/quiz'; // For LearningPageQuiz

  if (isLoading) {
    return <Spinner fullScreen />;
  }

  return (
    <>
      {' '}
      {/** Wrap the content with AuthProvider */}
      <ScrollToTop />
      {!hideHeaderFooter && <Header />}
      <Outlet />
      {!hideAIChatBot && (
        <div className="fixed bottom-8 right-8 z-50">
          <AIChatBot />
        </div>
      )}
      {/* 2. Header와 동일한 조건으로 Footer 추가 */}
      {!hideHeaderFooter && <Footer />}
      <Toast
        message="로그인 세션이 만료되었습니다. 다시 로그인해주세요."
        isVisible={showSessionToast}
        onClose={() => setShowSessionToast(false)}
      />
    </>
  );
}
