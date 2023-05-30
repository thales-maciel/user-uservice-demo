import { AuthClient } from './AuthClient'
import { Logger } from './Logger'
import {
  Persistence,
  PersistenceOperationHandler,
  PersistenceScope,
} from './Persistence'
import { ProfileRepository } from './ProfileRepository'

export {
  Logger,
  ProfileRepository,
  Persistence,
  PersistenceScope,
  PersistenceOperationHandler,
  AuthClient,
}

type AppDependencies = {
  logger: Logger
  authClient: AuthClient
  profileRepository: ProfileRepository
  persistence: Persistence
}

export default AppDependencies
