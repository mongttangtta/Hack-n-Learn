// src/pages/ProblemPage.tsx

import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import type { Problem } from '../types/quiz';
import ProblemCard from '../components/quiz/problemCard';
import Header from '../layout/Header';
import HeroSection from '../components/HeroSection';
import Button from '../components/Button';
import HeroImg from '../assets/images/이론학습 상세.png';

// 이미지에 나온 데이터를 기반으로 한 예시 데이터
const problemsData: Problem[] = [
  {
    id: 1,
    category: '분류',
    question:
      '[[공격자가 게시판에 스크립트를 저장해 다른 사용자가 볼 때 실행된다.]] 이 설명에 해당하는 XSS 종류는?',
    type: 'input',
    correctAnswer: '저장형(Stored) XSS.',
    explanation:
      '공격자가 서버(DB 등)에 악성 스크립트를 영구 저장 → 다른 사용자에게 전달되어 실행됨.',
    points: 10,
  },
  {
    id: 2,
    category: '분류',
    question:
      '[[공격자가 피해자에게 특수한 URL을 보내, 피해자가 그 URL을 클릭하면 스크립트가 즉시 실행된다.]] 이 설명에 해당하는 XSS 종류는?',
    type: 'input',
    correctAnswer: '반사형(Reflected) XSS.',
    explanation:
      '요청 파라미터가 서버 응답에 그대로 반영되어 즉시 실행되는 형태.',
    points: 10,
  },
  {
    id: 4,
    category: '출력 컨텍스트',
    question:
      '다음 중 HTML 본문(보이는 텍스트)에 사용자 입력을 출력할 때 가장 적절한 처리는?',
    type: 'multiple-choice',
    options: [
      'A) innerHTML에 그대로 넣기',
      'B) 템플릿 엔진의 자동 이스케이프 사용 또는 textContent로 넣기',
    ],
    correctAnswer: 'B',
    correctOptionIndex: 1, // B는 1번 인덱스
    explanation:
      'HTML 엔티티 이스케이프 또는 textContent를 넣어 태그 해석을 방지해야 안전.',
    points: 10,
  },
];

export default function LearningPageQuiz() {
  const navigate = useNavigate();
  const [submittedProblems, setSubmittedProblems] = useState<{ [key: number]: boolean }>({});

  const handleProblemSubmit = (problemId: number, isSubmitted: boolean) => {
    setSubmittedProblems((prev) => ({ ...prev, [problemId]: isSubmitted }));
  };

  const allProblemsSubmitted = problemsData.every(
    (problem) => submittedProblems[problem.id]
  );

  const handleCheckResults = () => {
    navigate('/quiz-results');
  };

  return (
    <>
      <Header />
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
