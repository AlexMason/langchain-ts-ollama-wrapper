import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("llms").del();

    // Inserts seed entries
    await knex("llms").insert([
        {
            id: 1,
            model: "llama3:8b-instruct-q5_K_M",
            baseUrl: "http://localhost:11434",
            systemTemplate: "System: {prompt}",
            userTemplate: "User: {prompt}\n",
            assistantTemplate: "Assistant: {response}\n",
            owner_id: "1",
            created_at: knex.fn.now()
        },
    ]);
};
