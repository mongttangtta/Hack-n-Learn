export interface ProblemDetail {
  _id: string;
  goals: string[];
  scenario: string;
}

export interface ProblemDetailApiResponse {
  message: string;
  success: boolean;
  data: ProblemDetail;
}

export interface ProblemSubmissionResponse {
  success: boolean;
  message?: string;
  earnedScore?: number;
}

export interface Hint {
  type: 'text' | 'image'; // Assuming 'text' is one type, can be others.
  content: string;
}

export interface HintRequestData {
  hints: Hint[];
  penaltyApplied: number;
  totalPenalty: number;
  usedHint: number;
  remainingPotentialScore: number;
}

export interface HintRequestResponse {
  success: boolean;
  data: HintRequestData;
  message?: string; // Still useful for error messages
}

export interface ContainerEvent {
  _id: string;
  timestamp: string;
  type: string;
  details: string;
}

export interface EventLogResponse {
  success: boolean;
  data: ContainerEvent[];
  message?: string;
}

export interface LabStartResponse {
  success: boolean;
  message?: string;
  url: string;
  port?: number;
  expiresAt?: string;
}

export interface LabStopResponse {
  success: boolean;
  message?: string;
}
