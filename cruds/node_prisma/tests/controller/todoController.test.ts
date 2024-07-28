import { Request, Response, NextFunction } from "express";
import TodoController from "../../src/controller/todoController";
import {
  createTodoService,
  updateTodoService,
  getTodoByIDService,
  getTodosByListIdService,
  deleteTodoService,
} from "../../src/service/todoService";
import { StatusCodes } from "http-status-codes";

jest.mock("../../src/service/todoService");

jest.mock("../../src/config/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe("Todo Controller Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let controller: TodoController;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
    next = jest.fn();
    controller = new TodoController();
  });

  test("create should create a new todo", async () => {
    req.body = {
      ListID: "1",
      Description: "Sample Todo",
    };
    const todoCreated = { id: 1, ...req.body };
    (createTodoService as jest.Mock).mockResolvedValue(todoCreated);

    await controller.create(req as Request, res as Response, next);

    expect(createTodoService).toHaveBeenCalledWith("1", "Sample Todo");
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.send).toHaveBeenCalledWith(todoCreated);
  });

  test("update should update an existing todo", async () => {
    req.body = { Description: "Updated Todo", Status: "true" };
    req.params = { ID: "1" };
    const todoUpdated = { id: 1, description: "Updated Todo", status: true };
    (updateTodoService as jest.Mock).mockResolvedValue(todoUpdated);

    await controller.update(req as Request, res as Response, next);

    expect(updateTodoService).toHaveBeenCalledWith("1", "Updated Todo", "true");
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(todoUpdated);
  });

  test("get should return a todo by id", async () => {
    req.params = { ID: "1" };
    const todo = { id: 1, description: "Sample Todo", status: false };
    (getTodoByIDService as jest.Mock).mockResolvedValue(todo);

    await controller.get(req as Request, res as Response, next);

    expect(getTodoByIDService).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(todo);
  });

  test("getTODOs should return todos by list id", async () => {
    req.params = { ListID: "1" };
    const todos = [{ id: 1, description: "Sample Todo", status: false }];
    (getTodosByListIdService as jest.Mock).mockResolvedValue(todos);

    await controller.getTODOs(req as Request, res as Response, next);

    expect(getTodosByListIdService).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(todos);
  });

  test("delete should delete a todo", async () => {
    req.params = { ID: "1" };

    await controller.delete(req as Request, res as Response, next);

    expect(deleteTodoService).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(StatusCodes.GONE);
    expect(res.json).toHaveBeenCalledWith(
      "TODO with ID 1 deleted successfully",
    );
  });
});
