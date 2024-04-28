import { Knex } from "knex";

export async function getTaskHistory(db: Knex, taskId: string, userId: string) {
  return await db('taskHistory').where({ taskId, owner_id: userId });
}

export async function addTaskHistory(db: Knex, taskId: string, userId: string, user: "user" | "assistant", prompt: string) {
  let newTaskHistory = await db("taskHistory").insert({ taskId, user, prompt, owner_id: userId });
  return newTaskHistory;
}

export async function editTaskHistory(db: Knex, id: string, userId: string, updatedTaskHistory: { user: "user" | "assistant", prompt: string }) {
  let result = await db("taskHistory").where({ id, owner_id: userId }).update(updatedTaskHistory);

  return result;
}

export async function deleteTaskHistory(db: Knex, id: string, userId: string) {
  let result = await db("taskHistory").where({ id, owner_id: userId }).delete();

  return result;
}