import axios from 'axios';
import type {
  ProblemDetailApiResponse,
  ProblemSubmissionResponse,
  HintRequestResponse,
  EventAnalysisResponse,
  LabStartResponse,
  LabStopResponse,
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

  getContainerEvents: async (slug: string): Promise<EventAnalysisResponse> => {
    const response = await axios.get<EventAnalysisResponse>(
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

  stopLab: async (slug: string): Promise<LabStopResponse> => {
    const response = await axios.post<LabStopResponse>(
      `/api/problems/${slug}/stop-lab`
    );
    return response.data;
  },

  resetProblemState: async (slug: string): Promise<{ success: boolean; message?: string }> => {
    const response = await axios.post<{ success: boolean; message?: string }>(
      `/api/problems/${slug}/reset`
    );
    return response.data;
  },
};
