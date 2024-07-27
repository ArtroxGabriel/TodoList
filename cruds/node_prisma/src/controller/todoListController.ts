import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../config/logger";
import {
  createTodoListService,
  deleteTodoListService,
  getListByIdService,
  getListsByOwnerIdService,
  updateTodoListService,
} from "../service/todoListService";

export async function createTodoListController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info("Starting create TODO list");
  try {
    const { OwnerID, Title } = req.body;

    const listCreated = await createTodoListService(OwnerID, Title);
    res.status(StatusCodes.CREATED).send(listCreated);
  } catch (error: any) {
    logger.error(error);
    next(error);
  }
}

export async function updateTodoListController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info("Starting update TODO list");
  try {
    const { Title } = req.body;
    const ID = req.params.ID;

    const listUpdated = await updateTodoListService(ID, Title);
    res.status(StatusCodes.GONE).send(listUpdated);
  } catch (error: any) {
    logger.error(error);
    next(error);
  }
}

export async function getTodoListByIDController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info("Starting get list by ID");
  try {
    const ID = req.params.ID;

    const list = await getListByIdService(ID);
    if (!list) {
      res.status(StatusCodes.NOT_FOUND).json(`List not found with this ID`);
    }
    res.status(StatusCodes.OK).send(list);
  } catch (error: any) {
    logger.error(error);
    next(error);
  }
}

export async function getTodoListByOwnerIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info("Starting get TODO list by owner id");
  try {
    const UserID = req.params.UserID;
    const lists = await getListsByOwnerIdService(UserID);

    res.status(StatusCodes.OK).send(lists);
  } catch (error: any) {
    logger.error(error);
    next(error);
  }
}

export async function deleteTodoListController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info("Starting delete TODO list");
  try {
    const ID = req.params.ID;

    await deleteTodoListService(ID);
    res
      .status(StatusCodes.GONE)
      .json(`List with ID ${ID} deleted successfully`);
  } catch (error: any) {
    logger.error(error);
    next(error);
  }
}
