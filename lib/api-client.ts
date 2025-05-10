"use client"

import { useState } from "react"
import useSWR from "swr"

// Generic fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.")
    error.message = await res.text()
    throw error
  }

  return res.json()
}

// Hook for fetching rules
export function useRules(options?: { category?: string; status?: string }) {
  const { category, status } = options || {}

  let url = "/api/rules"
  const params = new URLSearchParams()

  if (category) params.append("category", category)
  if (status) params.append("status", status)

  if (params.toString()) {
    url += `?${params.toString()}`
  }

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    rules: data?.rules || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for fetching compliance status
export function useComplianceStatus() {
  const { data, error, isLoading, mutate } = useSWR("/api/compliance", fetcher)

  return {
    status: data || null,
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for handling form submission
export function useFormSubmit<T, R>(
  action: (data: T) => Promise<R>,
  options?: { onSuccess?: (data: R) => void; onError?: (error: any) => void },
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<any>(null)
  const [data, setData] = useState<R | null>(null)

  const submit = async (formData: T) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await action(formData)
      setData(result)
      options?.onSuccess?.(result)
      return result
    } catch (err) {
      setError(err)
      options?.onError?.(err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting, error, data }
}
