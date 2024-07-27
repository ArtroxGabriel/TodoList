import { Router } from "express";
import UserController from "../controller/userController";

const userRouter: Router = Router();

const controller = new UserController();

userRouter.post("/", controller.create);
userRouter.delete("/:userId", controller.delete);
userRouter.put("/:userId", controller.update);
userRouter.get("/", controller.getUsers);
userRouter.get("/:userId", controller.getByID);
userRouter.get("/email/:userEmail", controller.getByEmail);
userRouter.post("/login", controller.login);

export default userRouter;
