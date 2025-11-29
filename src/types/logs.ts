// src/types/logs.ts

/**
 * 로그 박스에 표시될 항목의 타입
 * - hint: AI가 제공하는 힌트
 * - feedback: 사용자의 정답 제출 결과 (성공/실패)
 * - action: 사용자가 수행한 행동 (예: 힌트 요청)
 */
export type LogType = 'hint' | 'feedback' | 'action' | 'info';

export interface LogEntry {
  type: LogType;
  text: string;
  cost: number;
}

// 힌트 데이터베이스용 타입
export interface HintData {
  level: number;
  text: string;
  cost: number;
}
