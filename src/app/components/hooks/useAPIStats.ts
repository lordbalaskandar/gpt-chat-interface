// src/hooks/useApiUsage.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axiosInstance';
import { CallsLeftResponse } from '@/types/stats';

export function useLLMCallsLeft() {
  return useQuery<number>({
    queryKey: ['llmCallsLeft'],
    queryFn: async () => {
      const res = await api.get<CallsLeftResponse>('/n_llm_calls_left');
      return res.data.calls_left;
    },
  });
}

export function useApiCallsLeft() {
  return useQuery<number>({
    queryKey: ['apiCallsLeft'],
    queryFn: async () => {
      const res = await api.get<CallsLeftResponse>('/n_api_calls_left');
      return res.data.calls_left;
    },
  });
}
