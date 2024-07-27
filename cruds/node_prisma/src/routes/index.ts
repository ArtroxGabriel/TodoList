import { Router, Express } from "express";
import userRouter from "./userRouter";
import { errorMiddleware } from "../middlewares";
import todoListRouter from "./todoListRouter";
import todoRouter from "./todoRouter";

function router(app: Express) {
  const routers: Router = Router();

  // users router
  routers.use("/user", userRouter);

  // TODO list router
  routers.use("/list", todoListRouter);

  // TODO router
  routers.use("/todo", todoRouter);

  app.use("/api", routers);

  app.use(errorMiddleware);
}

export default router;
