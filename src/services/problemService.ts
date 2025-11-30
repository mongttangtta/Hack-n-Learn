import axios from 'axios';
import type {
  ProblemDetailApiResponse,
  ProblemSubmissionResponse,
  HintRequestResponse,
  EventLogResponse,
  LabStartResponse,
} from '../types/problem';

export const problemService = {
  getProblemDetail: async (slug: string): Promise<ProblemDetailApiResponse> => {
    const response = await axios.get<ProblemDetailApiResponse>(
      `/api/problems/${slug}`
    );
    return response.data;
  },

  submitProblemFlag: async (
    slug: string,
    flag: string
  ): Promise<ProblemSubmissionResponse> => {
    const response = await axios.post<ProblemSubmissionResponse>(
      `/api/problems/${slug}/submit`,
      { flag }
    );
    return response.data;
  },

  requestProblemHint: async (
    slug: string,
    stage: number
  ): Promise<HintRequestResponse> => {
    const response = await axios.post<HintRequestResponse>(
      `/api/problems/${slug}/request-hint`,
      { stage }
    );
    return response.data;
  },

  getContainerEvents: async (slug: string): Promise<EventLogResponse> => {
    const response = await axios.get<EventLogResponse>(
      `/api/problems/${slug}/events`
    );
    return response.data;
  },

  startLab: async (slug: string): Promise<LabStartResponse> => {
    const response = await axios.post<LabStartResponse>(
      `/api/problems/${slug}/start-lab`
    );
    return response.data;
  },
};
