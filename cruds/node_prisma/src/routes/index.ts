import { Router, Express } from "express";
import userRouter from "./userRouter";
import { errorMiddleware } from "../middlewares";

function router(app: Express) {

    const routers: Router = Router()

    // users router
    routers.use("/user", userRouter)

    app.use("/api", routers)

    app.use(errorMiddleware)
}

export default router

