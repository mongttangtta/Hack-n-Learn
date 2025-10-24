// src/types/quiz.ts

export interface Problem {
  id: number;
  category: string;
  question: string;
  /**
   * 'input'은 정답/해설만 보여주는 유형
   * 'multiple-choice'는 선택지를 제공하는 유형
   */
  type: 'input' | 'multiple-choice';
  options?: string[]; // 'multiple-choice' 유형일 때만 사용
  correctAnswer: string; // "정답:" 텍스트
  correctOptionIndex?: number; // 'multiple-choice'의 정답 인덱스
  explanation: string; // "해설:" 텍스트
  points: number;
}
