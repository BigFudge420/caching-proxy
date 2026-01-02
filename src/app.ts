import express from "express";
import forwardController from "./controllers/forwardController.ts";

const app = express();

app.use(express.raw({ type: "*/*" }));
app.all(/^\/.*/, (req, res, next) => {
  forwardController(req, res, next);
});

export default app;
