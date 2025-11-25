// src/pages/ProblemPage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Problem, UserAnswer } from '../types/quiz'; // Import UserAnswer type

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

  // New states for tracking overall quiz progress and score
  const [totalEarnedPoints, setTotalEarnedPoints] = useState<number>(0);
  const [submittedProblemIds, setSubmittedProblemIds] = useState<Set<string>>(new Set());
  const [allUserAnswers, setAllUserAnswers] = useState<UserAnswer[]>([]); // New state to store all user answers
  const [previouslySolvedIds, setPreviouslySolvedIds] = useState<Set<string>>(
    new Set()
  );

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
        const [data, solvedIds] = await Promise.all([
          quizService.getQuizBySlug(topicId),
          quizService.getQuizProcess(topicId).catch(() => []),
        ]);

        setProblemsData(data);
        setPreviouslySolvedIds(new Set(solvedIds));
        // Reset states when new quiz is loaded
        setTotalEarnedPoints(0);
        setSubmittedProblemIds(new Set());
        setAllUserAnswers([]); // Reset user answers
      } catch (err) {
        setError("Failed to load quiz problems.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizProblems();
  }, [topicId]);

  // Modified handleProblemSubmit to track earned points and user answers
  const handleProblemSubmit = (
    problemId: string,
    earnedPoints: number,
    userAnswer: string
  ) => {
    if (!previouslySolvedIds.has(problemId)) {
      setTotalEarnedPoints((prev) => prev + earnedPoints);
    }
    setSubmittedProblemIds((prev) => new Set(prev).add(problemId));
    setAllUserAnswers((prev) => [...prev, { problemId, answer: userAnswer }]);
  };

  const allProblemsSubmitted = problemsData?.every(
    (problem) => submittedProblemIds.has(problem._id)
  );

  const handleCheckResults = () => {
    // Navigate to results page, passing relevant data including all user answers
    navigate('/learning/quiz-results', {
      state: {
        topicId: topicId, // Pass the topicId (slug) for explanation API call
        totalProblems: problemsData?.length || 0,
        totalEarnedPoints: totalEarnedPoints,
        allUserAnswers: allUserAnswers, // Pass all collected user answers
      },
    });
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
          {problemsData.map((problem, index) => (
            <ProblemCard
              key={problem._id}
              problem={problem}
              onProblemSubmit={handleProblemSubmit} // This will be updated to pass userAnswer
              problemNumber={index + 1}
              isSolved={previouslySolvedIds.has(problem._id)}
            />
          ))}
          <div className="flex justify-center mt-8">
            <Button
              variant="primary"
              onClick={handleCheckResults}
              className=""
              disabled={!allProblemsSubmitted} // Disable if not all answered
            >
              결과확인
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
