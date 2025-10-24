// src/components/quiz/AnswerBlock.tsx

import React from 'react';

interface AnswerBlockProps {
  answer: string;
  explanation: string;
}

const AnswerBlock: React.FC<AnswerBlockProps> = ({ answer, explanation }) => {
  return (
    <div className="mt-6 pt-6 border-t border-edge text-left">
      <p className="text-white font-bold mb-2">
        정답: <span className="font-normal text-primary-text">{answer}</span>
      </p>
      <p className="text-white font-bold">
        해설:{' '}
        <span className="font-normal text-primary-text">{explanation}</span>
      </p>
    </div>
  );
};

export default AnswerBlock;
