import { useState, useEffect, useCallback, useRef } from 'react'

interface UseOptimizedFetchOptions {
  enabled?: boolean
  refetchInterval?: number
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

/**
 * Custom hook for optimized data fetching with cleanup and caching
 */
export function useOptimizedFetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: UseOptimizedFetchOptions = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { enabled = true, refetchInterval, onSuccess, onError } = options

  const fetchData = useCallback(async () => {
    if (!enabled) return undefined

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    try {
      setLoading(true)
      setError(null)
      
      const result = await fetchFn()
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return undefined
      }

      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      // Don't set error if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return undefined
      }
      
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [fetchFn, enabled, onSuccess, onError])

  // Initial fetch and dependency-based refetch
  useEffect(() => {
    fetchData().catch(() => {
      // Error handling is done in fetchData
    })
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, dependencies)

  // Interval-based refetch
  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        fetchData().catch(() => {
          // Error handling is done in fetchData
        })
      }, refetchInterval)
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
    return undefined
  }, [fetchData, refetchInterval, enabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch
  }
}
