export interface PostType {
  _id: string;
  name: string;
}

export interface PostAuthor {
  _id: string;
  nickname?: string;
}

export interface Post {
  _id: string;
  type: PostType;
  title: string;
  content: string;
  author: PostAuthor;
  views: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Comment {
  _id: string;
  postId: string;
  author: PostAuthor;
  content: string;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[]; // Added to support nested replies
}

export interface CreateCommentPayload {
  content: string;
}

export interface CreateReplyPayload {
  // New interface for replies
  content: string;
}

export interface PaginatedPosts {
  items: Post[];
  total: number;
  page: string;
  limit: string;
  totalPages: number;
}
