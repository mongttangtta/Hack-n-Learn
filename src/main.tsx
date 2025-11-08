import { StrictMode } from 'react';
import './styles/index.css';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { setupAxiosInterceptor } from './utils/axiosInterceptor'; // Import the interceptor setup

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;
setupAxiosInterceptor(); // Set up the Axios interceptor

// Import all page components
import App from './App';
import LearningPageDetail from './pages/LearningPageDetail';
import LearningPageQuiz from './pages/LearningPageQuiz';
import LearningPageQuizResult from './pages/LearningPageQuizResult';
import LearningPageMain from './pages/LearningPageMain';
import ChallengePage from './pages/ChallengePage';
import ChallengeDetailPage from './pages/ChallengeDetailPage';
import AboutPage from './pages/AboutPage';
import CommunityPage from './pages/CommunityHome';
import SecurityNews from './pages/community/SecurityNews';
import QnaBoard from './pages/community/QnaBoard';
import Archive from './pages/community/Archive';
import CommunityPostDetailPage from './pages/CommunityPostDetailPage';
import RankingPage from './pages/RankingPage';
import MyPage from './pages/MyPage';

import SignupPage from './pages/auth/SignupPage';
import ChallengeResultPage from './pages/ChallengeResultPage'; // Import ChallengeResultPage
import QnaDetailPage from './pages/QnaDetailPage';
import LoginPage from './pages/auth/LoginPage';
import PasswordResetPage from './pages/auth/PasswordResetPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import FindIdPage from './pages/auth/FindIdPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LearningPageMain /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'learning', element: <LearningPageMain /> },
      { path: 'learning-detail', element: <LearningPageDetail /> },
      { path: 'learning/quiz', element: <LearningPageQuiz /> },
      { path: 'learning/quiz-results', element: <LearningPageQuizResult /> },
      { path: 'challenge', element: <ChallengePage /> },
      { path: 'challenge/:id', element: <ChallengeDetailPage /> },
      { path: 'challenge/result', element: <ChallengeResultPage /> },
      {
        path: 'community',
        element: <CommunityPage />,
        children: [
          { index: true, element: <SecurityNews /> },
          { path: 'qna', element: <QnaBoard /> },
          { path: 'qna/:id', element: <QnaDetailPage /> },
          { path: 'archive', element: <Archive /> },
          { path: ':id', element: <CommunityPostDetailPage /> },
        ],
      },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'find-id', element: <FindIdPage /> },
      { path: 'password-reset', element: <PasswordResetPage /> },
      { path: 'change-password', element: <ChangePasswordPage /> },
      { path: 'mypage', element: <MyPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
