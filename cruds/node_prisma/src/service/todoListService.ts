import logger from "../config/logger";
import { BadRequestException } from "../exceptions/badRequest";
import { ErrorCodes } from "../exceptions/httpException";
import { todoListModel } from "../model/todoListModel";
import {
  createTodoListRepo,
  deleteTodoListRepo,
  getTodoListByIdRepo,
  getTodosListByOwnerIdRepo,
  updateTodoListRepo,
} from "../repository/todoListRepository";
import { getUserByIdService as getUserByIdService } from "./userService";

export async function createTodoListService(ownerId: string, title: string) {
  logger.info("Starting create todo list service");
  if (!title.trim() || !ownerId.trim()) {
    const error = new BadRequestException(
      "Some value is empty",
      ErrorCodes.REQUIRED_VALUES_EMPTY,
    );
    logger.error(`Empty Values: userId: ${ownerId}, title: ${title}`, {
      error,
      action: "createTodoList",
    });
    throw error;
  }
  const userId = Number(ownerId);

  const user = await getUserByIdService(userId);
  if (!user) {
    const error = new BadRequestException(
      "User don't exists!",
      ErrorCodes.LIST_ALREADY_EXISTS,
    );
    logger.error(`Not found user with this id: ${userId}`, {
      error,
      action: "createdTodoList",
    });
    throw error;
  }

  const todoListToCreate: todoListModel = {
    ownerId: userId,
    title,
    Todos: [],
  };

  logger.info("Todo List created succesfully", {
    action: "createTodoList",
  });
  return createTodoListRepo(todoListToCreate);
}

export async function updateTodoListService(id: string, newTitle: string) {
  logger.info("Starting update todo list service");
  if (!id.trim() || !newTitle.trim()) {
    const error = new BadRequestException(
      "Some value is empty",
      ErrorCodes.REQUIRED_VALUES_EMPTY,
    );
    logger.error(`Empty Values: id: ${id}, title: ${newTitle}`, {
      error,
      action: "updateTodoList",
    });
    throw error;
  }
  await getListByIdService(id);

  return updateTodoListRepo(Number(id), newTitle);
}

export async function getListByIdService(id: string) {
  logger.info("Starting get list by id service");
  if (!id.trim()) {
    const error = new BadRequestException(
      "Some value is empty",
      ErrorCodes.REQUIRED_VALUES_EMPTY,
    );
    logger.error(`Empty Values: id: ${id}`, {
      error,
      action: "getTodoList",
    });
    throw error;
  }

  return getTodoListByIdRepo(Number(id));
}

export async function getListsByOwnerIdService(id: string) {
  logger.info("Starting get lists by ownerId service");
  if (!id.trim()) {
    const error = new BadRequestException(
      "Some value is empty",
      ErrorCodes.REQUIRED_VALUES_EMPTY,
    );
    logger.error(`Empty Values: id: ${id}`, {
      error,
      action: "getTodosListsByOwnerId",
    });
    throw error;
  }
  await getUserByIdService(Number(id));

  return getTodosListByOwnerIdRepo(Number(id));
}

export async function deleteTodoListService(id: string) {
  logger.info("Starting get lists by ownerId service");
  if (!id.trim()) {
    const error = new BadRequestException(
      "Some value is empty",
      ErrorCodes.REQUIRED_VALUES_EMPTY,
    );
    logger.error(`Empty Values: id: ${id}`, {
      error,
      action: "deleteTodoList",
    });
    throw error;
  }
  await getListByIdService(id);

  return deleteTodoListRepo(Number(id));
}
