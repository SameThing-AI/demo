/**
 * Comprehensive Configuration Management System
 * Centralized configuration with environment-specific settings
 */

import { logger } from './monitoring'

export interface DatabaseConfig {
  uri: string
  options: {
    maxPoolSize: number
    minPoolSize: number
    maxIdleTimeMS: number
    serverSelectionTimeoutMS: number
    socketTimeoutMS: number
    heartbeatFrequencyMS: number
    retryWrites: boolean
    ssl: boolean
  }
}

export interface AuthConfig {
  nextauth: {
    url: string
    secret: string
    sessionMaxAge: number
    sessionUpdateAge: number
  }
  google: {
    clientId: string
    clientSecret: string
  }
  jwt: {
    secret: string
    expiresIn: string
  }
  bcrypt: {
    saltRounds: number
  }
  rateLimit: {
    windowMs: number
    maxRequests: number
  }
}

export interface OpenAIConfig {
  apiKey: string
  model: string
  maxTokens: number
  temperature: number
  timeout: number
  retries: number
  backoffMs: number
}

export interface ServerConfig {
  port: number
  host: string
  cors: {
    origin: string[]
    credentials: boolean
    optionsSuccessStatus: number
  }
  compression: boolean
  trustProxy: boolean
  bodySizeLimit: string
}

export interface CacheConfig {
  redis?: {
    url: string
    password?: string
    db: number
    keyPrefix: string
    ttl: number
  }
  memory: {
    maxSize: number
    ttl: number
  }
}

export interface StorageConfig {
  provider: 'local' | 's3' | 'gcs'
  local?: {
    uploadDir: string
    maxFileSize: number
    allowedTypes: string[]
  }
  s3?: {
    bucket: string
    region: string
    accessKeyId: string
    secretAccessKey: string
  }
  gcs?: {
    bucket: string
    projectId: string
    keyFilename: string
  }
}

export interface MonitoringConfig {
  sentry?: {
    dsn: string
    environment: string
    sampleRate: number
  }
  analytics?: {
    trackingId: string
    apiSecret: string
  }
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
    service?: {
      url: string
      token: string
    }
  }
  metrics: {
    service?: {
      url: string
      token: string
    }
    flushInterval: number
  }
}

export interface FeatureFlags {
  revolutionaryAssessments: boolean
  aiPoweredMatching: boolean
  advancedAnalytics: boolean
  realTimeCollaboration: boolean
  videoAssessments: boolean
  integrationHub: boolean
  whiteLabeling: boolean
  enterpriseSSO: boolean
}

export interface AppConfig {
  env: 'development' | 'staging' | 'production' | 'test'
  debug: boolean
  database: DatabaseConfig
  auth: AuthConfig
  openai: OpenAIConfig
  server: ServerConfig
  cache: CacheConfig
  storage: StorageConfig
  monitoring: MonitoringConfig
  features: FeatureFlags
  assessment: {
    maxDuration: number
    autoSaveInterval: number
    maxFileSize: number
    allowedFileTypes: string[]
    antiCheat: {
      enableTabDetection: boolean
      enableCopyPasteDetection: boolean
      enableScreenshotDetection: boolean
      maxViolations: number
    }
  }
  email: {
    provider: 'smtp' | 'sendgrid' | 'ses'
    from: string
    smtp?: {
      host: string
      port: number
      secure: boolean
      auth: {
        user: string
        pass: string
      }
    }
    sendgrid?: {
      apiKey: string
    }
    ses?: {
      region: string
      accessKeyId: string
      secretAccessKey: string
    }
  }
  ui: {
    theme: 'light' | 'dark' | 'auto'
    primaryColor: string
    fontFamily: string
    animations: boolean
    compactMode: boolean
  }
}

class ConfigManager {
  private config: AppConfig
  private validated = false

  constructor() {
    this.config = this.loadConfig()
    this.validateConfig()
  }

