import { StrictMode } from 'react';
import './styles/index.css';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Import createBrowserRouter and RouterProvider

// Import all page components
import App from './App';
import LearningPageDetail from './pages/LearningPageDetail';
import LearningPageQuiz from './pages/LearningPageQuiz';
import LearningPageQuizResult from './pages/LearningPageQuizResult';
import LearningPageMain from './pages/LearningPageMain';
import ChallengePage from './pages/ChallengePage';
import ChallengeDetailPage from './pages/ChallengeDetailPage';
import AboutPage from './pages/AboutPage';
import CommunityPage from './pages/CommunityPage';
import RankingPage from './pages/RankingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChallengeResultPage from './pages/ChallengeResultPage'; // Import ChallengeResultPage

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App is now the layout component
    children: [
      { index: true, element: <LearningPageMain /> }, // Default route for /
      { path: 'about', element: <AboutPage /> },
      { path: 'learning', element: <LearningPageMain /> },
      { path: 'learning-detail', element: <LearningPageDetail /> },
      { path: 'learning/quiz', element: <LearningPageQuiz /> },
      { path: 'learning/quiz-results', element: <LearningPageQuizResult /> },
      { path: 'challenge', element: <ChallengePage /> },
      { path: 'challenge/:id', element: <ChallengeDetailPage /> },
      { path: 'challenge/result', element: <ChallengeResultPage /> }, // Add ChallengeResultPage route
      { path: 'community', element: <CommunityPage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} /> {/* Use RouterProvider */}
  </StrictMode>
);