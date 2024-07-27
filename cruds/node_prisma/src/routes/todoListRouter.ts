import { Router } from "express";
import todoListController from "../controller/todoListController";

const todoListRouter: Router = Router();

const controller = new todoListController();

todoListRouter.post("/", controller.create);
todoListRouter.put("/:ID", controller.update);
todoListRouter.get("/:ID", controller.get);
todoListRouter.get("/getLists/:UserID", controller.getLists);
todoListRouter.delete("/:ID", controller.delete);

export default todoListRouter;
