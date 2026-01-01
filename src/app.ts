import express from 'express'
import forwardController from './controllers/forwardController'

const app = express()

app.all(/^\/.*/, forwardController)

export default app