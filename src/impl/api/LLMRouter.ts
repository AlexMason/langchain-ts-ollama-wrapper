import { FastifyInstance } from "fastify/types/instance";
import { getLLMs } from "../db/llms";

export default function llm(fastify: FastifyInstance, options: any, done: Function) {

  fastify.get("/", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return {
        llms: await getLLMs(fastify.knex, request.user ? request.user.id : "")
      }
    }
  })

  done();
}