import { FastifyInstance } from "fastify/types/instance";
import { addTaskHistory, deleteTaskHistory, editTaskHistory, getTaskHistory } from "../db/taskhistory";

export default function taskhistory(fastify: FastifyInstance, options: any, done: Function) {

  fastify.get("/:taskId", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return {
        history: await getTaskHistory(fastify.knex, (request.params as any).taskId, request.user ? request.user.id : "")
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
          request.user ? request.user.id : "",
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
        editedTaskHistoryId: await editTaskHistory(
          fastify.knex,
          (request.params as any).id,
          request.user ? request.user.id : "",
          (request.body as any)
        )
      }
    }
  });

  fastify.delete("/:id", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return {
        deletedTaskHistoryId: await deleteTaskHistory(
          fastify.knex,
          (request.params as any).id,
          request.user ? request.user.id : "",
        )
      }
    }
  });

  done();
}