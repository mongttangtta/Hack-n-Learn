import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HeroSection from '../components/HeroSection';
import Input from '../components/Input';
import HeroImg from '../assets/images/실전문제.jpg'; // Assuming an image for practical problems

const ChallengePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    ('쉬워요' | '보통' | '어려워요')[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCompletionStatus, setSelectedCompletionStatus] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(10); // You can adjust this value
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

  interface ProblemCardProps {
    id: string;

    title: string;

    difficulty: '쉬워요' | '보통' | '어려워요';

    accuracy: string;

    isSolved: boolean;
  }

  const ProblemCard: React.FC<ProblemCardProps> = ({
    id,
    title,

    difficulty,

    accuracy,

    isSolved,
  }) => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate(`/challenge/${id}`);
    };

    return (
      <div
        className="grid grid-cols-[auto_1fr_auto_auto] gap-20 items-center text-primary-text cursor-pointer hover:bg-card-hover-background transition-colors duration-200"
        onClick={handleClick}
      >
        <span>{isSolved ? '✅' : '❌'}</span>

        <span>{title}</span>

        <div className="flex items-center">
          <span className="text-primary-text font-bold mr-2">{difficulty}</span>

          <span className={`${difficultyColors[difficulty]}`}>
            {difficultyIcons[difficulty]}
          </span>
        </div>

        <span>{accuracy}</span>
      </div>
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDifficultyChange = (
    difficulty: '쉬워요' | '보통' | '어려워요'
  ) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleCompletionStatusChange = (status: string) => {
    setSelectedCompletionStatus((prev) => (prev === status ? null : status));
  };

  const problems: ProblemCardProps[] = [
    {
      id: '1',

      title: 'XSS (Cross-Site Scripting) - Reflected',

      difficulty: '쉬워요',

      accuracy: '85%',

      isSolved: true,
    },

    {
      id: '2',

      title: 'SQL Injection - UNION 공격',

      difficulty: '보통',

      accuracy: '62%',

      isSolved: false,
    },

    {
      id: '3',

      title: 'XSS (Cross-Site Scripting) - Stored',

      difficulty: '쉬워요',

      accuracy: '58%',

      isSolved: true,
    },

    {
      id: '4',

      title: 'XSS (Cross-Site Scripting) - Reflected',

      difficulty: '보통',

      accuracy: '75%',

      isSolved: false,
    },

    {
      id: '5',

      title: 'Command Injection - 기본',

      difficulty: '어려워요',

      accuracy: '80%',

      isSolved: false,
    },

    {
      id: '6',

      title: 'CSRF (Cross-Site Request Forgery) - 토큰 분석',

      difficulty: '어려워요',

      accuracy: '35%',

      isSolved: false,
    },

    {
      id: '7',

      title: 'File Upload - 확장자 우회',

      difficulty: '쉬워요',

      accuracy: '48%',

      isSolved: true,
    },

    {
      id: '8',

      title: 'Blind SQL Injection - Boolean Based',

      difficulty: '어려워요',

      accuracy: '25%',

      isSolved: false,
    },

    {
      id: '9',

      title: 'Buffer Overflow - Basic',

      difficulty: '어려워요',

      accuracy: '45%',

      isSolved: false,
    },
  ];

  const filteredProblems = problems.filter((problem) => {
    const matchesSearchTerm = problem.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      selectedDifficulties.length === 0 ||
      selectedDifficulties.includes(problem.difficulty);

    // For categories, we need to check if the problem title contains any of the selected categories.
    // This is a simplified approach; a more robust solution would involve adding a 'category' property to ProblemCardProps.
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((category) =>
        problem.title.toLowerCase().includes(category.toLowerCase())
      );

    const matchesCompletionStatus =
      selectedCompletionStatus === null ||
      (selectedCompletionStatus === 'completed' && problem.isSolved) ||
      (selectedCompletionStatus === 'incomplete' && !problem.isSolved);

    return (
      matchesSearchTerm &&
      matchesDifficulty &&
      matchesCategory &&
      matchesCompletionStatus
    );
  });

  // Pagination Logic
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );

  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <HeroSection
        title="실전 문제"
        imageUrl={HeroImg}
        subtitle="가상 세계의 방어선을 뚫고 목표를 쟁취하세요. 모든 공격과 방어의 흔적이 당신의 경험이 됩니다."
      />
      <div className="min-h-screen py-12 px-10">
        <div className="max-w-[1440px] mx-auto">
          {/* Search Bar */}
          <section className="mb-12">
            <div className="max-w-full mx-auto">
              <Input
                placeholder="원하시는 문제가 있나요?"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </section>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filter Section */}
            <aside className="w-full md:w-1/4 bg-card-background p-6 rounded-lg border-2 border-edge shadow-lg">
              <h3 className="text-xl font-bold text-primary-text mb-4">
                Filter
              </h3>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-primary-text mb-2">
                  난이도
                </h4>
                <label className="flex items-center text-primary-text mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedDifficulties.includes('쉬워요')}
                    onChange={() => handleDifficultyChange('쉬워요')}
                  />
                  <span className="w-5 h-5 border-2 border-edge rounded mr-2 flex items-center justify-center">
                    {selectedDifficulties.includes('쉬워요') && (
                      <span className="text-accent-primary1">✔</span>
                    )}
                  </span>
                  쉬워요 {difficultyIcons['쉬워요']}
                </label>
                <label className="flex items-center text-primary-text mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedDifficulties.includes('보통')}
                    onChange={() => handleDifficultyChange('보통')}
                  />
                  <span className="w-5 h-5 border-2 border-edge rounded mr-2 flex items-center justify-center">
                    {selectedDifficulties.includes('보통') && (
                      <span className="text-accent-caution">✔</span>
                    )}
                  </span>
                  보통 {difficultyIcons['보통']}
                </label>
                <label className="flex items-center text-primary-text mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedDifficulties.includes('어려워요')}
                    onChange={() => handleDifficultyChange('어려워요')}
                  />
                  <span className="w-5 h-5 border-2 border-edge rounded mr-2 flex items-center justify-center">
                    {selectedDifficulties.includes('어려워요') && (
                      <span className="text-accent-warning">✔</span>
                    )}
                  </span>
                  어려워요 {difficultyIcons['어려워요']}
                </label>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-primary-text mb-2">
                  카테고리
                </h4>
                <label className="flex items-center text-primary-text mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedCategories.includes('SQL Injection')}
                    onChange={() => handleCategoryChange('SQL Injection')}
                  />
                  <span className="w-5 h-5 border-2 border-edge rounded mr-2 flex items-center justify-center">
                    {selectedCategories.includes('SQL Injection') && (
                      <span className="text-accent-primary1">✔</span>
                    )}
                  </span>
                  SQL Injection
                </label>
                <label className="flex items-center text-primary-text mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedCategories.includes('XSS')}
                    onChange={() => handleCategoryChange('XSS')}
                  />
                  <span className="w-5 h-5 border-2 border-edge rounded mr-2 flex items-center justify-center">
                    {selectedCategories.includes('XSS') && (
                      <span className="text-accent-primary1">✔</span>
                    )}
                  </span>
                  XSS
                </label>
                <label className="flex items-center text-primary-text mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedCategories.includes('Command Injection')}
                    onChange={() => handleCategoryChange('Command Injection')}
                  />
                  <span className="w-5 h-5 border-2 border-edge rounded mr-2 flex items-center justify-center">
                    {selectedCategories.includes('Command Injection') && (
                      <span className="text-accent-primary1">✔</span>
                    )}
                  </span>
                  Command Injection
                </label>
              </div>
              <div>
                <h4 className="text-lg font-bold text-primary-text mb-2">
                  풀이 여부
                </h4>
                <label className="flex items-center text-primary-text mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedCompletionStatus === 'completed'}
                    onChange={() => handleCompletionStatusChange('completed')}
                  />
                  <span className="w-5 h-5 border-2 border-edge rounded mr-2 flex items-center justify-center">
                    {selectedCompletionStatus === 'completed' && (
                      <span className="text-accent-primary1">✔</span>
                    )}
                  </span>
                  풀이 완료
                </label>
                <label className="flex items-center text-primary-text mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedCompletionStatus === 'incomplete'}
                    onChange={() => handleCompletionStatusChange('incomplete')}
                  />
                  <span className="w-5 h-5 border-2 border-edge rounded mr-2 flex items-center justify-center">
                    {selectedCompletionStatus === 'incomplete' && (
                      <span className="text-accent-primary1">✔</span>
                    )}
                  </span>
                  미완료
                </label>
              </div>
            </aside>

            {/* Problem List */}
            <main className="w-full md:w-3/4 bg-card-background py-3 px-7 rounded-lg border-2 border-edge shadow-lg">
              <div className="grid gap-5" key={currentPage}>
                <div className="grid grid-cols-[auto_1fr_auto_auto] gap-20 items-center border-b border-edge pb-3">
                  <span className="text-secondary-text text-sm font-bold">
                    상태
                  </span>
                  <span className="text-secondary-text text-sm font-bold">
                    제목
                  </span>
                  <span className="text-secondary-text text-sm font-bold">
                    난이도
                  </span>
                  <span className="text-secondary-text text-sm font-bold">
                    정답률
                  </span>
                </div>
                {currentProblems.map((problem, index) => (
                  <React.Fragment key={problem.id}>
                    <ProblemCard {...problem} />
                    {index < currentProblems.length - 1 && (
                      <div className="border-b border-edge "></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-center mt-8">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? 'bg-accent-primary1 text-white'
                        : 'bg-card-background text-primary-text border border-edge'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChallengePage;
