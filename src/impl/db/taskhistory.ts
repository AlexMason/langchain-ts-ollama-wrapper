import { Knex } from "knex";

export async function getTaskHistory(db: Knex, taskId: string) {
  return await db('taskHistory').where({ taskId });
}