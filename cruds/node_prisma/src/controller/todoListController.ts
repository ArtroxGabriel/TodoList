import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../config/logger";
import {
  createTodoListService,
  getListsByOwnerIdService,
} from "../service/todoListService";

export async function createTodoListController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info("Starting create todo list");
  try {
    const { OwnerId, Title } = req.body;

    const listCreated = await createTodoListService(OwnerId, Title);
    res.status(StatusCodes.CREATED).send(listCreated);
  } catch (error: any) {
    logger.error(error);
    next(error);
  }
}
export async function getListByOwnerId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info("Starting get todo list by owner id");
  try {
    const { UserId: ownerId } = req.body;
    const lists = await getListsByOwnerIdService(ownerId);

    res.status(StatusCodes.OK).send(lists);
  } catch (error: any) {
    logger.error(error);
    next(error);
  }
}
