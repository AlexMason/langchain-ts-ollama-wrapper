import { Knex } from "knex";

export async function getLLMs(db: Knex, userId: string) {
  return await db('llms').where({ owner_id: userId });
}