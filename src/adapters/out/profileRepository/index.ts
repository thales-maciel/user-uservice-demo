import { Logger } from '../../../app/dependencies/Logger'
import { PersistenceOperationHandler } from '../../../app/dependencies/Persistence'
import { ProfileRepository } from '../../../app/dependencies/ProfileRepository'
import { RegisterUserInput } from '../../../domain'

export const profileRepositoryFactory = (logger: Logger): ProfileRepository => {
  const query = 'insert into user (id, username) values ($1, $2)'

  const insertProfile =
    (conn: PersistenceOperationHandler) =>
    ({ userId, username }: RegisterUserInput) => {
      return async () => {
        try {
          await conn(query, [userId, username])()
          logger.info('Profile created successfully', { username })
          return E.right(null)
        } catch (error) {
          logger.info('Unexpected problem', { error })
          return E.left({ name: 'OperationFailed' } as const)
        }
      }
    }

  return {
    insertProfile,
  }
}
