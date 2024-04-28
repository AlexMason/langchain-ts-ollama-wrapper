import { FastifyInstance } from "fastify/types/instance";
import { addTaskHistory, editTaskHistory, getTaskHistory } from "../db/taskhistory";

export default function taskhistory(fastify: FastifyInstance, options: any, done: Function) {

  fastify.get("/:taskId", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return {
        taskHistory: await getTaskHistory(fastify.knex, (request.params as any).taskId)
      }
    }
  });

  fastify.post("/:taskId", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return {
        updatedTaskId: await addTaskHistory(
          fastify.knex,
          (request.params as any).taskId,
          (request.body as any).user,
          (request.body as any).prompt
        )
      }
    }
  });

  fastify.put("/:id", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return {
        editedTaskId: await editTaskHistory(
          (request.params as any).id,
          fastify.knex,
          (request.body as any)
        )
      }
    }
  });

  fastify.delete("/:id", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return { error: "Not implemented" }
    }
  });

  done();
}