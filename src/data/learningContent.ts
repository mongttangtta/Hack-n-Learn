import { openRedirect } from './openRedirect';
import { sqlInjection } from './sqlInjection';
import { xss } from './xss';
import { csrf } from './csrf';
import { commandInjection } from './commandInjection';
import { directoryTraversal } from './directoryTraversal';
import { fileUpload } from './fileUpload'; // [!code ++]
import type { LearningTopic } from '../types/learning';

export const learningTopics: { [key: string]: LearningTopic } = {
  xss,
  'open-redirect': openRedirect,
  'sql-injection': sqlInjection,
  csrf: csrf,
  'directory-traversal': directoryTraversal,
  'command-injection': commandInjection,
  'file-upload': fileUpload, // [!code ++]
};
