import {
  createTodoListService,
  updateTodoListService,
  getListByIdService,
  getListsByOwnerIdService,
  deleteTodoListService,
} from "../../src/service/todoListService";

import {
  createTodoListRepo,
  updateTodoListRepo,
  getTodoListByIdRepo,
  getTodosListByOwnerIdRepo,
  deleteTodoListRepo,
} from "../../src/repository/todoListRepository";

import { getUserByIdService } from "../../src/service/userService";
import logger from "../../src/config/logger";
import { BadRequestException } from "../../src/exceptions/badRequest";
import { ErrorCodes } from "../../src/exceptions/httpException";

jest.mock("../../src/repository/todoListRepository");
jest.mock("../../src/service/userService");
jest.mock("../../src/config/logger");

describe("Todo List Service Tests", () => {
  const userId = "1";
  const todoList = {
    ownerId: Number(userId),
    title: "Sample Todo List",
    Todos: [],
  };
  const todoListId = "1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createTodoListService should create a new todo list", async () => {
    (getUserByIdService as jest.Mock).mockResolvedValue({ id: userId });
    (createTodoListRepo as jest.Mock).mockResolvedValue({
      ...todoList,
      id: todoListId,
    });

    const result = await createTodoListService(userId, todoList.title);

    expect(getUserByIdService).toHaveBeenCalledWith(Number(userId));
    expect(createTodoListRepo).toHaveBeenCalledWith(todoList);
    expect(result).toEqual({ ...todoList, id: todoListId });
  });

  test("updateTodoListService should update an existing todo list", async () => {
    (getTodoListByIdRepo as jest.Mock).mockResolvedValue(todoList);
    (updateTodoListRepo as jest.Mock).mockResolvedValue({
      ...todoList,
      title: "Updated Todo List",
    });

    const result = await updateTodoListService(todoListId, "Updated Todo List");

    expect(getTodoListByIdRepo).toHaveBeenCalledWith(Number(todoListId));
    expect(updateTodoListRepo).toHaveBeenCalledWith(
      Number(todoListId),
      "Updated Todo List",
    );
    expect(result.title).toEqual("Updated Todo List");
  });

  test("getListByIdService should return a todo list by id", async () => {
    (getTodoListByIdRepo as jest.Mock).mockResolvedValue(todoList);

    const result = await getListByIdService(todoListId);

    expect(getTodoListByIdRepo).toHaveBeenCalledWith(Number(todoListId));
    expect(result).toEqual(todoList);
  });

  test("getListsByOwnerIdService should return todo lists by owner id", async () => {
    (getTodosListByOwnerIdRepo as jest.Mock).mockResolvedValue([todoList]);

    const result = await getListsByOwnerIdService(userId);

    expect(getTodosListByOwnerIdRepo).toHaveBeenCalledWith(Number(userId));
    expect(result).toEqual([todoList]);
  });

  test("deleteTodoListService should delete a todo list", async () => {
    (getTodoListByIdRepo as jest.Mock).mockResolvedValue(todoList);

    await deleteTodoListService(todoListId);

    expect(getTodoListByIdRepo).toHaveBeenCalledWith(Number(todoListId));
    expect(deleteTodoListRepo).toHaveBeenCalledWith(Number(todoListId));
  });
});
