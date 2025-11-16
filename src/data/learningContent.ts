import { openRedirect } from './openRedirect';
import { sqlInjection } from './sqlInjection';
import { xss } from './xss';
import type { LearningTopic } from '../types/learning';

export const learningTopics: { [key: string]: LearningTopic } = {
  xss,
  'open-redirect': openRedirect,
  'sql-injection': sqlInjection,
};
