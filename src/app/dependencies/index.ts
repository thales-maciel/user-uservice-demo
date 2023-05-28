import { AuthClient } from "./AuthClient"
import { Logger } from "./Logger"
import { ProfileRepository, Database } from "./Persistence"

type AppDependencies = {
  logger: Logger
  authClient: AuthClient
  profileRepository: ProfileRepository
  database: Database
}

export default AppDependencies
