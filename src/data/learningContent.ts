import { openRedirect } from './openRedirect';
import { sqlInjection } from './sqlInjection';
import { xss } from './xss';
import { csrf } from './csrf';
import { commandInjection } from './commandInjection'; // [!code ++]
import type { LearningTopic } from '../types/learning';

export const learningTopics: { [key: string]: LearningTopic } = {
  xss,
  'open-redirect': openRedirect,
  'sql-injection': sqlInjection,
  csrf: csrf,
  'command-injection': commandInjection, // [!code ++]
};
