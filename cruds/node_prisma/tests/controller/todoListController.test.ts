import { Request, Response, NextFunction } from "express";
import todoListController from "../../src/controller/todoListController";
import {
  createTodoListService,
  updateTodoListService,
  getListByIdService,
  getListsByOwnerIdService,
  deleteTodoListService,
} from "../../src/service/todoListService";
import { StatusCodes } from "http-status-codes";

jest.mock("../../src/service/todoListService");

jest.mock("../../src/config/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe("Todo List Controller Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let controller: todoListController;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
    next = jest.fn();
    controller = new todoListController();
  });

  test("create should create a new todo list", async () => {
    req.body = {
      OwnerID: "1",
      Title: "Sample Todo List",
    };
    const listCreated = { id: 1, ...req.body };
    (createTodoListService as jest.Mock).mockResolvedValue(listCreated);

    await controller.create(req as Request, res as Response, next);

    expect(createTodoListService).toHaveBeenCalledWith("1", "Sample Todo List");
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.send).toHaveBeenCalledWith(listCreated);
  });

  test("update should update an existing todo list", async () => {
    req.body = { Title: "Updated Todo List" };
    req.params = { ID: "1" };
    const listUpdated = { id: 1, title: "Updated Todo List" };
    (updateTodoListService as jest.Mock).mockResolvedValue(listUpdated);

    await controller.update(req as Request, res as Response, next);

    expect(updateTodoListService).toHaveBeenCalledWith(
      "1",
      "Updated Todo List",
    );
    expect(res.status).toHaveBeenCalledWith(StatusCodes.GONE);
    expect(res.send).toHaveBeenCalledWith(listUpdated);
  });

  test("get should return a todo list by id", async () => {
    req.params = { ID: "1" };
    const list = { id: 1, title: "Sample Todo List" };
    (getListByIdService as jest.Mock).mockResolvedValue(list);

    await controller.get(req as Request, res as Response, next);

    expect(getListByIdService).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(list);
  });

  test("getLists should return todo lists by owner id", async () => {
    req.params = { UserID: "1" };
    const lists = [{ id: 1, title: "Sample Todo List" }];
    (getListsByOwnerIdService as jest.Mock).mockResolvedValue(lists);

    await controller.getLists(req as Request, res as Response, next);

    expect(getListsByOwnerIdService).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(lists);
  });

  test("delete should delete a todo list", async () => {
    req.params = { ID: "1" };

    await controller.delete(req as Request, res as Response, next);

    expect(deleteTodoListService).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(StatusCodes.GONE);
    expect(res.json).toHaveBeenCalledWith(
      "List with ID 1 deleted successfully",
    );
  });
});
