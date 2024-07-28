import { prismaClient } from "../../src/config";
import { todoModel as TodoModel } from "../../src/model/todoModel";
import {
  createTodoRepo,
  updateTodoRepo,
  getTodoByIdRepo,
  getTodosByListIdRepo,
  deleteTodoRepo,
} from "../../src/repository/todoRepository";

jest.mock("../../src/config", () => ({
  prismaClient: {
    todo: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe("Todo Repository Tests", () => {
  const todo: TodoModel = {
    description: "Sample Todo",
    status: false,
    listId: 1,
  };
  const todoId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createTodoRepo should create a new todo", async () => {
    (prismaClient.todo.create as jest.Mock).mockResolvedValue({
      ...todo,
      id: todoId,
    });

    const result = await createTodoRepo(todo);

    expect(prismaClient.todo.create).toHaveBeenCalledWith({
      data: { listId: todo.listId, description: todo.description },
    });
    expect(result).toEqual({ ...todo, id: todoId });
  });

  test("updateTodoRepo should update an existing todo", async () => {
    const updatedTodo = { ...todo, description: "Updated Todo", status: true };
    (prismaClient.todo.update as jest.Mock).mockResolvedValue(updatedTodo);

    const result = await updateTodoRepo(
      todoId,
      updatedTodo.description,
      updatedTodo.status,
    );

    expect(prismaClient.todo.update).toHaveBeenCalledWith({
      where: { id: todoId },
      data: {
        description: updatedTodo.description,
        status: updatedTodo.status,
      },
    });
    expect(result).toEqual(updatedTodo);
  });

  test("getTodoByIdRepo should return a todo by id", async () => {
    (prismaClient.todo.findFirst as jest.Mock).mockResolvedValue(todo);

    const result = await getTodoByIdRepo(todoId);

    expect(prismaClient.todo.findFirst).toHaveBeenCalledWith({
      where: { id: todoId },
    });
    expect(result).toEqual(todo);
  });

  test("getTodosByListIdRepo should return todos by list id", async () => {
    const todos = [todo];
    (prismaClient.todo.findMany as jest.Mock).mockResolvedValue(todos);

    const result = await getTodosByListIdRepo(todo.listId);

    expect(prismaClient.todo.findMany).toHaveBeenCalledWith({
      where: { listId: todo.listId },
    });
    expect(result).toEqual(todos);
  });

  test("deleteTodoRepo should delete a todo", async () => {
    await deleteTodoRepo(todoId);

    expect(prismaClient.todo.delete).toHaveBeenCalledWith({
      where: { id: todoId },
    });
  });
});
