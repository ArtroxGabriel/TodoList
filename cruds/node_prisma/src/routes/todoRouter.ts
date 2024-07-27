import { Router } from "express";
import TodoController from "../controller/todoController";

const todoRouter: Router = Router();

const todoController = new TodoController();

todoRouter.post("/", todoController.create);
todoRouter.put("/:ID", todoController.update);
todoRouter.get("/:ID", todoController.get);
todoRouter.get("/TODOs/:ListID", todoController.getTODOs);
todoRouter.delete("/:ID", todoController.delete);

export default todoRouter;
