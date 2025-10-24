
import { Routes, Route } from 'react-router-dom';
import LearningPageDetail from './pages/LearningPageDetail';
import LearningPageQuiz from './pages/LearningPageQuiz';
import LearningPageQuizResult from './pages/LearningPageQuizResult';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LearningPageDetail />} />
      <Route path="/learningPageQuiz" element={<LearningPageQuiz />} />
      <Route path="/quiz-results" element={<LearningPageQuizResult />} />
    </Routes>
  );
}
