type LogFunction = (msg: string, ...data: unknown[]) => void

export type Logger = {
  debug: LogFunction
  info: LogFunction
  warn: LogFunction
  error: LogFunction
  fatal: LogFunction
  of: (identifier: Record<string, string>) => Logger
}
