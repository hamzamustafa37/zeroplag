"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Toast from "@radix-ui/react-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toast.Provider swipeDirection="right">
        {children}
        <Toast.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-full outline-none" />
      </Toast.Provider>
    </QueryClientProvider>
  );
}
