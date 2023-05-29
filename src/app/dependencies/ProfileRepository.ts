import { RegisterUserInput } from '../../domain'
import {
  OperationFailed,
  PersistenceOperationHandler,
  UsernameAlreadyExists,
} from './Persistence'

export type ProfileRepository = {
  insertProfile: (
    client: PersistenceOperationHandler,
  ) => (
    input: RegisterUserInput,
  ) => TaskEither<UsernameAlreadyExists | OperationFailed, null>
}
