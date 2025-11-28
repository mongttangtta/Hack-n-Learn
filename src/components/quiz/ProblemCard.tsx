// src/components/quiz/ProblemCard.tsx

import React, { useState } from 'react';
import type { Problem, SingleProblemCheckResponse } from '../../types/quiz'; // Import new type
import Button from '../Button';
import AnswerBlock from './AnswerBlock'; // Re-import AnswerBlock

interface ProblemCardProps {
  problem: Problem;
  problemNumber: number;
  onProblemSubmit: (
    problemId: string,
    earnedPoints: number,
    userAnswer: string
  ) => void; // Modified prop
  isSolved?: boolean;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  problemNumber,
  onProblemSubmit,
  isSolved,
}) => {
  const [selectedChoiceLabel, setSelectedChoiceLabel] = useState<string | null>(
    null
  );
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if this specific problem has been submitted
  const [isChecking, setIsChecking] = useState(false); // New state for API call loading
  const [checkResult, setCheckResult] =
    useState<SingleProblemCheckResponse | null>(null); // To store the result from the backend

  const handleSubmit = async () => {
    let answerToSubmit: string | null = null;
    if (problem.questionType === 'choice') {
      if (selectedChoiceLabel === null) {
        alert('답을 선택해주세요.');
        return;
      }
      // For choice questions, userAnswer is the label of the selected choice (e.g., "A", "B")
      answerToSubmit = selectedChoiceLabel;
    } else if (problem.questionType === 'short') {
      if (inputValue.trim() === '') {
        alert('답을 입력해주세요.');
        return;
      }
      answerToSubmit = inputValue;
    }

    if (answerToSubmit !== null) {
      setIsChecking(true);
      try {
        const { quizService } = await import('../../services/quizService'); // Dynamic import to avoid circular dependency
        const result = await quizService.checkProblemAnswer(
          problem._id,
          answerToSubmit
        );
        setCheckResult(result);
        setIsSubmitted(true);
        onProblemSubmit(problem._id, result.data.earned, answerToSubmit); // Pass problemId, earnedPoints, and userAnswer
      } catch (error) {
        console.error('Failed to check problem answer:', error);
        alert('정답 확인 중 오류가 발생했습니다.');
      } finally {
        setIsChecking(false);
      }
    }
  };

  const isSubmitDisabled = isSubmitted || isChecking; // Disable if already submitted or checking

  return (
    <div className="bg-card-background rounded-lg p-8 mb-6 border-2 border-edge shadow-lg">
      <h3 className="text-xl font-bold  mb-4 flex items-center">
        문제 {problemNumber} -{' '}
        {problem.questionType === 'short' ? '주관식' : '객관식'}
        {isSolved && (
          <span className="text-accent-primary1 text-sm ml-3 border border-accent-primary1 px-2 py-0.5 rounded-full">
            해결한 문제
          </span>
        )}
      </h3>
      <p className="text-lg text-gray-300 mb-6">
        {problem.questionParts.map((part, index) => {
          if (part.type === 'highlight') {
            return (
              <span key={index} className="text-code-keyword ">
                {part.content}
              </span>
            );
          }
          return <span key={index}>{part.content}</span>;
        })}
      </p>

      {problem.questionType === 'short' && (
        <textarea
          className="w-full bg-[#1E1E2E] border border-edge rounded-md p-4 text-secondary-text"
          rows={3}
          placeholder="정답을 입력하세요..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isSubmitDisabled}
        />
      )}

      {problem.questionType === 'choice' && (
        <div className="space-y-3">
          {problem.choices?.map((choice, index) => (
            <button
              key={index}
              onClick={() => setSelectedChoiceLabel(choice.label)}
              disabled={isSubmitDisabled}
              className={`
                w-full text-left p-4 rounded-md border-1 transition-colors
                ${
                  selectedChoiceLabel === choice.label
                    ? 'border-accent-primary1 bg-accent-primary1/30'
                    : 'border-edge bg-navigation '
                }
                ${isSubmitDisabled ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              <span className="text-gray-200">
                {choice.label}) {choice.content}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 text-right">
        {checkResult ? (
          checkResult.data.correct ? (
            <Button
              disabled
              variant="success"
              className="bg-accent-primary2 font-bold py-2 px-6 rounded-full cursor-default !w-auto !h-auto"
            >
              정답입니다! ({checkResult.data.earned}점 획득)
            </Button>
          ) : (
            <Button
              disabled
              variant="danger"
              className="bg-accent-warning font-bold py-2 px-6 rounded-full cursor-default !w-auto !h-auto"
            >
              오답입니다!
            </Button>
          )
        ) : (
          <Button
            onClick={handleSubmit}
            variant="primary"
            className="bg-accent-primary1 font-bold py-2 px-6 rounded-full hover:bg-accent-primary1 transition-colors !w-auto !h-auto"
            disabled={isSubmitDisabled}
          >
            {isChecking ? '확인 중...' : '정답 제출'}
          </Button>
        )}
      </div>

      {isSubmitted && checkResult && (
        <AnswerBlock
          answer={checkResult.data.correctAnswer} // Use answer from API response
          explanation={checkResult.data.explanation} // Use explanation from API response
        />
      )}
    </div>
  );
};

export default ProblemCard;
