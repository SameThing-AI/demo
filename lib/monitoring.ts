/**
 * Comprehensive Monitoring and Logging System
 * Production-ready logging, error tracking, and performance monitoring
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  userId?: string
  sessionId?: string
  requestId?: string
  stack?: string
}

export interface MetricEntry {
  name: string
  value: number
  unit: string
  timestamp: string
  tags?: Record<string, string>
}

export interface ErrorContext {
  userId?: string
  userAgent?: string
  url?: string
  method?: string
  body?: any
  headers?: Record<string, string>
  timestamp: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info'
  
  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.logLevel]
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      requestId: this.getRequestId(),
      sessionId: this.getSessionId(),
    }
  }

  private getRequestId(): string | undefined {
    // In a server context, this would come from headers or async context
    return typeof window !== 'undefined' ? undefined : process.env.REQUEST_ID
  }

  private getSessionId(): string | undefined {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('sessionId') || undefined
    }
    return undefined
  }

  private write(entry: LogEntry): void {
    if (this.isDevelopment) {
      // Pretty print for development
      const color = this.getLogColor(entry.level)
      console.log(
        `${color}[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`,
        entry.context ? entry.context : '',
        '\x1b[0m'
      )
    } else {
      // JSON format for production
      console.log(JSON.stringify(entry))
      
      // Send to external logging service in production
      this.sendToLogService(entry)
    }
  }

  private getLogColor(level: LogLevel): string {
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
      fatal: '\x1b[35m'  // Magenta
    }
    return colors[level] || '\x1b[0m'
  }

  private async sendToLogService(entry: LogEntry): Promise<void> {
    try {
      // In production, send to external service like DataDog, LogRocket, etc.
      if (process.env.LOG_SERVICE_URL) {
        await fetch(process.env.LOG_SERVICE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LOG_SERVICE_TOKEN}`
          },
          body: JSON.stringify(entry)
        })
      }
    } catch (error) {
      // Fallback to console if external service fails
      console.error('Failed to send log to external service:', error)
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('debug')) {
      this.write(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('info')) {
      this.write(this.formatMessage('info', message, context))
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('warn')) {
      this.write(this.formatMessage('warn', message, context))
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (this.shouldLog('error')) {
      const entry = this.formatMessage('error', message, context)
      if (error) {
        entry.stack = error.stack
      }
      this.write(entry)
      
      // Send to error tracking service
      this.trackError(error || new Error(message), context)
    }
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    const entry = this.formatMessage('fatal', message, context)
    if (error) {
      entry.stack = error.stack
    }
    this.write(entry)
    
    // Send to error tracking service
    this.trackError(error || new Error(message), context)
  }

  private async trackError(error: Error, context?: Record<string, any>): Promise<void> {
    try {
      // Send to error tracking service like Sentry
      if (process.env.SENTRY_DSN) {
        // Sentry would be initialized elsewhere
        // Sentry.captureException(error, { contexts: { custom: context } })
      }
      
      // Or send to custom error tracking
      if (process.env.ERROR_TRACKING_URL) {
        await fetch(process.env.ERROR_TRACKING_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ERROR_TRACKING_TOKEN}`
          },
          body: JSON.stringify({
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString()
          })
        })
      }
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError)
    }
  }
}

class MetricsCollector {
  private metrics: MetricEntry[] = []
  private flushInterval = 60000 // 1 minute
  private maxMetrics = 1000

  constructor() {
    if (typeof window === 'undefined') {
      // Server-side: Set up periodic flushing
      setInterval(() => this.flush(), this.flushInterval)
    }
  }

  record(name: string, value: number, unit = 'count', tags?: Record<string, string>): void {
    const metric: MetricEntry = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      tags
    }

    this.metrics.push(metric)

    // Flush if we have too many metrics
    if (this.metrics.length >= this.maxMetrics) {
      this.flush()
    }
  }

  increment(name: string, tags?: Record<string, string>): void {
    this.record(name, 1, 'count', tags)
  }

  gauge(name: string, value: number, tags?: Record<string, string>): void {
    this.record(name, value, 'gauge', tags)
  }

  timing(name: string, duration: number, tags?: Record<string, string>): void {
    this.record(name, duration, 'ms', tags)
  }

  private async flush(): Promise<void> {
    if (this.metrics.length === 0) return

    const metricsToSend = [...this.metrics]
    this.metrics = []

    try {
      if (process.env.METRICS_URL) {
        await fetch(process.env.METRICS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.METRICS_TOKEN}`
          },
          body: JSON.stringify({ metrics: metricsToSend })
        })
      }
    } catch (error) {
      logger.error('Failed to send metrics', error as Error)
      // Re-add metrics to queue for retry
      this.metrics.unshift(...metricsToSend)
    }
  }
}

class PerformanceMonitor {
  private observations: Map<string, number[]> = new Map()

  startTiming(name: string): () => void {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      this.recordTiming(name, duration)
      return duration
    }
  }

  recordTiming(name: string, duration: number): void {
    if (!this.observations.has(name)) {
      this.observations.set(name, [])
    }
    
    this.observations.get(name)!.push(duration)
    metrics.timing(name, duration)
  }

  getStats(name: string): { avg: number; min: number; max: number; count: number } | null {
    const timings = this.observations.get(name)
    if (!timings || timings.length === 0) return null

    return {
      avg: timings.reduce((a, b) => a + b, 0) / timings.length,
      min: Math.min(...timings),
      max: Math.max(...timings),
      count: timings.length
    }
  }

  clearStats(name?: string): void {
    if (name) {
      this.observations.delete(name)
    } else {
      this.observations.clear()
    }
  }
}

// API request/response monitoring middleware
export function withMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return (async (...args: Parameters<T>) => {
    const endTiming = performanceMonitor.startTiming(`api.${name}`)
    const startTime = Date.now()
    
    try {
      metrics.increment(`api.${name}.requests`)
      const result = await fn(...args)
      
      const duration = endTiming()
      metrics.timing(`api.${name}.duration`, duration)
      metrics.increment(`api.${name}.success`)
      
      logger.info(`API call completed: ${name}`, {
        duration,
        success: true
      })
      
      return result
    } catch (error) {
      const duration = endTiming()
      metrics.increment(`api.${name}.errors`)
      
      logger.error(`API call failed: ${name}`, error as Error, {
        duration,
        args: args.length > 0 ? args[0] : undefined
      })
      
      throw error
    }
  }) as T
}

// Database query monitoring
export function withDbMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  operation: string,
  collection: string
): T {
  return (async (...args: Parameters<T>) => {
    const endTiming = performanceMonitor.startTiming(`db.${collection}.${operation}`)
    
    try {
      metrics.increment(`db.${collection}.${operation}.queries`)
      const result = await fn(...args)
      
      const duration = endTiming()
      metrics.timing(`db.${collection}.${operation}.duration`, duration)
      metrics.increment(`db.${collection}.${operation}.success`)
      
      return result
    } catch (error) {
      endTiming()
      metrics.increment(`db.${collection}.${operation}.errors`)
      
      logger.error(`Database query failed: ${collection}.${operation}`, error as Error)
      throw error
    }
  }) as T
}

// User action tracking
export function trackUserAction(
  action: string,
  userId?: string,
  metadata?: Record<string, any>
): void {
  metrics.increment('user.actions', { action })
  
  logger.info(`User action: ${action}`, {
    userId,
    action,
    metadata,
    timestamp: new Date().toISOString()
  })
}

// System health monitoring
export function startHealthMonitoring(): void {
  if (typeof window !== 'undefined') return // Client-side only

  setInterval(() => {
    // Memory usage
    const memUsage = process.memoryUsage()
    metrics.gauge('system.memory.rss', memUsage.rss / 1024 / 1024) // MB
    metrics.gauge('system.memory.heap_used', memUsage.heapUsed / 1024 / 1024)
    metrics.gauge('system.memory.heap_total', memUsage.heapTotal / 1024 / 1024)

    // CPU usage (simplified)
    const cpuUsage = process.cpuUsage()
    metrics.gauge('system.cpu.user', cpuUsage.user / 1000) // Convert to milliseconds
    metrics.gauge('system.cpu.system', cpuUsage.system / 1000)

    // Event loop lag
    const start = process.hrtime.bigint()
    setImmediate(() => {
      const lag = Number(process.hrtime.bigint() - start) / 1000000 // Convert to ms
      metrics.gauge('system.event_loop_lag', lag)
    })
  }, 30000) // Every 30 seconds
}

// Global instances
export const logger = new Logger()
export const metrics = new MetricsCollector()
export const performanceMonitor = new PerformanceMonitor()

// Browser-specific monitoring
if (typeof window !== 'undefined') {
  // Track page performance
  window.addEventListener('load', () => {
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    metrics.timing('browser.page_load', navigation.loadEventEnd - navigation.loadEventStart)
    metrics.timing('browser.dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)
    metrics.timing('browser.dns_lookup', navigation.domainLookupEnd - navigation.domainLookupStart)
    metrics.timing('browser.tcp_connect', navigation.connectEnd - navigation.connectStart)
  })

  // Track unhandled errors
  window.addEventListener('error', (event) => {
    logger.error('Unhandled error', event.error, {
      filename: event.filename,
      line: event.lineno,
      column: event.colno
    })
    metrics.increment('browser.errors')
  })

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', event.reason instanceof Error ? event.reason : new Error(String(event.reason)))
    metrics.increment('browser.promise_rejections')
  })
}

// Export monitoring utilities
export default {
  logger,
  metrics,
  performanceMonitor,
  withMonitoring,
  withDbMonitoring,
  trackUserAction,
  startHealthMonitoring
}
