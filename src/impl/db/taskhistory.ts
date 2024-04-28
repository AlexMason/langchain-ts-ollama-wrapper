import { Knex } from "knex";

export async function getTaskHistory(db: Knex, taskId: string) {
  return await db('taskHistory').where({ taskId });
}

export async function addTaskHistory(db: Knex, taskId: string, user: "user" | "assistant", prompt: string) {
  let newTaskHistory = await db("taskHistory").insert({ taskId, user, prompt });
  return newTaskHistory;
}

export async function editTaskHistory(id: string, db: Knex, updatedTaskHistory: { user: "user" | "assistant", prompt: string }) {
  let result = await db("taskHistory").where({ id }).update(updatedTaskHistory);

  return result;
}

export async function deleteTaskHistory(id: string, db: Knex) {
  let result = await db("taskHistory").where({ id }).delete();

  return result;
}