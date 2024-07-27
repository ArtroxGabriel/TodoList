import { prismaClient } from "../config";
import { todoListModel as TodoListModel } from "../model/todoListModel";

export async function createTodoListRepo(todoList: TodoListModel) {
    const todoListCreated = await prismaClient.list.create({
        data: {
            title: todoList.title,
            ownerId: todoList.ownerId,
        }
    });

    return todoListCreated;
}

export async function updateTodoListRepo(id: number, newTitle: string) {
    const todoListUpdated = await prismaClient.list.update({
        where: {
            id
        },
        data: {
            title: newTitle,
        },
        include: {
            Todos: true,
        }
    });

    return todoListUpdated
}

export async function getTodoListByIdRepo(id: number) {
    return await prismaClient.list.findFirst({
        where: { id },
        include: {
            Todos: true,
        }
    })
}

export async function getTodosListByOwnerIdRepo(ownerId: number) {
    return await prismaClient.list.findMany({
        where: { ownerId },
        include: {
            Todos: true
        }
    })
}

export async function deleteTodoListRepo(id: number) {
    await prismaClient.list.delete({
        where: { id },
    });
}
