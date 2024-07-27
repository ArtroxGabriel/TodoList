import { Router } from "express";
import {
  createTodoListController,
  deleteTodoListController,
  getTodoListByIDController,
  getTodoListByOwnerIdController,
  updateTodoListController,
} from "../controller/todoListController";

const todoListRouter: Router = Router();

todoListRouter.post("/", createTodoListController);
todoListRouter.put("/:ID", updateTodoListController);
todoListRouter.get("/:ID", getTodoListByIDController);
todoListRouter.get("/getLists/:UserID", getTodoListByOwnerIdController);
todoListRouter.delete("/:ID", deleteTodoListController);

export default todoListRouter;
