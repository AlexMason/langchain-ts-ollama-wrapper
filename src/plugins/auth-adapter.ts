import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Knex } from 'knex';

// Define your authentication middleware function
declare module 'fastify' {
  interface FastifyRequest {
    user: { id: string; name: string } | null;
  }

  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

// Register the authentication middleware as a plugin
const authAdapter = async (fastify: FastifyInstance) => {
  fastify.decorateRequest('user', null);

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      const token = request.headers.authorization;
      const user = await findUserByToken(fastify.knex, token || '');

      if (!user) {
        reply.code(401).send({ error: 'Unauthorized' });
      } else {
        request.user = user;
      }
    } catch (err) {
      reply.send(err);
    }
  });
};

function findUserByToken(db: Knex, token: string) {
  return db('users').where({ apikey: token }).first();
}

export default fastifyPlugin(authAdapter);