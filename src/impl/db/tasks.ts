import { Knex } from "knex";

type TaskItem = {
  id: string,
  name: string,
  description: string
  systemPrompt: string,
  owner_id: string,
  created_at: string,
};

export async function deleteTask(db: Knex, id: string, userId: string) {
  try {
    await db("tasks").where({ id, owner_id: userId }).delete();
    await db("taskHistory").where({ taskId: id, owner_id: userId }).delete();
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
    response.history = await db('taskHistory').where({ taskId: response.task.id, owner_id: userId });
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

export async function editTask(db: Knex, id: string, userId: string, updatedTask: Partial<TaskItem>) {
  let result = await db("tasks").where({ id, owner_id: userId }).update(updatedTask);

  return result;
}