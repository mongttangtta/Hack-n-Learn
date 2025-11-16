export type InlineContent = string | { type: 'code'; text: string };

export type NestedListItem = {
  content: InlineContent[];
  subItems?: InlineContent[][];
};

export type ContentBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'h4'; text: string }
  | { type: 'p'; content: InlineContent[] }
  | { type: 'ul'; items: InlineContent[][] }
  | { type: 'nested-list'; items: NestedListItem[] }
  | { type: 'code'; text: string }
  | { type: 'hr' }
  | { type: 'checklist'; items: InlineContent[][] }
  | {
      type: 'grid';
      items: {
        title: string;
        text: string;
        footer: string;
        isToggle?: boolean;
        details?: ContentBlock[];
      }[];
    }
  | { type: 'warning'; message?: string }
  | { type: 'principle'; text: string };

export interface LearningTopic {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  difficulty: '쉬워요' | '보통' | '어려워요';
  isCompleted?: boolean;
  content: ContentBlock[];
}
