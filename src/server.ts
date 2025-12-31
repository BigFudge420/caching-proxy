#!/usr/bin/env node
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import startServer from "./util/startServer"

const argv = yargs(hideBin(process.argv))
  .option("port", {
    type: "number",
    default: 3000,
  })
  .parseSync()

const server = startServer(argv.port)

process.on('SIGINT', () => {
    console.log('Keyboard Interrupt: Terminating Server')
    server.close()
})

process.on('SIGTERM', () => {
    console.log('Termination Signal: Terminating Server')
    server.close()
})