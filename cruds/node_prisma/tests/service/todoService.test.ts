import {
  createTodoService,
  updateTodoService,
  getTodoByIDService,
  getTodosByListIdService,
  deleteTodoService,
} from "../../src/service/todoService";

import {
  createTodoRepo,
  updateTodoRepo,
  getTodoByIdRepo,
  getTodosByListIdRepo,
  deleteTodoRepo,
} from "../../src/repository/todoRepository";

import { getListByIdService } from "../../src/service/todoListService";

jest.mock("../../src/repository/todoRepository");
jest.mock("../../src/service/todoListService");
jest.mock("../../src/config/logger");

describe("Todo Service Tests", () => {
  const listID = "1";
  const todo = {
    description: "Sample Todo",
    status: false,
    listId: listID,
  };
  const todoId = "1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createTodoService should create a new todo", async () => {
    (getListByIdService as jest.Mock).mockResolvedValue({ id: listID });
    (createTodoRepo as jest.Mock).mockResolvedValue({ ...todo, id: todoId });

    const result = await createTodoService(listID, todo.description);

    expect(getListByIdService).toHaveBeenCalledWith(listID);
    expect(createTodoRepo).toHaveBeenCalledWith(todo);
    expect(result).toEqual({ ...todo, id: todoId });
  });

  test("updateTodoService should update an existing todo", async () => {
    (getTodoByIdRepo as jest.Mock).mockResolvedValue(todo);
    (updateTodoRepo as jest.Mock).mockResolvedValue({
      ...todo,
      description: "Updated Todo",
      status: true,
    });

    const result = await updateTodoService(todoId, "Updated Todo", "true");

    expect(getTodoByIdRepo).toHaveBeenCalledWith(Number(todoId));
    expect(updateTodoRepo).toHaveBeenCalledWith(
      Number(todoId),
      "Updated Todo",
      true,
    );
    expect(result.description).toEqual("Updated Todo");
    expect(result.status).toEqual(true);
  });

  test("getTodoByIDService should return a todo by id", async () => {
    (getTodoByIdRepo as jest.Mock).mockResolvedValue(todo);

    const result = await getTodoByIDService(todoId);

    expect(getTodoByIdRepo).toHaveBeenCalledWith(Number(todoId));
    expect(result).toEqual(todo);
  });

  test("getTodosByListIdService should return todos by list id", async () => {
    (getListByIdService as jest.Mock).mockResolvedValue({ id: listID });
    (getTodosByListIdRepo as jest.Mock).mockResolvedValue([todo]);

    const result = await getTodosByListIdService(listID);

    expect(getListByIdService).toHaveBeenCalledWith(listID);
    expect(getTodosByListIdRepo).toHaveBeenCalledWith(Number(listID));
    expect(result).toEqual([todo]);
  });

  test("deleteTodoService should delete a todo", async () => {
    (getTodoByIdRepo as jest.Mock).mockResolvedValue({
      ...todo,
      id: Number(listID),
    });

    await deleteTodoService(todoId);

    expect(getTodoByIdRepo).toHaveBeenCalledWith(Number(todoId));
    expect(deleteTodoRepo).toHaveBeenCalledWith(Number(todoId));
  });
});
