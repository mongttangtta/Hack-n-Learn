export interface RankingUser {
  rank: number;
  nickname: string;
  tier: string;
  points: number;
  titles?: string[]; // Added titles
}

export interface RankingResponse {
  success: boolean;
  data: {
    users: RankingUser[];
    totalUsers: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface MyRankingResponse {
  success: boolean;
  data: RankingUser;
}
