/**
 * Performance Optimization Utilities
 * Client-side and server-side performance enhancements
 */

import { NextRequest, NextResponse } from 'next/server'

// Memoization utility
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    }
  }
}

// Lazy loading hook
export function useLazyLoad<T>(
  loadFn: () => Promise<T>,
  deps: any[] = []
): { data: T | null; loading: boolean; error: Error | null; reload: () => void } {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  
  const load = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await loadFn()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, deps)
  
  React.useEffect(() => {
    load()
  }, [load])
  
  return { data, loading, error, reload: load }
}

// Image optimization utility
export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  quality?: number
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  className?: string
  onLoad?: () => void
  onError?: () => void
}

// Bundle size analyzer
export const bundleAnalyzer = {
  logComponentSize: (componentName: string, size: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Bundle] ${componentName}: ${(size / 1024).toFixed(2)}KB`)
    }
  },
  
  measureRenderTime: (componentName: string) => {
    const start = performance.now()
    return () => {
      const end = performance.now()
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Render] ${componentName}: ${(end - start).toFixed(2)}ms`)
      }
    }
  }
}

// API response caching
export class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  set(key: string, data: any, ttlMs: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    })
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  size(): number {
    return this.cache.size
  }
}

// Global API cache instance
export const apiCache = new ApiCache()

// Request/Response optimization middleware
export function withPerformanceOptimization(handler: Function) {
  return async (req: NextRequest) => {
    const start = Date.now()
    
    // Add cache headers
    const response = await handler(req)
    
    if (response instanceof NextResponse) {
      // Add performance headers
      response.headers.set('X-Response-Time', `${Date.now() - start}ms`)
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
      
      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    }
    
    return response
  }
}

// Database query optimization
export const dbOptimization = {
  // Add indexes for common queries
  getOptimalIndexes: () => [
    { collection: 'users', index: { email: 1 }, unique: true },
    { collection: 'users', index: { role: 1, company: 1 } },
    { collection: 'assessments', index: { createdBy: 1, isActive: 1 } },
    { collection: 'assessments', index: { skills: 1, difficulty: 1 } },
    { collection: 'candidateresponses', index: { userId: 1, assessmentId: 1 } },
    { collection: 'candidateresponses', index: { status: 1, completedAt: -1 } },
    { collection: 'assessmentassignments', index: { candidateEmail: 1, status: 1 } },
    { collection: 'assessmentassignments', index: { expiresAt: 1 } }
  ],
  
  // Pagination helper
  getPaginationStage: (page: number, limit: number) => [
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ],
  
  // Aggregation pipeline optimization
  addCountStage: () => [
    {
      $facet: {
        data: [{ $skip: 0 }], // Will be replaced with actual pagination
        count: [{ $count: 'total' }]
      }
    }
  ]
}

// Client-side performance monitoring
export const performanceMonitor = {
  measurePageLoad: (pageName: string) => {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        console.log(`[Page Load] ${pageName}:`, {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalTime: navigation.loadEventEnd - navigation.fetchStart
        })
      })
    }
  },
  
  measureApiCall: async <T>(apiCall: () => Promise<T>, endpoint: string): Promise<T> => {
    const start = performance.now()
    try {
      const result = await apiCall()
      const duration = performance.now() - start
      console.log(`[API] ${endpoint}: ${duration.toFixed(2)}ms`)
      return result
    } catch (error) {
      const duration = performance.now() - start
      console.error(`[API Error] ${endpoint}: ${duration.toFixed(2)}ms`, error)
      throw error
    }
  },
  
  measureComponentRender: (componentName: string) => {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      console.log(`[Component] ${componentName}: ${duration.toFixed(2)}ms`)
    }
  }
}

// Resource preloading utilities
export const preloader = {
  preloadRoute: (href: string) => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      document.head.appendChild(link)
    }
  },
  
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = reject
      img.src = src
    })
  },
  
  preloadFont: (fontUrl: string, fontFamily: string) => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = fontUrl
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
      
      // Also add to CSS
      const style = document.createElement('style')
      style.textContent = `
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}') format('woff2');
          font-display: swap;
        }
      `
      document.head.appendChild(style)
    }
  }
}

// Service Worker utilities
export const serviceWorker = {
  register: async () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        await navigator.serviceWorker.register('/sw.js')
        console.log('[SW] Service Worker registered successfully')
      } catch (error) {
        console.error('[SW] Service Worker registration failed:', error)
      }
    }
  },
  
  unregister: async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
      }
    }
  }
}

// Memory management utilities
export const memoryManager = {
  cleanup: () => {
    // Clear various caches
    apiCache.clear()
    
    // Force garbage collection in development
    if (process.env.NODE_ENV === 'development' && (global as any).gc) {
      (global as any).gc()
    }
  },
  
  monitorMemory: () => {
    if (typeof window !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory
      console.log('[Memory]', {
        used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
      })
    }
  }
}

// React performance hooks
import React from 'react'

export function usePerformance(componentName: string) {
  const renderCount = React.useRef(0)
  const startTime = React.useRef(Date.now())
  
  React.useEffect(() => {
    renderCount.current++
    const endTime = Date.now()
    const renderTime = endTime - startTime.current
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} - Render #${renderCount.current}, Time: ${renderTime}ms`)
    }
    
    startTime.current = endTime
  })
  
  return { renderCount: renderCount.current }
}

export function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value)
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// Export all utilities
export default {
  memoize,
  debounce,
  throttle,
  bundleAnalyzer,
  apiCache,
  withPerformanceOptimization,
  dbOptimization,
  performanceMonitor,
  preloader,
  serviceWorker,
  memoryManager
}
