import { Knex } from "knex";

type TaskItem = {
  id: string,
  name: string,
  description: string
  systemPrompt: string,
  owner_id: string,
  created_at: string,
};

export async function deleteTask(id: unknown, db: Knex) {
  try {
    await db("tasks").where({ id }).delete();
    return { success: true };
  } catch (error) {
    console.log('error', error);
    return { success: false };
  }
}

export async function getTasks(db: Knex, userId: string): Promise<TaskItem[]> {
  let dbValue: TaskItem[] = [];

  try {
    dbValue = await db('tasks').where({ owner_id: userId });
  } catch (error) {
    console.log('error', error);
  }

  return dbValue;
}

export async function getTask(db: Knex, taskId: string, userId: string) {
  let response = {
    task: null as any,
    history: [] as any[]
  };

  try {
    response.task = await db('tasks').where({ owner_id: userId, id: taskId }).first();
    response.history = await db('taskHistory').where({ taskId: response.task.id });
  } catch (error) {
    console.log('error', error);
  }

  return response;
}

export async function addTask(db: Knex, systemPrompt: string, userId: string) {
  let tmpTask = { systemPrompt, owner_id: userId };

  let newTask = await db("tasks").insert(tmpTask);
  return newTask;
}

export async function editTask(id: string, db: Knex, updatedTask: Partial<TaskItem>) {
  let result = await db("tasks").where({ id }).update(updatedTask);

  return result;
}