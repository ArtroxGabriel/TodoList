import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../config/logger";
import {
  createTodoService,
  deleteTodoService,
  getTodoByIDService,
  getTodosByListIdService,
  updateTodoService,
} from "../service/todoService";

export default class TodoController {
  public async create(req: Request, res: Response, next: NextFunction) {
    logger.info("Starting create TODO");
    try {
      const { ListID, Description } = req.body;

      const todoCreated = await createTodoService(ListID, Description);
      res.status(StatusCodes.CREATED).send(todoCreated);
    } catch (error: any) {
      logger.error(error);
      next(error);
    }
  }
  public async update(req: Request, res: Response, next: NextFunction) {
    logger.info("Starting update TODO");
    try {
      const { Description, Status } = req.body;
      const ID = req.params.ID;

      const todoUpdated = await updateTodoService(ID, Description, Status);
      res.status(StatusCodes.OK).send(todoUpdated);
    } catch (error: any) {
      logger.error(error);
      next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    logger.info("Starting get TODO by ID");
    try {
      const ID = req.params.ID;

      const todo = await getTodoByIDService(ID);
      if (!todo) {
        res.status(StatusCodes.NOT_FOUND).json(`TODO not found with this ID`);
      }
      res.status(StatusCodes.OK).send(todo);
    } catch (error: any) {
      logger.error(error);
      next(error);
    }
  }

  public async getTODOs(req: Request, res: Response, next: NextFunction) {
    logger.info("Starting get TODOs  by list id");
    try {
      const ListID = req.params.ListID;
      const todos = await getTodosByListIdService(ListID);

      res.status(StatusCodes.OK).send(todos);
    } catch (error: any) {
      logger.error(error);
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    logger.info("Starting delete TODO");
    try {
      const ID = req.params.ID;

      await deleteTodoService(ID);
      res
        .status(StatusCodes.GONE)
        .json(`TODO with ID ${ID} deleted successfully`);
    } catch (error: any) {
      logger.error(error);
      next(error);
    }
  }
}
