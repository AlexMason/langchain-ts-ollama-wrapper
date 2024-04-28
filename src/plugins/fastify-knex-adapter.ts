import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import knex, { Knex } from 'knex'

declare module 'fastify' {
  interface FastifyInstance {
    knex: Knex
  }
}

interface FastifyKnexOptions {
  client: string,
  connection: object,
  useNullAsDefault: boolean
}

const fastifyKnex: FastifyPluginAsync<FastifyKnexOptions> = async (fastify, options) => {
  const db = knex(options);

  fastify.decorate('knex', db);
}

export default fp(fastifyKnex, '>3.x');