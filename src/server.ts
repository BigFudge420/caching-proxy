#!/usr/bin/env node
import startServer from "./util/startServer.js"
import { argv } from "./argv.js"

const server = startServer(argv.port)

process.on('SIGINT', () => {
    console.log('Keyboard Interrupt: Terminating Server')
    server.close()
})

process.on('SIGTERM', () => {
    console.log('Termination Signal: Terminating Server')
    server.close()
})