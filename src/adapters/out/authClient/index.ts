import { AuthClient } from '../../../app/dependencies/AuthClient'
import { Logger } from '../../../app/dependencies/Logger'
import { RegisterUserInput } from '../../../domain'
import axios, { isAxiosError } from 'axios'

export const authClientFactory = (
  apiKey: string,
  url: string,
  logger: Logger,
): AuthClient => {
  const httpClient = axios.create({
    baseURL: url,
    headers: {
      Authorization: apiKey,
    },
  })

  const registerUser = ({ userId, username, password }: RegisterUserInput) => {
    return async () => {
      try {
        await httpClient.post(`/api/user/${userId}`, { username, password })
        logger.info('User registered successfully', { username })
        return E.right(null)
      } catch (error) {
        if (isAxiosError(error) && error.status === 409) {
          logger.info('User already registered', { username })
          return E.left({ name: 'UserAlreadyRegistered' } as const)
        }
        logger.info('Unexpected problem', { error })
        return E.left({ name: 'UnexpectedProblem' } as const)
      }
    }
  }

  return {
    registerUser,
  }
}
