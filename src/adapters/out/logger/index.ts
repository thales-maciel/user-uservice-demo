import { Logger } from '../../../app/dependencies'
import { pino } from 'pino'

type LoggerConfigs = {
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  pretty: boolean
}

export const createLogger = (configs: LoggerConfigs): Logger => {
  const pinoConfigs = configs.pretty
    ? {
        level: configs.level,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            timestamp: 'HH:MM:ss',
          },
        },
      }
    : { level: configs.level }
  const logger = pino(pinoConfigs)
  return fromPino(logger)
}

function fromPino(pino: pino.Logger): Logger {
  return {
    debug: pino.debug,
    error: pino.error,
    fatal: pino.fatal,
    info: pino.info,
    warn: pino.warn,
    of: (identifier: Record<string, string>) =>
      fromPino(pino.child(identifier)),
  }
}
