type LogFunction = (...data: unknown[]) => void

export type Logger = {
  debug: LogFunction
  info: LogFunction
  warn: LogFunction
  error: LogFunction
  fatal: LogFunction
}
