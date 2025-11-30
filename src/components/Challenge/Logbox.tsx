// src/components/LogBox.tsx

import React from 'react';
import type { LogEntry } from '../../types/logs'; // 타입 import

interface LogBoxProps {
  logs: LogEntry[];
}

const LogBox: React.FC<LogBoxProps> = ({ logs }) => {
  // 로그 타입에 따라 텍스트 색상을 결정
  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'feedback':
        return 'text-accent-warning'; // 피드백 (오답)
      case 'hint':
        return 'text-secondary-text'; // 힌트 본문
      case 'action':
        return 'text-accent-primary1'; // 힌트 요청 액션
      default:
        return 'text-primary-text';
    }
  };

  return (
    <div className="mt-8 bg-code-bg rounded-[10px] p-6 border border-edge min-h-[150px]">
      {logs.length === 0 ? (
        <p className="text-gray-500 text-left">
          힌트 또는 정답 피드백이 여기에 표시됩니다.
        </p>
      ) : (
        <ul className="space-y-2">
          {logs.map((log, index) => (
            <li key={index} className={`font-mono ${getLogColor(log.type)}`}>
              {log.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LogBox;