  private loadConfig(): AppConfig {
    const env = (process.env.NODE_ENV as any) || 'development'
    
    return {
      env,
      debug: env === 'development' || process.env.DEBUG === 'true',
      
      database: {
        uri: this.getRequired('MONGODB_URI'),
        options: {
          maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
          minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),
          maxIdleTimeMS: parseInt(process.env.DB_MAX_IDLE_TIME_MS || '30000'),
          serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT_MS || '5000'),
          socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT_MS || '45000'),
          heartbeatFrequencyMS: parseInt(process.env.DB_HEARTBEAT_FREQUENCY_MS || '10000'),
          retryWrites: process.env.DB_RETRY_WRITES !== 'false',
          ssl: process.env.DB_SSL === 'true'
        }
      },

      auth: {
        nextauth: {
          url: this.getRequired('NEXTAUTH_URL'),
          secret: this.getRequired('NEXTAUTH_SECRET'),
          sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '2592000'), // 30 days
          sessionUpdateAge: parseInt(process.env.SESSION_UPDATE_AGE || '86400') // 1 day
        },
        google: {
          clientId: this.getRequired('GOOGLE_CLIENT_ID'),
          clientSecret: this.getRequired('GOOGLE_CLIENT_SECRET')
        },
        jwt: {
          secret: this.getRequired('JWT_SECRET'),
          expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        },
        bcrypt: {
          saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12')
        },
        rateLimit: {
          windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 min
          maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
        }
      },

      openai: {
        apiKey: this.getRequired('OPENAI_API_KEY'),
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4096'),
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
        timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000'),
        retries: parseInt(process.env.OPENAI_RETRIES || '3'),
        backoffMs: parseInt(process.env.OPENAI_BACKOFF_MS || '1000')
      },

      server: {
        port: parseInt(process.env.PORT || '3000'),
        host: process.env.HOST || '0.0.0.0',
        cors: {
          origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
          credentials: process.env.CORS_CREDENTIALS !== 'false',
          optionsSuccessStatus: parseInt(process.env.CORS_OPTIONS_SUCCESS_STATUS || '200')
        },
        compression: process.env.COMPRESSION !== 'false',
        trustProxy: process.env.TRUST_PROXY === 'true',
        bodySizeLimit: process.env.BODY_SIZE_LIMIT || '10mb'
      },

      cache: {
        ...(process.env.REDIS_URL && {
          redis: {
            url: process.env.REDIS_URL,
            password: process.env.REDIS_PASSWORD,
            db: parseInt(process.env.REDIS_DB || '0'),
            keyPrefix: process.env.REDIS_KEY_PREFIX || 'ai-hiring:',
            ttl: parseInt(process.env.REDIS_TTL || '3600')
          }
        }),
        memory: {
          maxSize: parseInt(process.env.MEMORY_CACHE_MAX_SIZE || '100'),
          ttl: parseInt(process.env.MEMORY_CACHE_TTL || '300')
        }
      },

      storage: {
        provider: (process.env.STORAGE_PROVIDER as any) || 'local',
        local: {
          uploadDir: process.env.UPLOAD_DIR || './uploads',
          maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
          allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['pdf', 'doc', 'docx', 'txt']
        },
        ...(process.env.AWS_S3_BUCKET && {
          s3: {
            bucket: process.env.AWS_S3_BUCKET,
            region: process.env.AWS_REGION || 'us-east-1',
            accessKeyId: this.getRequired('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.getRequired('AWS_SECRET_ACCESS_KEY')
          }
        }),
        ...(process.env.GCS_BUCKET && {
          gcs: {
            bucket: process.env.GCS_BUCKET,
            projectId: this.getRequired('GCS_PROJECT_ID'),
            keyFilename: process.env.GCS_KEY_FILENAME || './gcs-key.json'
          }
        })
      },

      monitoring: {
        ...(process.env.SENTRY_DSN && {
          sentry: {
            dsn: process.env.SENTRY_DSN,
            environment: env,
            sampleRate: parseFloat(process.env.SENTRY_SAMPLE_RATE || '1.0')
          }
        }),
        ...(process.env.GA_TRACKING_ID && {
          analytics: {
            trackingId: process.env.GA_TRACKING_ID,
            apiSecret: this.getRequired('GA_API_SECRET')
          }
        }),
        logging: {
          level: (process.env.LOG_LEVEL as any) || 'info',
          ...(process.env.LOG_SERVICE_URL && {
            service: {
              url: process.env.LOG_SERVICE_URL,
              token: this.getRequired('LOG_SERVICE_TOKEN')
            }
          })
        },
        metrics: {
          ...(process.env.METRICS_URL && {
            service: {
              url: process.env.METRICS_URL,
              token: this.getRequired('METRICS_TOKEN')
            }
          }),
          flushInterval: parseInt(process.env.METRICS_FLUSH_INTERVAL || '60000')
        }
      },

      features: {
        revolutionaryAssessments: process.env.FEATURE_REVOLUTIONARY_ASSESSMENTS !== 'false',
        aiPoweredMatching: process.env.FEATURE_AI_MATCHING === 'true',
        advancedAnalytics: process.env.FEATURE_ADVANCED_ANALYTICS === 'true',
        realTimeCollaboration: process.env.FEATURE_REAL_TIME_COLLAB === 'true',
        videoAssessments: process.env.FEATURE_VIDEO_ASSESSMENTS === 'true',
        integrationHub: process.env.FEATURE_INTEGRATION_HUB === 'true',
        whiteLabeling: process.env.FEATURE_WHITE_LABELING === 'true',
        enterpriseSSO: process.env.FEATURE_ENTERPRISE_SSO === 'true'
      },

      assessment: {
        maxDuration: parseInt(process.env.ASSESSMENT_MAX_DURATION || '180'), // 3 hours
        autoSaveInterval: parseInt(process.env.ASSESSMENT_AUTO_SAVE_INTERVAL || '30000'), // 30 sec
        maxFileSize: parseInt(process.env.ASSESSMENT_MAX_FILE_SIZE || '5242880'), // 5MB
        allowedFileTypes: process.env.ASSESSMENT_ALLOWED_FILE_TYPES?.split(',') || ['pdf', 'txt', 'doc', 'docx'],
        antiCheat: {
          enableTabDetection: process.env.ANTI_CHEAT_TAB_DETECTION !== 'false',
          enableCopyPasteDetection: process.env.ANTI_CHEAT_COPY_PASTE !== 'false',
          enableScreenshotDetection: process.env.ANTI_CHEAT_SCREENSHOT !== 'false',
          maxViolations: parseInt(process.env.ANTI_CHEAT_MAX_VIOLATIONS || '3')
        }
      },

      email: {
        provider: (process.env.EMAIL_PROVIDER as any) || 'smtp',
        from: process.env.EMAIL_FROM || 'noreply@ai-hiring.com',
        ...(process.env.SMTP_HOST && {
          smtp: {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: this.getRequired('SMTP_USER'),
              pass: this.getRequired('SMTP_PASS')
            }
          }
        }),
        ...(process.env.SENDGRID_API_KEY && {
          sendgrid: {
            apiKey: process.env.SENDGRID_API_KEY
          }
        }),
        ...(process.env.AWS_SES_REGION && {
          ses: {
            region: process.env.AWS_SES_REGION,
            accessKeyId: this.getRequired('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.getRequired('AWS_SECRET_ACCESS_KEY')
          }
        })
      },

      ui: {
        theme: (process.env.UI_THEME as any) || 'light',
        primaryColor: process.env.UI_PRIMARY_COLOR || '#3b82f6',
        fontFamily: process.env.UI_FONT_FAMILY || 'Inter, sans-serif',
        animations: process.env.UI_ANIMATIONS !== 'false',
        compactMode: process.env.UI_COMPACT_MODE === 'true'
      }
    }
  }

  private getRequired(key: string): string {
    const value = process.env[key]
    if (!value) {
      throw new Error(`Required environment variable ${key} is not set`)
    }
    return value
  }

  private validateConfig(): void {
    try {
      // Validate database URI
      if (!this.config.database.uri.startsWith('mongodb://') && !this.config.database.uri.startsWith('mongodb+srv://')) {
        throw new Error('Invalid MongoDB URI format')
      }

      // Validate URLs
      new URL(this.config.auth.nextauth.url)

      // Validate numeric values
      if (this.config.server.port < 1 || this.config.server.port > 65535) {
        throw new Error('Invalid server port')
      }

      // Validate OpenAI settings
      if (this.config.openai.temperature < 0 || this.config.openai.temperature > 2) {
        throw new Error('OpenAI temperature must be between 0 and 2')
      }

      this.validated = true
      logger.info('Configuration validated successfully', {
        env: this.config.env,
        features: Object.keys(this.config.features).filter(key => this.config.features[key as keyof FeatureFlags])
      })
    } catch (error) {
      logger.fatal('Configuration validation failed', error as Error)
      throw error
    }
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    if (!this.validated) {
      throw new Error('Configuration not validated')
    }
    return this.config[key]
  }

  getAll(): AppConfig {
    if (!this.validated) {
      throw new Error('Configuration not validated')
    }
    return { ...this.config }
  }

  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.config.features[feature]
  }

  isDevelopment(): boolean {
    return this.config.env === 'development'
  }

  isProduction(): boolean {
    return this.config.env === 'production'
  }

  isTest(): boolean {
    return this.config.env === 'test'
  }
}

// Global configuration instance
export const config = new ConfigManager()

// Environment-specific configurations can be exported for convenience
export const dbConfig = config.get('database')
export const authConfig = config.get('auth')
export const openaiConfig = config.get('openai')
export const serverConfig = config.get('server')
export const storageConfig = config.get('storage')
export const monitoringConfig = config.get('monitoring')
export const features = config.get('features')

export default config
