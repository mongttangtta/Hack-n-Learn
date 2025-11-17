import React, { useState } from 'react';
import Input from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { learningTopics } from '../data/learningContent'; // Import the data
import heroImage from '../assets/images/이론학습.png';
import HeroSection from '../components/HeroSection';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: '쉬워요' | '보통' | '어려워요';
  isCompleted?: boolean;
  onCardClick?: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  difficulty,
  isCompleted,
  onCardClick,
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
      onClick={() => onCardClick && onCardClick(id)}
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

export default function LearningPageMain() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Generate courses from the learningTopics data
  const courses = Object.values(learningTopics).map((topic) => ({
    id: topic.id,
    title: topic.title,
    description: topic.description,
    difficulty: topic.difficulty,
    isCompleted: topic.isCompleted,
  }));

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = (id: string) => {
    navigate(`/learning/${id}`);
  };

  return (
    <div className=" min-h-screen text-primary-text">
      <HeroSection
        imageUrl={heroImage}
        title="이론학습"
        subtitle="실습에 앞서, 해킹과 보안의 핵심 이론을 마스터하세요. 아는 만큼 보이고, 보이는 만큼 공격하고 방어할 수 있습니다."
      />

      <div className="container mx-auto max-w-[1440px] px-10">
        <section className="my-12">
          <div className="max-w-full mx-auto">
            <Input
              placeholder="원하시는 강의가 있나요?"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </section>

        <main className="pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
