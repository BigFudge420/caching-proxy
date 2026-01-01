#!/usr/bin/env -S node --experimental-strip-types
import startServer from "./util/startServer.ts"
import { argv } from "./argv.ts"

const server = startServer(argv.port)

process.on('SIGINT', () => {
    console.log('Keyboard Interrupt: Terminating Server')
    server.close()
})

process.on('SIGTERM', () => {
    console.log('Termination Signal: Terminating Server')
    server.close()
})