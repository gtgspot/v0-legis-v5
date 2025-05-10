import useSWR from "swr"
import { fetchFrameworkData, fetchCaseLaw, fetchCaseLawByRule } from "./api"

// Custom hook for fetching framework data
export function useFrameworkData() {
  const { data, error, isLoading, mutate } = useSWR("framework", fetchFrameworkData, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
  })

  return {
    framework: data,
    isLoading,
    isError: error,
    mutate,
  }
}

// Custom hook for fetching case law data
export function useCaseLaw(searchTerm = "") {
  const { data, error, isLoading, mutate } = useSWR(["caseLaw", searchTerm], () => fetchCaseLaw(searchTerm), {
    revalidateOnFocus: true,
  })

  return {
    caseLaw: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Custom hook for fetching case law by rule ID
export function useCaseLawByRule(ruleId: string) {
  const { data, error, isLoading } = useSWR(
    ruleId ? ["caseLawByRule", ruleId] : null,
    () => fetchCaseLawByRule(ruleId),
    {
      revalidateOnFocus: true,
    },
  )

  return {
    caseLaw: data || [],
    isLoading,
    isError: error,
  }
}
