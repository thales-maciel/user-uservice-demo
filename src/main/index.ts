import { startHttpServer } from '../adapters/in/http'
import { authClientFactory } from '../adapters/out/authClient'
import { createLogger } from '../adapters/out/logger'
import { persistenceFactory } from '../adapters/out/persistence'
import { profileRepositoryFactory } from '../adapters/out/profileRepository'
import App from '../app'
import { load } from 'ts-dotenv'

const env = load({
  PORT: Number,
  AUTH_CLIENT_URL: String,
  AUTH_CLIENT_API_KEY: String,
  NODE_ENV: ['test' as const, 'development' as const, 'production' as const],
  DB_URL: String,
  DB_NAME: String,
  DB_USER: String,
  DB_PASSWORD: String,
  DB_HOST: String,
  DB_PORT: Number,
  LOG_LEVEL: [
    'error' as const,
    'warn' as const,
    'info' as const,
    'debug' as const,
  ],
})

// OUTGOING ADAPTERS

const logger = createLogger({
  level: env.LOG_LEVEL,
  pretty: env.NODE_ENV === 'development',
})

const persistence = persistenceFactory(
  {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: env.DB_PORT,
    ssl: env.NODE_ENV === 'production',
  },
  logger,
)

const authClient = authClientFactory(
  env.AUTH_CLIENT_API_KEY,
  env.AUTH_CLIENT_URL,
  logger,
)

const profileRepository = profileRepositoryFactory(logger)

// USE CASES

const application = App({
  authClient,
  logger,
  persistence,
  profileRepository,
})

export const start = async () => startHttpServer(application)
