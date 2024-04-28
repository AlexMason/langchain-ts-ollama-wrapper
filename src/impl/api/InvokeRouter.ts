import { FastifyInstance } from "fastify/types/instance";
import { addLLM, deleteLLM, editLLM, getLLM, getLLMs } from "../db/llms";
import { OllamaModel } from "../../interfaces/Ollama";
import { Task } from "../../interfaces/Task";

export default function invokeRouter(fastify: FastifyInstance, options: any, done: Function) {

  fastify.post("/", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {

      let llm = await fastify.knex("llms")
        .where({
          "owner_id": request.user ? request.user.id : "",
          id: (request.body as any).llmId
        }).first();

      let ollamaModel = new OllamaModel({
        modelName: llm.model,
        ollamaInput: {
          baseUrl: llm.baseUrl,
        },
        systemTemplate: llm.systemTemplate,
        userTemplate: llm.userTemplate,
        assistantTemplate: llm.assistantTemplate
      })

      let task = await fastify.knex("tasks")
        .where({
          // "owner_id": request.user ? request.user.id : "",
          id: (request.body as any).taskId
        })
        .first();

      console.log("task", task)
      console.log("request.user", request.user)

      let newTask = new Task({
        systemPrompt: task.systemPrompt,
        history: task.history
      });

      let result = await ollamaModel.invoke(newTask, (request.body as any).prompt, (request.body as any).context);

      return {
        result
      }
    }
  });

  done();
}