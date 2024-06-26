import tasks from "./TaskRouter";
import llm from "./LLMRouter";
import taskhistory from "./TaskHistoryRouter";
import invokeRouter from "./InvokeRouter";

export default async function (fastify: any, options: any, done: Function) {
  fastify.register(tasks, { prefix: "/tasks" });
  fastify.register(taskhistory, { prefix: "/tasks/history" });
  fastify.register(llm, { prefix: "/llm" });
  fastify.register(invokeRouter, { prefix: "/invoke" });

  done();
}

