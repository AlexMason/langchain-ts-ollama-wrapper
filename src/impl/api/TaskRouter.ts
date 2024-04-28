import { FastifyInstance } from "fastify";
import { Knex } from "knex";
import { addTask, deleteTask, getTasks, getTask, editTask } from "../db/tasks";

export default function tasks(fastify: FastifyInstance, options: any, done: Function) {
  fastify.get("/", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return {
        tasks: (await getTasks(fastify.knex, request.user ? request.user.id : ""))
      }
    }
  });

  fastify.get("/:taskId", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return (await getTask(fastify.knex, (request.params as any).taskId, request.user ? request.user.id : ""))
    }
  });

  fastify.post("/", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      let newTask: any = null;
      try {
        newTask = await addTask(fastify.knex, (request.body as any).systemPrompt, request.user ? request.user.id : "");
      } catch (error: any) {
        reply.code(400);
        console.error(error);
        return { error: error.message }
      }

      return { result: newTask }
    }
  });

  fastify.delete("/:id", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      if (!request.params || typeof request.params !== "object" || 'id' in request.params === false) {
        reply.code(400);
        return { error: "id is required" }
      }

      let result = await deleteTask(request.params.id, fastify.knex);

      return { result }
    }
  });

  fastify.put("/:id", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      if (!request.params || typeof request.params !== "object" || 'id' in request.params === false) {
        reply.code(400);
        return { error: "id is required" }
      }

      let result = await editTask((request.params as any).id, fastify.knex, {
        ...(request.body as any)
      });

      return { result }
    }
  }
  )

  done();
}