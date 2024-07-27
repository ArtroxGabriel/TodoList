import { Router } from "express";
import {
  createTodoController,
  deleteTodoController,
  getTodoByIDController,
  getTodosByListIdController,
  updateTodoController,
} from "../controller/todoController";

const todoRouter: Router = Router();

todoRouter.post("/", createTodoController);
todoRouter.put("/:ID", updateTodoController);
todoRouter.get("/:ID", getTodoByIDController);
todoRouter.get("/getTodos/:ListID", getTodosByListIdController);
todoRouter.delete("/:ID", deleteTodoController);

export default todoRouter;
