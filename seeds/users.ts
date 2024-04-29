import dotenv from "dotenv";
dotenv.config();

import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        { id: 1, username: "admin", apikey: process.env.DEFAULT_API_KEY || "0123456789" },
    ]);
};
