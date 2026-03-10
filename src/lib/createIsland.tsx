import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { ComponentType } from "react";

// Astro 아일랜드 패턴: 컴포넌트를 QueryClientProvider로 감싸 React Query 캐시를 주입
export function createIsland<P extends Record<string, unknown>>(Component: ComponentType<P>) {
  function Island(props: P) {
    return (
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>
    );
  }
  Island.displayName = `Island(${Component.displayName || Component.name || "Component"})`;
  return Island;
}
