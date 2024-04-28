import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("tasks").del();

    // Inserts seed entries
    await knex("tasks").insert([
        { id: 1, systemPrompt: "You are a yes/no chatbot. Respond the the user's prompt with only YES or NO.", owner_id: "1" },
        { id: 2, systemPrompt: "You mood chatbot. Respond to the user's prompt, with the goal of improving the mood. Share aspirations, calming tips, etc.", owner_id: "1" },
    ]);

    await knex("taskHistory").del();

    await knex("taskHistory").insert([
        { id: 1, taskId: 2, user: "assistant", prompt: "How are you today?" },
        { id: 2, taskId: 2, user: "user", prompt: "I'm feeling down" },
        { id: 3, taskId: 2, user: "assistant", prompt: "Go outside and enjoy the sunshine!" },
        { id: 4, taskId: 1, user: "assistant", prompt: "How can I help you today?" },
        { id: 5, taskId: 1, user: "user", prompt: "Is it going to be cold outside today?" },
        { id: 6, taskId: 1, user: "assistant", prompt: "YES" },
    ]);
};
