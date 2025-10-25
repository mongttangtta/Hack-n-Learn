import React, { useState } from 'react';
import Input from '../components/Input'; // Assuming Input component is in the same folder
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import heroImage from '../assets/images/이론학습.png';
import HeroSection from '../components/HeroSection';

interface CourseCardProps {
  title: string;
  description: string;
  difficulty: '쉬워요' | '보통' | '어려워요';
  isCompleted?: boolean;
  onCardClick: (title: string) => void; // Add onCardClick prop
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  difficulty,
  isCompleted,
  onCardClick, // Destructure onCardClick
}) => {
  const difficultyColors = {
    쉬워요: 'text-accent-primary1',
    보통: 'text-accent-warning',
    어려워요: 'text-accent-caution',
  };

  const difficultyIcons = {
    쉬워요: '😊',
    보통: '🤔',
    어려워요: '🥵',
  };

  return (
    <button
      className={`bg-card-background p-6 rounded-lg border-2 text-left w-full h-full flex flex-col transition-transform duration-300 hover:scale-105 ${
        isCompleted ? 'border-accent-primary1' : 'border-edge'
      }`}
      onClick={() => onCardClick(title)} // Use onCardClick prop
    >
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-primary-text mb-2">
          {title} {isCompleted && '[V]'}
        </h3>
        <p className="text-secondary-text mb-4">{description}</p>
      </div>
      <div className="flex justify-end items-center">
        <div className="flex items-center">
          <span className="text-primary-text font-bold mr-2">{difficulty}</span>
          <span className={`${difficultyColors[difficulty]}`}>
            {difficultyIcons[difficulty]}
          </span>
        </div>
      </div>
    </button>
  );
};

export default function LearningPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const courses: CourseCardProps[] = [
    {
      title: 'XSS (Cross-Site Scripting)',
      description:
        '사용자의 입력을 필터링하지 않고 그대로 출력할 때, 악성 스크립트를 삽입해 실행시키는 취약점.',
      difficulty: '쉬워요',
      isCompleted: true,
    },
    {
      title: 'Open Redirect (오픈 리다이렉션)',
      description:
        '정상 사이트의 URL을 이용해 공격자가 원하는 악성 사이트로 리다이렉트시키는 취약점.',
      difficulty: '쉬워요',
    },
    {
      title: 'SQL Injection (SQLi)',
      description:
        '입력값이 SQL 쿼리에 그대로 삽입되어, 공격자가 데이터베이스를 조작할 수 있는 취약점.',
      difficulty: '보통',
    },
    {
      title: 'CSRF (Cross-Site Request Forgery)',
      description:
        '사용자가 로그인된 상태에서, 공격자가 의도한 요청을 강제로 보내게 하는 공격.',
      difficulty: '보통',
    },
    {
      title: 'Directory Traversal (경로 조작)',
      description:
        '입력값으로 ../ 등을 사용해 원래 의도된 범위를 벗어난 파일에 접근하는 취약점.',
      difficulty: '어려워요',
    },
    {
      title: 'Command Injection (명령어 삽입)',
      description:
        '입력값이 서버의 시스템 명령어에 포함되어 임의의 명령 실행이 가능한 취약점.',
      difficulty: '어려워요',
    },
  ];

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const navigate = useNavigate(); // Initialize useNavigate

  const handleCardClick = (title: string) => {
    // For now, navigate to a generic detail page.
    // In a real app, you might pass an ID or slug based on the title.
    navigate('/learning-detail');
  };

  return (
    <div className=" min-h-screen text-primary-text">
      {/* Hero Section */}
      <HeroSection
        imageUrl={heroImage}
        title="이론학습"
        subtitle="실습에 앞서, 해킹과 보안의 핵심 이론을 마스터하세요. 아는 만큼 보이고, 보이는 만큼 공격하고 방어할 수 있습니다."
      />

      <div className="container mx-auto max-w-[1440px] px-20">
        {/* Search Bar */}
        <section className="mb-12">
          <div className="max-w-full mx-auto">
            <Input
              placeholder="원하시는 강의가 있나요?"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </section>

        {/* Courses Grid */}
        <main className="pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.title} {...course} onCardClick={handleCardClick} />
            ))}
          </div>
        </main>
      </div>

      {/* Footer or other sections can go here */}
    </div>
  );
}
