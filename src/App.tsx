import { useEffect } from 'react'; // Import useEffect
import { Outlet, useLocation } from 'react-router-dom';
import Header from './layout/Header'; // Assuming Header is the main layout header
import AIChatBot from './components/AIChatBot'; // Import AIChatBot

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isChallengePage = location.pathname.startsWith('/challenge') && location.pathname !== '/challenge'; // Hide header for challenge sub-pages, but show for /challenge

  const hideAIChatBot =
    location.pathname.startsWith('/challenge/') || // For ChallengeDetailPage and ChallengeResultPage
    location.pathname === '/learning/quiz'; // For LearningPageQuiz

  return (
    <>
      <ScrollToTop /> {/* Add ScrollToTop component */}
      {!isChallengePage && <Header />}
      <Outlet />
      {!hideAIChatBot && (
        <div className="fixed bottom-8 right-8 z-50">
          <AIChatBot />
        </div>
      )}
    </>
  );
}