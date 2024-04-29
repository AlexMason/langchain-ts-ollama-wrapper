import { FastifyInstance } from "fastify/types/instance";
import { OllamaModel } from "../../interfaces/Ollama";
import { Task } from "../../interfaces/Task";
import { getTask } from "../db/tasks";

export default function invokeRouter(fastify: FastifyInstance, options: any, done: Function) {

  fastify.post("/", {
    preValidation: fastify.authenticate,
    async handler(request, reply) {
      let owner_id = request.user ? request.user.id : "";

      let llm = await fastify.knex("llms")
        .where({
          owner_id,
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

      let task = await getTask(fastify.knex, (request.body as any).taskId, owner_id);

      let newTask = new Task({
        systemPrompt: task.task.systemPrompt,
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