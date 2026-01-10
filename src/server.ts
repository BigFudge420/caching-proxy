#!/usr/bin/env -S node --experimental-strip-types
import startServer from "./util/startServer.ts";
import { argv } from "./argv.ts";
import redis from "./clients/redis.ts";

const server = startServer(argv.port);

process.on("SIGINT", () => {
  console.log("Keyboard Interrupt: Terminating Server");
  redis.quit;
  server.close();
});

process.on("SIGTERM", () => {
  console.log("Termination Signal: Terminating Server");
  redis.quit;
  server.close();
});
