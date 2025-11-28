export interface PostType {
  _id: string;
  name: string;
}

export interface PostAuthor {
  _id: string;
  username?: string;
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

export interface PaginatedPosts {
  items: Post[];
  total: number;
  page: string;
  limit: string;
  totalPages: number;
}
