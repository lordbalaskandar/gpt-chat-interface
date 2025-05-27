import api from "@/api/axiosInstance";
import { SemanticQueryParams, SemanticResult, LLMResponseWithContext, LLMContextualSearchVariables, LLMResponse, LLMRegularQuestionVariables, Document} from "@/types/llm";
import { useMutation, useQuery } from "@tanstack/react-query";

const DEV_MODE = true;

export function useGetAllDocumentInfo() {
  return useQuery<Document[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await api.get<{ documents: Document[] }>('/get_all_document_info');
      return res.data.documents;
    },
  });
}

export function useSemanticQuery({ query, nChunks = 5, documentIds }: SemanticQueryParams) {
  return useQuery<SemanticResult[]>({
    queryKey: ['semanticQuery', query, nChunks, documentIds],
    queryFn: async () => {
      const res = await api.get<{ results: SemanticResult[] }>('/semantic_query', {
        params: {
          query,
          n_chunks_to_return: nChunks,
          ...(documentIds ? { document_ids: documentIds } : {}),
        },
      });
      return res.data.results;
    },
    enabled: !!query,
  });
}

export function useLLMContextualSearch() {
  return useMutation<LLMResponseWithContext, unknown, LLMContextualSearchVariables>({
    mutationFn: async ({
      query,
      chatHistory = [],
      documentIds,
      nChunks = 5,
      developMode = DEV_MODE,
    }) => {
      const params = new URLSearchParams({
        query,
        n_chunks_to_return: nChunks.toString(),
        develop_mode: developMode.toString(),
      });
      if (documentIds) {
        params.append('document_ids', JSON.stringify(documentIds));
      }

      const res = await api.post<LLMResponseWithContext>(`/llm_contextual_search?${params}`, {
        chat_history: chatHistory,
      });

      return res.data;
    },
  });
}

export function useLLMRegularQuestion() {
  return useMutation<LLMResponse, unknown, LLMRegularQuestionVariables>({
    mutationFn: async ({ query, chatHistory = [], developMode = DEV_MODE }) => {
      const params = new URLSearchParams({
        query,
        develop_mode: developMode.toString(),
      });

      const res = await api.post<LLMResponse>(`/llm_regular_question?${params}`, {
        chat_history: chatHistory,
      });

      return res.data;
    },
  });
}
