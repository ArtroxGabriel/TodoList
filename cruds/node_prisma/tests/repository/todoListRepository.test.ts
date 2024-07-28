import { prismaClient } from "../../src/config";
import { todoListModel as TodoListModel } from "../../src/model/todoListModel";
import {
  createTodoListRepo,
  updateTodoListRepo,
  getTodoListByIdRepo,
  getTodosListByOwnerIdRepo,
  deleteTodoListRepo,
} from "../../src/repository/todoListRepository";

jest.mock("../../src/config", () => ({
  prismaClient: {
    list: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe("Todo List Repository Tests", () => {
  const todoList: TodoListModel = {
    ownerId: 1,
    title: "Sample Todo List",
    Todos: [],
  };
  const listId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createTodoListRepo should create a new todo list", async () => {
    (prismaClient.list.create as jest.Mock).mockResolvedValue({
      ...todoList,
      id: listId,
    });

    const result = await createTodoListRepo(todoList);

    expect(prismaClient.list.create).toHaveBeenCalledWith({
      data: { title: todoList.title, ownerId: todoList.ownerId },
    });
    expect(result).toEqual({ ...todoList, id: listId });
  });

  test("updateTodoListRepo should update an existing todo list", async () => {
    const updatedTodoList = { ...todoList, title: "Updated Todo List" };
    (prismaClient.list.update as jest.Mock).mockResolvedValue(updatedTodoList);

    const result = await updateTodoListRepo(listId, updatedTodoList.title);

    expect(prismaClient.list.update).toHaveBeenCalledWith({
      where: { id: listId },
      data: { title: updatedTodoList.title },
      include: { Todos: true },
    });
    expect(result).toEqual(updatedTodoList);
  });

  test("getTodoListByIdRepo should return a todo list by id", async () => {
    (prismaClient.list.findFirst as jest.Mock).mockResolvedValue(todoList);

    const result = await getTodoListByIdRepo(listId);

    expect(prismaClient.list.findFirst).toHaveBeenCalledWith({
      where: { id: listId },
      include: { Todos: true },
    });
    expect(result).toEqual(todoList);
  });

  test("getTodosListByOwnerIdRepo should return todo lists by owner id", async () => {
    const todoLists = [todoList];
    (prismaClient.list.findMany as jest.Mock).mockResolvedValue(todoLists);

    const result = await getTodosListByOwnerIdRepo(todoList.ownerId);

    expect(prismaClient.list.findMany).toHaveBeenCalledWith({
      where: { ownerId: todoList.ownerId },
      include: { Todos: true },
    });
    expect(result).toEqual(todoLists);
  });

  test("deleteTodoListRepo should delete a todo list", async () => {
    await deleteTodoListRepo(listId);

    expect(prismaClient.list.delete).toHaveBeenCalledWith({
      where: { id: listId },
    });
  });
});
