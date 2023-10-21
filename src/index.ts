import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { typeDefs, resolvers } from "./graphql";
import { BASE_URL, SERVER_PORT } from "./constants";

(async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  const imagesPath = `${path.dirname(fileURLToPath(import.meta.url))}/images`;

  // Serve local images files
  app.use(
    "/images",
    express.static(imagesPath, {
      extensions: ["svg", "png", "jpg"],
    })
  );

  /**
   * 
   * Mount Graphql server
   * 
   */
  app.use(
    "/graphql",
    cors({
      origin: [
        BASE_URL,
        "http://localhost:3000",
        "https://studio.apollographql.com",
      ],
    }),
    bodyParser.json({ limit: "10mb" }),
    expressMiddleware(server)
  );

  httpServer.listen(
    {
      port: SERVER_PORT,
    },
    () => {
      console.log(`GraphQL Server running at: localhost:${SERVER_PORT}`);
    }
  );
})();
