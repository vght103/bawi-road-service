import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { ComponentType } from "react";

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
