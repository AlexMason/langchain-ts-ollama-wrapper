import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema
    .createTable("tasks", (table) => {
      table.increments("id").primary();
      table.string("name").defaultTo("Untitled Task");
      table.string("description").defaultTo("No description available");
      table.string("systemPrompt");
      table.string('owner_id').references('id').inTable('users');
      table.string("created_at").defaultTo(knex.fn.now());
    })
    .createTable('taskHistory', (table) => {
      table.increments('id').primary();
      table.integer('taskId').unsigned().references('id').inTable('tasks');
      table.string('user');
      table.string('prompt');
    })
    .createTable('llms', (table) => {
      table.increments('id').primary();
      table.string('model');
      table.string('baseUrl');
      table.string('systemTemplate');
      table.string('userTemplate');
      table.string('assistantTemplate');
      table.string('owner_id').references('id').inTable('users');
      table.string("created_at").defaultTo(knex.fn.now());
    })
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username");
      table.string("apikey");
    });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema
    .dropTable("tasks")
    .dropTable("taskHistory")
    .dropTable("llms")
    .dropTable("users");
}