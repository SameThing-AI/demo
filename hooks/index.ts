/**
 * Custom hooks for the AI Hiring Assessment platform
 * Reusable logic extracted from components
 */

import { useState, useEffect, useCallback, useMemo } from 'react'

// Utility function for debouncing
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Hook for managing form state with validation
interface UseFormOptions<T> {
  initialValues?: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onSubmit?: (values: T) => void | Promise<void>
}

export const useForm = <T extends Record<string, any>>(options: UseFormOptions<T>) => {
  const { initialValues = {} as T, validate, onSubmit } = options
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof T]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }, [errors])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    // Validate field on blur
    if (validate) {
      const fieldErrors = validate(values)
      if (fieldErrors[name as keyof T]) {
        setErrors(prev => ({ ...prev, [name]: fieldErrors[name as keyof T] }))
      }
    }
  }, [values, validate])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (validate) {
      const formErrors = validate(values)
      setErrors(formErrors)
      
      if (Object.keys(formErrors).length === 0 && onSubmit) {
        onSubmit(values)
      }
    } else if (onSubmit) {
      onSubmit(values)
    }
  }, [values, validate, onSubmit])

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const validateForm = useCallback(() => {
    if (!validate) return true

    const formErrors = validate(values)
    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }, [values, validate])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const isValid = useMemo(() => {
    if (!validate) return true
    const formErrors = validate(values)
    return Object.keys(formErrors).length === 0
  }, [values, validate])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setFieldTouched,
    validate: validateForm,
    reset,
    isValid
  }
}

// Hook for managing loading states
// Hook for managing async operations with parameters
export const useAsync = <T, P extends any[] = []>(
  asyncFunction?: (...args: P) => Promise<T>
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (...args: P) => {
    if (!asyncFunction) return
    
    setLoading(true)
    setError(null)

    try {
      const result = await asyncFunction(...args)
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [asyncFunction])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}

// Hook for debounced search
export const useDebounceSearch = (
  searchFn: (query: string) => Promise<any[]>,
  delay: number = 300
) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearch = useMemo(
    () => debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const searchResults = await searchFn(searchQuery)
        setResults(searchResults)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, delay),
    [searchFn, delay]
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  return {
    query,
    setQuery,
    results,
    loading,
    error
  }
}

// Hook for local storage
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch {
      // Handle storage errors silently
    }
  }, [key])

  return [storedValue, setValue]
}

// Hook for API calls with caching
export const useApi = <T>(
  url: string,
  options?: RequestInit,
  shouldFetch: boolean = true
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!shouldFetch) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }, [url, options, shouldFetch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Hook for managing pagination
export const usePagination = <T>(
  items: T[],
  itemsPerPage: number = 10
) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }, [items, currentPage, itemsPerPage])

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  const reset = useCallback(() => {
    setCurrentPage(1)
  }, [])

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    reset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  }
}

// Hook for managing modal state
export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return { isOpen, open, close, toggle }
}

// Hook for managing sort state
export const useSort = <T>(
  items: T[],
  initialSortKey?: keyof T,
  initialDirection: 'asc' | 'desc' = 'asc'
) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(initialSortKey || null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialDirection)

  const sortedItems = useMemo(() => {
    if (!sortKey) return items

    return [...items].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [items, sortKey, sortDirection])

  const handleSort = useCallback((key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }, [sortKey])

  return {
    sortedItems,
    sortKey,
    sortDirection,
    handleSort
  }
}

// Hook for managing filters
export const useFilter = <T>(
  items: T[],
  filterFn: (item: T, filters: Record<string, any>) => boolean
) => {
  const [filters, setFilters] = useState<Record<string, any>>({})

  const filteredItems = useMemo(() => {
    return items.filter(item => filterFn(item, filters))
  }, [items, filters, filterFn])

  const setFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const removeFilter = useCallback((key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  return {
    filteredItems,
    filters,
    setFilter,
    removeFilter,
    clearFilters
  }
}

// Hook for managing timer/countdown
export const useTimer = (initialTime: number, onComplete?: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0 && onComplete) {
        onComplete()
      }
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, onComplete])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback(() => {
    setTimeLeft(initialTime)
    setIsRunning(false)
  }, [initialTime])

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    reset,
    isComplete: timeLeft <= 0
  }
}
