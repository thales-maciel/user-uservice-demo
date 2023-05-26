type LogFunction = (...data: [string | object]) => void

export type Logger = {
  debug: LogFunction
  info: LogFunction
  warn: LogFunction
  error: LogFunction
  fatal: LogFunction
}

type AppDependencies = {
  logger: Logger
}

export default AppDependencies
