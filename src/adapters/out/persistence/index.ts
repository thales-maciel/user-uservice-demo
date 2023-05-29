import { Logger } from '../../../app/dependencies/Logger'
import {
  Persistence,
  PersistenceScope,
} from '../../../app/dependencies/Persistence'
import { Pool, PoolClient } from 'pg'

type DatabaseConfig = {
  host: string
  port: number
  user: string
  password: string
  database: string
  ssl: boolean
}

const createPersistenceScope = (conn: PoolClient): PersistenceScope => {
  return {
    begin: () =>
      pipe(
        TE.tryCatch(
          () => conn.query('BEGIN'),
          () => ({ name: 'OperationFailed' } as const),
        ),
        TE.map(() => null),
      ),
    commit: () =>
      pipe(
        TE.tryCatch(
          () => conn.query('COMMIT'),
          () => ({ name: 'OperationFailed' } as const),
        ),
        TE.map(() => null),
      ),
    rollback: () =>
      pipe(
        TE.tryCatch(
          () => conn.query('ROLLBACK'),
          () => ({ name: 'OperationFailed' } as const),
        ),
        TE.map(() => null),
      ),
    getOperationHandler: () => (statement, bindings) =>
      pipe(
        TE.tryCatch(
          () => conn.query(statement, bindings),
          () => ({ name: 'OperationFailed' } as const),
        ),
      ),
  }
}

export const persistenceFactory = (
  config: DatabaseConfig,
  logger: Logger,
): Persistence => {
  const pool = new Pool({
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port,
    database: config.database,
    ssl: config.ssl,
  })

  const getPersistenceScope = () => {
    return TE.tryCatch(
      async () => {
        const conn = await pool.connect()
        return createPersistenceScope(conn)
      },
      (err) => {
        logger.error('Error while getting connection', err)
        return { name: 'OperationFailed' } as const
      },
    )
  }

  return {
    getPersistenceScope,
  }
}
