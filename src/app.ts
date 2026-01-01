import express from 'express'
import forwardController from './controllers/forwardController.js'

const app = express()

app.use(express.raw({type : '/*'}))
app.all(/^\/.*/, (res, req, next) => {
    forwardController(res, req, next)
})

export default app