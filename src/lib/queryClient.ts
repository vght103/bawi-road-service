import { QueryClient } from "@tanstack/react-query";

// 전역 React Query 클라이언트
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      retry: 1,
    },
  },
});
