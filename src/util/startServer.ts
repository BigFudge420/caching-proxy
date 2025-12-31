import app from "../app"

const startServer = (port : number) => {
  return app.listen(port, () => {
    console.log(`Proxy listening on port ${port}`)
  })
}

export default startServer