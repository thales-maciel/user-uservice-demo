import { AuthClient } from './AuthClient'
import { Logger } from './Logger'
import { Persistence } from './Persistence'
import { ProfileRepository } from './ProfileRepository'

type AppDependencies = {
  logger: Logger
  authClient: AuthClient
  profileRepository: ProfileRepository
  database: Persistence
}

export default AppDependencies
