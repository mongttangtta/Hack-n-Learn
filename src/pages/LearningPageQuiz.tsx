// src/pages/ProblemPage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Problem } from '../types/quiz';

import HeroSection from '../components/HeroSection';
import Button from '../components/Button';
import HeroImg from '../assets/images/이론학습 상세.png';
import ProblemCard from '../components/quiz/ProblemCard';
import { quizService } from '../services/quizService'; // Import the quizService

export default function LearningPageQuiz() {
  const navigate = useNavigate();
  const { topicId } = useParams<{ topicId: string }>();
  const [problemsData, setProblemsData] = useState<Problem[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizProblems = async () => {
      if (!topicId) {
        setError("No topic ID provided.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await quizService.getQuizBySlug(topicId);
        setProblemsData(data);
      } catch (err) {
        setError("Failed to load quiz problems.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizProblems();
  }, [topicId]);

  const [submittedProblems, setSubmittedProblems] = useState<{
    [key: number]: boolean;
  }>({});

  const handleProblemSubmit = (problemId: number, isSubmitted: boolean) => {
    setSubmittedProblems((prev) => ({ ...prev, [problemId]: isSubmitted }));
  };

  const allProblemsSubmitted = problemsData?.every(
    (problem) => submittedProblems[problem.id]
  );

  const handleCheckResults = () => {
    navigate('/learning/quiz-results');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-10 flex items-center justify-center">
        <p className="text-2xl text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-10 flex items-center justify-center">
        <p className="text-2xl text-red-600">{error}</p>
      </div>
    );
  }

  if (!problemsData || problemsData.length === 0) {
    return (
      <div className="min-h-screen py-12 px-10 flex items-center justify-center">
        <p className="text-2xl text-gray-600">No quiz found for topic: {topicId}</p>
      </div>
    );
  }

  return (
    <>
      <HeroSection title="개념확인퀴즈" imageUrl={HeroImg} />
      <div className="min-h-screen py-12 px-10">
        <div className="max-w-[1440px] mx-auto">
          {problemsData.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onProblemSubmit={handleProblemSubmit}
            />
          ))}
          <div className="flex justify-center mt-8">
            <Button
              variant="primary"
              onClick={handleCheckResults}
              className=""
              disabled={!allProblemsSubmitted}
            >
              결과확인
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
