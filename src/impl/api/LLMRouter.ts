import { FastifyInstance } from "fastify/types/instance";
import { addLLM, deleteLLM, editLLM, getLLM, getLLMs } from "../db/llms";

export default function llm(fastify: FastifyInstance, options: any, done: Function) {

  fastify.get("/", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return {
        llms: await getLLMs(fastify.knex, request.user ? request.user.id : "")
      }
    }
  });

  fastify.get("/:llmId", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return await getLLM(fastify.knex, (request.params as any).llmId, request.user ? request.user.id : "")
    }
  });

  fastify.post("/", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return {
        llm: await addLLM(fastify.knex, request.user ? request.user.id : "",
          (request.body as any).model,
          (request.body as any).baseUrl,
          (request.body as any).systemTemplate,
          (request.body as any).userTemplate,
          (request.body as any).assistantTemplate
        )
      }
    }
  });

  fastify.delete("/:llmId", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return {
        llm: await deleteLLM(fastify.knex, (request.params as any).llmId, request.user ? request.user.id : "")
      }
    }
  });

  fastify.put("/:llmId", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      return {
        llm: await editLLM(fastify.knex, (request.params as any).llmId, request.user ? request.user.id : "", (request.body as any))
      }
    }
  });

  done();
}