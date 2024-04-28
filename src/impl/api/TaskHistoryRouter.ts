import { FastifyInstance } from "fastify/types/instance";
import { getTaskHistory } from "../db/taskhistory";

export default function taskhistory(fastify: FastifyInstance, options: any, done: Function) {

  fastify.get("/:taskId", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return {
        taskHistory: await getTaskHistory(fastify.knex, (request.params as any).taskId)
      }
    }
  })

  done();
}