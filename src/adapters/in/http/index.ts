/* eslint-disable canonical/virtual-module */
import { App } from '../../../app'
import registerUser from './routes/registerUser'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import Fastify from 'fastify'

const server = Fastify({
  logger: true,
}).withTypeProvider<JsonSchemaToTsProvider>()

export type Server = typeof server

export const startHttpServer = async (app: App) => {
  try {
    await server.register(registerUser(app.registerUser))
    await server.listen({ port: 3000 })
  } catch (err) {
    console.log(err)
  }
}
