import { RegisterUserInput } from '../../domain'

type UsernameAlreadyExists = {
  name: 'UsernameAlreadyExists'
}

type OperationFailed = {
  name: 'OperationFailed'
}

export type Database = {
  getClient: () => TaskEither<OperationFailed, DatabaseClient>
}

type DatabaseClient = {
  beginTransaction: () => TaskEither<OperationFailed, null>
  commitTransaction: () => TaskEither<OperationFailed, null>
  rollbackTransaction: () => TaskEither<OperationFailed, null>
  runStatement: <T = unknown>(
    statement: string,
    bindings?: string[],
  ) => TaskEither<OperationFailed, T>
}

export type ProfileRepository = {
  insertProfile: (
    client: DatabaseClient,
  ) => (
    input: RegisterUserInput,
  ) => TaskEither<UsernameAlreadyExists | OperationFailed, null>
}
