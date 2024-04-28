// env variables
import dotenv from "dotenv";
dotenv.config();

// imports
import Fastify from "fastify"

import { fastifyKnexAdapter, authAdapter } from "./plugins";
import apiRoutes from "./impl/api";

// create server instance
const fastifyInstance = Fastify({
  logger: true
});

// register plugins
fastifyInstance.register(fastifyKnexAdapter, {
  client: "sqlite3",
  connection: {
    filename: "./sqlite-data/dev.sqlite3"
  },
  useNullAsDefault: true
});

fastifyInstance.register(authAdapter);

// register routes
fastifyInstance.register(apiRoutes, { prefix: "/api" });

// start the server
fastifyInstance.listen({ host: (process.env.HOST || "127.0.0.1"), port: Number(process.env.PORT) || 3000 }).then((address) => {
  console.log(`Server listening on ${address}`)
});