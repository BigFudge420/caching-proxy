import express from "express";
import forwardController from "./controllers/forwardController.ts";

const app = express();

app.use(express.raw({ type: "*/*", inflate: false }));
app.all(/^\/.*/, (req, res, next) => {
  forwardController(req, res, next);
});

export default app;
