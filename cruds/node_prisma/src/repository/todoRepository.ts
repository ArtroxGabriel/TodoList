import { prismaClient } from "../config";
import { todoModel } from "../model/todoModel";

export async function createTodoRepo(todoList: todoModel) {
  const todoCreated = await prismaClient.todo.create({
    data: {
      listId: todoList.listId,
      description: todoList.description,
    },
  });

  return todoCreated;
}

export async function updateTodoRepo(
  id: number,
  newDesc: string,
  newStatus: boolean,
) {
  const todoUpdated = await prismaClient.todo.update({
    where: {
      id,
    },
    data: {
      description: newDesc,
      status: newStatus,
    },
  });

  return todoUpdated;
}

export async function getTodoByIdRepo(id: number) {
  return await prismaClient.todo.findFirst({
    where: { id },
  });
}

export async function getTodosByListIdRepo(listId: number) {
  return await prismaClient.todo.findMany({
    where: { listId },
  });
}

export async function deleteTodoRepo(id: number) {
  await prismaClient.todo.delete({
    where: { id },
  });
}
