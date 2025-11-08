
import React, { useState, useEffect } from 'react';

interface CircularProgressProps {
  percentage: number;
  colorStart: string;
  colorEnd: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  colorStart,
  colorEnd,
}) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    setOffset(progressOffset);
  }, [percentage, circumference]);

  const gradientId = `progressGradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
        </defs>
        <circle
          className="text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-primary-text text-2xl font-bold">{`${percentage}%`}</span>
      </div>
    </div>
  );
};

export default CircularProgress;
