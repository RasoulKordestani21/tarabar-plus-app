// utils/queryClient.js
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
        return failureCount < 2;
      },
      // Don't refetch on window focus to avoid unnecessary requests
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 1
    }
  }
});

// Function to cancel and clear all queries
export const clearAllQueries = () => {
  queryClient.cancelQueries();
  queryClient.clear();
};

// Function to disable all queries
export const disableAllQueries = () => {
  queryClient.cancelQueries();
  queryClient.removeQueries();
};
