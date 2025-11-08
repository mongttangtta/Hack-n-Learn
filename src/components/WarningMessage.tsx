import { AlertTriangle } from 'lucide-react';
import React from 'react';

interface WarningMessageProps {
  message?: string;
}

const WarningMessage: React.FC<WarningMessageProps> = ({ message }) => {
  const defaultMessage = (
    <>
      <br />
      이 코드는 교육 목적 전용입니다. 절대 인터넷에 올리거나 타인 대상 테스트에
      사용하지 마세요.
      <br />
      실습은 반드시 로컬(localhost / 127.0.0.1)에서만 하세요.
      <br />
      flask 실행방법은 자료실을 참고하세요.
    </>
  );

  return (
    <div
      className="bg-red-400/20 border border-red-400 text-red-400 px-4 py-3 rounded-lg relative mb-10 text-center"
      role="alert"
    >
      <div className="flex justify-center items-center mb-2">
        <AlertTriangle className="w-6 h-6 mr-2" />
        <strong className="font-bold text-h2">경고</strong>
      </div>
      <span className="block">{message || defaultMessage}</span>
    </div>
  );
};

export default WarningMessage;
