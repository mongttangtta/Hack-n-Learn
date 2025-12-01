import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { learningTopics } from '../data/learningContent';
import heroImage from '../assets/images/이론학습.png';
import HeroSection from '../components/HeroSection';
import ElectricBorder from '../components/ElectricBorder';
import { useAuthStore } from '../store/authStore'; // Import useAuthStore
import axios from 'axios'; // Import axios for API call
import { Check } from 'lucide-react';
import Spinner from '../components/Spinner';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: '쉬워요' | '보통' | '어려워요';
  isCompleted?: boolean;
  isInProgress?: boolean;
  onCardClick?: (id: string) => void;
}

interface QuizProgressPart {
  techniqueId: string;
  slug: string;
  title: string;
  solvedCount: number;
  totalCount: number;
  progress: number;
  status: 'not_started' | 'in_progress' | 'solved';
}

interface MyPageQuizProgress {
  summary: {
    totalQuizzes: number;
    solvedQuizzes: number;
    progress: number;
  };
  parts: QuizProgressPart[];
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  difficulty,
  isCompleted,
  isInProgress,
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

  const CardContent = () => (
    <>
      <div className="grow">
        <h3 className="text-2xl font-bold text-primary-text mb-2 flex items-center">
          {title}{' '}
          {(isInProgress || isCompleted) && (
            <Check className="text-accent-primary1 ml-2" />
          )}
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
    </>
  );

  if (isCompleted) {
    return (
      <ElectricBorder
        color="#7df9ff"
        speed={1}
        chaos={0.5}
        thickness={2}
        style={{ borderRadius: 16 }}
      >
        <button
          className="cursor-pointer p-6 rounded-lg text-left w-full h-full flex flex-col "
          onClick={() => onCardClick && onCardClick(id)}
        >
          <CardContent />
        </button>
      </ElectricBorder>
    );
  }

  return (
    <button
      className="bg-card-background p-6 rounded-lg border-2 border-edge text-left w-full h-full flex flex-col transition-transform duration-300 hover:scale-105"
      onClick={() => onCardClick && onCardClick(id)}
    >
      <CardContent />
    </button>
  );
};

export default function LearningPageMain() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userQuizProgress, setUserQuizProgress] =
    useState<MyPageQuizProgress | null>(null);
  const [loadingQuizProgress, setLoadingQuizProgress] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!isAuthenticated) {
        setLoadingQuizProgress(false);
        setUserQuizProgress(null);
        return;
      }

      try {
        setLoadingQuizProgress(true);
        const response = await axios.get('/api/mypage');
        if (response.data.success && response.data.data.quizProgress) {
          setUserQuizProgress(response.data.data.quizProgress);
        } else {
          setUserQuizProgress(null);
        }
      } catch (error) {
        console.error('Failed to fetch user quiz progress:', error);
        setUserQuizProgress(null);
      } finally {
        setLoadingQuizProgress(false);
      }
    };

    fetchUserProgress();
  }, [isAuthenticated]);

  const courses = Object.values(learningTopics).map((topic) => {
    const progressPart = userQuizProgress?.parts.find(
      (part) => part.slug === topic.id
    );
    const isCompleted = progressPart?.status === 'solved';
    const isInProgress = progressPart?.status === 'in_progress';
    return {
      isInProgress: isInProgress,
      id: topic.id,
      title: topic.title,
      description: topic.description,
      difficulty: topic.difficulty,
      isCompleted: isCompleted,
    };
  });

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = (id: string) => {
    navigate(`/learning/${id}`);
  };

  if (loadingQuizProgress && isAuthenticated) {
    return <Spinner fullScreen />;
  }

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
