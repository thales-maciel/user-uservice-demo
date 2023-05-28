import { registerUserInputCodec } from '../domain'
import { UseCase } from './UseCase'
import AppDependencies from './dependencies'
import { match } from 'ts-pattern'
import { v4 as uuid } from 'uuid'

export type RegisterUser = UseCase<RegisterUserInput, RegisterUserOutPut>

export type RegisterUserInput = {
  username: string
  password: string
}

export type RegisterUserErrors =
  | { readonly name: 'Unexpected' }
  | { readonly name: 'UserAlreadyExists' }
  | { readonly name: 'InvalidInput' }
export type RegisterUserOutPut = TaskEither<RegisterUserErrors, null>

export function mkRegisterUser(deps: AppDependencies): RegisterUser {
  return ({ username, password }) => {
    const userId = uuid()
    const userInputValidation = registerUserInputCodec.decode({
      password,
      userId,
      username,
    })

    return pipe(
      userInputValidation,
      TE.fromEither,
      TE.mapLeft((e) => ({ errors: e, name: 'ValidationError' } as const)),
      TE.tapIO(
        ({ username }) =>
          () =>
            deps.logger.info('Registering user', { username }),
      ),
      TE.chainW((userInput) =>
        pipe(
          deps.database.getClient(),
          TE.chainW((client) =>
            pipe(
              client.beginTransaction(),
              TE.chainFirst(() =>
                deps.profileRepository.insertProfile(client)(userInput),
              ),
              TE.chainFirstW(() => deps.authClient.registerUser(userInput)),
              TE.chainFirstW(() => client.commitTransaction()),
              TE.tapIO(
                () => () =>
                  deps.logger.info('User registered successfully', {
                    username: userInput.username,
                  }),
              ),
              TE.orElseFirstIOK(
                (e) => () => deps.logger.error('Error registering user', e),
              ),
              TE.foldW(
                (e) =>
                  pipe(
                    client.rollbackTransaction(),
                    TE.foldW(TE.left, () => TE.left(e)),
                  ),
                TE.right,
              ),
            ),
          ),
        ),
      ),
      TE.mapLeft((e) => {
        return match(e)
          .with(
            { name: 'OperationFailed' },
            () => ({ name: 'Unexpected' } as const),
          )
          .with(
            { name: 'UnexpectedProblem' },
            () => ({ name: 'Unexpected' } as const),
          )
          .with(
            { name: 'UserAlreadyRegistered' },
            () => ({ name: 'UserAlreadyExists' } as const),
          )
          .with(
            { name: 'UsernameAlreadyExists' },
            () => ({ name: 'UserAlreadyExists' } as const),
          )
          .with(
            { name: 'ValidationError' },
            () => ({ name: 'InvalidInput' } as const),
          )
          .exhaustive()
      }),
    )
  }
}
