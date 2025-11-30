export interface LinkedAccounts {
  google: {
    id: string | null;
    email: string | null;
  };
  github: {
    id: string | null;
    email: string | null;
  };
}

export interface Profile {
  _id: string;
  nickname: string;
  linkedAccounts: LinkedAccounts;
  tier: string;
  points: number;
  isProfileComplete: boolean;
  createdAt: string;
  lastLogin: string;
  profileImageUrl: string;
  profileImageKey: string;
  titles?: string[]; // Made optional, as it wasn't in the raw profile
  rank?: number; // Added from ranking service, not in initial API response
}

export interface QuizPart {
  techniqueId: string;
  title: string;
  progress: number;
  slug: string;
  solvedCount: number;
  totalCount: number;
  status: string;
}

export interface QuizProgress {
  summary: {
    totalQuizzes: number;
    solvedQuizzes: number;
    progress: number;
  };
  parts: QuizPart[];
}

export interface PracticeProblem {
  _id: string;
  slug: string;
  score: number;
  answerRate: number;
  isActive: boolean;
}

export interface PracticeItem { // This is for /api/mypage data.
  _id: string;
  user: string;
  problem: PracticeProblem;
  penalty: number;
  userHints: number;
  score: number;
  result: string;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeItemRaw { // This is for /api/mypage/profile raw practice data
  _id: string;
  user: string;
  problem: string; // This is an ID, not an object like in MyPageData's PracticeItem
  penalty: number;
  userHints: number;
  score: number;
  result: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface QuizItemRaw { // This is for /api/mypage/profile raw quiz data
  _id: string;
  quizId: string;
  userId: string;
  __v: number;
  attempts: number;
  createdAt: string;
  lastAnswer: string;
  lastAnsweredAt: string;
  lastCorrect: boolean;
  status: string;
  techniqueId: string;
  updatedAt: string;
}

export interface TypeStat {
  total: number;
  successCount: number;
  type: string;
  progress: number;
}

export interface Practice { // This is for /api/mypage data.
  total: number;
  successCount: number;
  successRate: number;
  typeStats: TypeStat[];
  practiceList: PracticeItem[];
}

export interface MyPageData { // This is for /api/mypage data.
  profile: Profile;
  practice: Practice;
  quizProgress: QuizProgress;
}

export interface MyPageProfileResponse { // This is for /api/mypage/profile data.
  profile: Profile;
  practice: PracticeItemRaw[];
  quiz: QuizItemRaw[];
}