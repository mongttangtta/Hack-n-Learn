// src/components/quiz/ProblemCard.tsx

import React, { useState } from 'react';
import type { Problem } from '../../types/quiz'; // 타입 import
import AnswerBlock from './AnswerBlock';
import Button from '../Button';

interface ProblemCardProps {
  problem: Problem;
  onProblemSubmit: (problemId: number, isSubmitted: boolean) => void;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onProblemSubmit }) => {
  // 1. 상태 관리: 제출 여부, 선택한 답
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');

  // 2. 정답 여부 판별
  // 'input' 타입은 정답 확인 즉시 '정답'으로 간주 (이미지 추론)
  // 'multiple-choice'는 선택한 답과 정답 인덱스를 비교
  const isCorrect =
    problem.type === 'input'
      ? inputValue.trim().toLowerCase() ===
        problem.correctAnswer.trim().toLowerCase()
      : selectedOption === problem.correctOptionIndex;

  // 3. 제출 핸들러
  const handleSubmit = () => {
    // 객관식인데 답을 선택하지 않았으면 경고
    if (problem.type === 'multiple-choice' && selectedOption === null) {
      alert('답을 선택해주세요.');
      return;
    } else if (problem.type === 'input' && inputValue.trim() === '') {
      alert('답을 입력해주세요.');
      return;
    }
    setIsSubmitted(true);
    onProblemSubmit(problem.id, true);
  };

  return (
    <div className="bg-card-background rounded-lg p-8 mb-6 border-2 border-edge shadow-lg">
      {/* 문제 헤더 */}
      <h3 className="text-xl font-bold text-white mb-4">
        문제 {problem.id} — {problem.category}
      </h3>
      <p className="text-lg text-gray-300 mb-6">
        {problem.question.split(/(\[\[.*?\]\])/g).map((part, index) => {
          if (part.startsWith('[[')) {
            return (
              <span key={index} className="text-code-keyword ">
                {part.substring(2, part.length - 2)}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </p>

      {/* 문제 유형별 UI */}
      {problem.type === 'input' && (
        <textarea
          className="w-full bg-[#1E1E2E] border border-gray-600 rounded-md p-4 text-gray-400"
          rows={3}
          placeholder="정답을 입력하세요..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      )}

      {problem.type === 'multiple-choice' && (
        <div className="space-y-3">
          {problem.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => !isSubmitted && setSelectedOption(index)}
              disabled={isSubmitted}
              className={`
                                        w-full text-left p-4 rounded-md border-1 transition-colors
                                        ${
                                          selectedOption === index
                                            ? 'border-accent-primary1 bg-accent-primary1/30' // 선택됨
                                            : 'border-edge bg-navigation '
                                        }
                                        ${
                                          isSubmitted
                                            ? 'opacity-70 cursor-not-allowed'
                                            : ''
                                        }
                                      `}
            >
              <span className="text-gray-200">{option}</span>
            </button>
          ))}
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="mt-6 text-right">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            variant="primary"
            className="bg-accent-primary1 text-white font-bold py-2 px-6 rounded-full hover:bg-accent-primary1 transition-colors !w-auto !h-auto"
          >
            정답/해설 확인
          </Button>
        ) : isCorrect ? (
          <Button
            disabled
            variant="success"
            className="bg-accent-primary2 text-white font-bold py-2 px-6 rounded-full cursor-default !w-auto !h-auto"
          >
            정답입니다! (10점 획득)
          </Button>
        ) : (
          <Button
            disabled
            variant="danger"
            className="bg-accent-warning text-white font-bold py-2 px-6 rounded-full cursor-default !w-auto !h-auto"
          >
            오답입니다!
          </Button>
        )}
      </div>

      {/* 정답/해설 블록 (제출 시에만 보임) */}
      {isSubmitted && (
        <AnswerBlock
          answer={problem.correctAnswer}
          explanation={problem.explanation}
        />
      )}
    </div>
  );
};

export default ProblemCard;
