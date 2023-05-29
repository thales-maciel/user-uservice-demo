export type UsernameAlreadyExists = {
  name: 'UsernameAlreadyExists'
}

export type OperationFailed = {
  name: 'OperationFailed'
}

export type Persistence = {
  getPersistenceScope: () => TaskEither<OperationFailed, PersistenceScope>
}

export type PersistenceOperationHandler = (
  statement: string,
  bindings?: string[],
) => TaskEither<OperationFailed, { rows: [column: string][] }>

export type PersistenceScope = {
  begin: () => TaskEither<OperationFailed, null>
  commit: () => TaskEither<OperationFailed, null>
  rollback: () => TaskEither<OperationFailed, null>
  getOperationHandler: () => PersistenceOperationHandler
}
