import { Knex } from "knex";


export async function getLLMs(db: Knex, userId: string) {
  return await db('llms').where({ owner_id: userId });
}

export async function addLLM(db: Knex, userId: string, model: string, baseUrl: string, systemTemplate: string, userTemplate: string, assistantTemplate: string) {
  let tmpLLM = { owner_id: userId, model, baseUrl, systemTemplate, userTemplate, assistantTemplate };

  let newLLM = await db("llms").insert(tmpLLM);
  return newLLM;
}

export async function editLLM(db: Knex, id: string, userId: string, updatedLLM: Partial<{ model: string, baseUrl: string, systemTemplate: string, userTemplate: string, assistantTemplate: string }>) {
  console.log("updatedLLM", updatedLLM)

  let result = await db("llms").where({ id, owner_id: userId }).update(updatedLLM);

  return result;
}

export async function deleteLLM(db: Knex, id: string, userId: string) {
  let result = await db("llms").where({ id, owner_id: userId }).delete();

  return result;
}

export async function getLLM(db: Knex, llmId: string, userId: string) {
  return await db('llms').where({ owner_id: userId, id: llmId }).first();
}