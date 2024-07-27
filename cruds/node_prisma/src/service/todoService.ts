import logger from "../config/logger";
import { BadRequestException } from "../exceptions/badRequest";
import { ErrorCodes } from "../exceptions/httpException";
import { todoModel } from "../model/todoModel";
import {
  createTodoRepo,
  deleteTodoRepo,
  getTodoByIdRepo,
  getTodosByListIdRepo,
  updateTodoRepo,
} from "../repository/todoRepository";
import { getListByIdService } from "./todoListService";

export async function createTodoService(listID: string, description: string) {
  logger.info("Starting create TODO list service");
  if (!listID.trim() || !description.trim()) {
    const error = new BadRequestException(
      "Some value is empty",
      ErrorCodes.REQUIRED_VALUES_EMPTY,
    );
    logger.error(
      `Empty Values: listID: ${listID}, description: ${description}`,
      {
        error,
        action: "createTODO",
      },
    );
    throw error;
  }

  const todo = await getListByIdService(listID);
  if (!todo) {
    const error = new BadRequestException(
      "User don't exists!",
      ErrorCodes.LIST_ALREADY_EXISTS,
    );
    logger.error(`Not found list with this id: ${Number(listID)}`, {
      error,
      action: "createdTODO",
    });
    throw error;
  }

  const todoToCreate: todoModel = {
    description,
    status: false,
    listId: todo.id,
  };

  logger.info("TODO created succesfully", {
    action: "createTODO",
  });
  return createTodoRepo(todoToCreate);
}

export async function updateTodoService(
  id: string,
  newDesc: string,
  newStatus: string,
) {
  logger.info("Starting update TODO service");
  if (!id.trim() || !newDesc.trim()) {
    const error = new BadRequestException(
      "Some value is empty",
      ErrorCodes.REQUIRED_VALUES_EMPTY,
    );
    logger.error(
      `Empty Values: id: ${id}, desc: ${newDesc}, status: ${newStatus}`,
      {
        error,
        action: "updateTODO",
      },
    );
    throw error;
  }

  const todo = await getTodoByIDService(id);
  if (!todo) {
    const error = new BadRequestException(
      "TODO not found",
      ErrorCodes.TODO_NOT_FOUND,
    );
    logger.error(`Not found TODO with this id: ${id}`, {
      error,
      action: "updateTODO",
    });
    throw error;
  }

  return updateTodoRepo(Number(id), newDesc, Boolean(newStatus));
}

export async function getTodoByIDService(id: string) {
  logger.info("Starting get todo by id service");
  if (!id.trim()) {
    const error = new BadRequestException(
      "Some value is empty",
      ErrorCodes.REQUIRED_VALUES_EMPTY,
    );
    logger.error(`Empty Values: todoID: ${id}`, {
      error,
      action: "getTodoByID",
    });
    throw error;
  }

  return getTodoByIdRepo(Number(id));
}

export async function getTodosByListIdService(id: string) {
  logger.info("Starting get todos by list id service");
  if (!id.trim()) {
    const error = new BadRequestException(
      "Some value is empty",
      ErrorCodes.REQUIRED_VALUES_EMPTY,
    );
    logger.error(`Empty Values: listID: ${id}`, {
      error,
      action: "getTodosByListID",
    });
    throw error;
  }
  const list = await getListByIdService(id);
  if (!list) {
    const error = new BadRequestException(
      "List not found",
      ErrorCodes.LIST_NOT_FOUND,
    );
    logger.error(`Not found list with this id: ${id}`, {
      error,
      action: "getTODOSbyListID",
    });
    throw error;
  }

  return getTodosByListIdRepo(Number(id));
}

export async function deleteTodoService(id: string) {
  logger.info("Starting delte todo service");
  if (!id.trim()) {
    const error = new BadRequestException(
      "Some value is empty",
      ErrorCodes.REQUIRED_VALUES_EMPTY,
    );
    logger.error(`Empty Values: id: ${id}`, {
      error,
      action: "deleteTodo",
    });
    throw error;
  }
  const todo = await getTodoByIDService(id);
  if (!todo) {
    const error = new BadRequestException(
      "TODO not found",
      ErrorCodes.TODO_NOT_FOUND,
    );
    logger.error(`Not found TODO with this id: ${id}`, {
      error,
      action: "deleteTODO",
    });
    throw error;
  }

  return deleteTodoRepo(todo.id);
}
