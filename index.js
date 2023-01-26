import express from "express";
import { createClient } from "redis";

const app = express();
const port = 3000;
const redisHost = process.env.REDIS_HOST ? process.env.REDIS_HOST : "";
const redisPort = process.env.REDIS_PORT ? process.env.REDIS_PORT : "";

app.get("/", (req, res) => {
  res.send("test");
});

const client = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

app.get("/:key", async (req, res) => {
  await client.connect();
  const value = await client.get(req.params.key);
  res.status(200).send({
    result: value,
  });
  await client.disconnect();
});

app.listen(port, async () => {
  await connectRedis();
  console.log(`Example app listening on port ${port}`);
});

const connectRedis = async () => {
  await client.connect();
  await client.set("carlos", "alicita");
  await client.set("alicita", "carlos");
  await client.disconnect();
  client.on("error", (err) => console.log("Redis Client Error", err));
};
