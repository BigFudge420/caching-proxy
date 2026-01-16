#!/usr/bin/env -S node --experimental-strip-types
import startServer from "./util/startServer.ts";
import { argv } from "./argv.ts";

startServer(argv.port);
