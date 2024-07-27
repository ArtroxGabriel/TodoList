import { NextFunction, Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  getUsersService,
  getUserByEmailService,
  getUserByIdService,
  loginService,
  updateUserService,
} from "../service/userService";
import { StatusCodes } from "http-status-codes";
import { BadRequestException } from "../exceptions/badRequest";
import { ErrorCodes } from "../exceptions/httpException";
import logger from "../config/logger";

export default class UserController {
  public async create(req: Request, res: Response, next: NextFunction) {
    logger.info("Starting create user");
    try {
      const { Name, Email, Password } = req.body;

      const userCreated = await createUserService(Name, Email, Password);
      res.status(StatusCodes.CREATED).send(userCreated);
    } catch (error: any) {
      logger.error(error);
      next(error);
    }
  }

  public async getUsers(_: Request, res: Response) {
    logger.info("Starting get Users");
    const users = await getUsersService();

    res.status(StatusCodes.OK).send(users);
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    logger.info("Starting delete user");
    try {
      const userId = req.params.userId;
      if (!userId) {
        logger.error("Error in delete user controller", {
          error: new Error("Missing user id"),
          action: "deleteUser",
        });
        next(
          new BadRequestException(
            "Missing user id",
            ErrorCodes.REQUIRED_VALUES_EMPTY,
          ),
        );
        return;
      }

      await deleteUserService(Number(userId));

      res.status(StatusCodes.GONE).json(`User with id ${userId} deleted`);
    } catch (error: any) {
      logger.error("Error deleting user", {
        error,
        action: "deleteUser",
      });
      next(error);
    }
  }

  public async getByID(req: Request, res: Response, next: NextFunction) {
    logger.info("Starting get user by id");
    try {
      const userId = req.params.userId;
      if (!userId) {
        logger.error("Error in get user controller", {
          error: new Error("Missing user id"),
          action: "getUserById",
        });
        next(
          new BadRequestException(
            "Missing user id",
            ErrorCodes.REQUIRED_VALUES_EMPTY,
          ),
        );
        return;
      }

      const user = await getUserByIdService(Number(userId));

      res.status(StatusCodes.OK).send(user);
    } catch (error: any) {
      logger.error("Error when try get user", {
        error,
        action: "getUserById",
      });
      next(error);
    }
  }

  public async getByEmail(req: Request, res: Response, next: NextFunction) {
    logger.info("Starting get user by email");
    try {
      const userEmail = req.params.userEmail;
      if (!userEmail) {
        logger.error("Error in get user controller", {
          error: new Error("Missing user id"),
          action: "getUserByEmail",
        });
        next(
          new BadRequestException(
            "Missing user email",
            ErrorCodes.REQUIRED_VALUES_EMPTY,
          ),
        );
        return;
      }

      const user = await getUserByEmailService(userEmail);

      res.status(StatusCodes.OK).send(user);
    } catch (error: any) {
      logger.error("Error when try get user", {
        error,
        action: "getUserByEmail",
      });
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        next(
          new BadRequestException(
            "Missing user id",
            ErrorCodes.REQUIRED_VALUES_EMPTY,
          ),
        );
        return;
      }

      const { Name, Password } = req.body;

      const user = await updateUserService(Number(userId), Name, Password);

      res.status(StatusCodes.OK).send(user);
    } catch (error: any) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    logger.info("Starting login");
    try {
      const { Email, Password } = req.body;

      const result = await loginService(Email, Password);

      res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      logger.error("Error in login", {
        error,
        action: "login",
      });
      next(error);
    }
  }
}
