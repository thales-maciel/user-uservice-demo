import { Server } from '..'
import { App } from '../../../../app'
import { match } from 'ts-pattern'

export default (registerUser: App['registerUser']) => (fastify: Server) => {
  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['username', 'password'],
        },
      } as const,
    },
    async (req, res) => {
      const { username, password } = req.body
      const result = await registerUser({ username, password })()

      if (E.isRight(result))
        return res.status(201).send({ message: result.right })
      const error = result.left

      return match(error)
        .with({ name: 'InvalidInput' }, () =>
          res.status(400).send({ message: error }),
        )
        .with({ name: 'UserAlreadyExists' }, () =>
          res.status(409).send({ message: error }),
        )
        .with({ name: 'Unexpected' }, () =>
          res.status(500).send({ message: error }),
        )
        .exhaustive()
    },
  )
}
