import { NextFunction, Request, Response } from "express"
import { userService_create, userService_delete, userService_getAll, userService_getByEmail, userService_getById, userService_login, userService_update } from "../service/userService"
import { StatusCodes } from "http-status-codes"
import { BadRequestException } from "../exceptions/badRequest";
import { ErrorCodes } from "../exceptions/httpException";

export async function userController_create(req: Request, res: Response, next: NextFunction) {
    try {
        const {
            Name,
            Email,
            Password
        } = req.body

        const userCreated = await userService_create(Name, Email, Password);
        res.status(StatusCodes.CREATED).send(userCreated);

    } catch (error: any) {
        next(error)
    }
}


export async function userController_login(req: Request, res: Response, next: NextFunction) {
    try {
        const {
            Email,
            Password
        } = req.body

        const result = await userService_login(Email, Password);

        res.status(StatusCodes.OK).json(result)

    } catch (error: any) {
        next(error)
    }
}

export async function userController_getAll(_: Request, res: Response) {
    const quero = await userService_getAll()

    res.status(StatusCodes.OK).send(quero)
}

export async function userController_delete(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        if (!userId) {
            next(new BadRequestException("Missing user id", ErrorCodes.REQUIRED_VALUES_EMPTY))
        }

        await userService_delete(Number(userId))

        res.status(StatusCodes.GONE).json(`User with id ${userId} deleted`)
    } catch (error: any) {
        next(error)
    }
}

export async function userController_getById(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        if (!userId) {
            next(new BadRequestException("Missing user id", ErrorCodes.REQUIRED_VALUES_EMPTY))
        }

        const user = await userService_getById(Number(userId))

        res.status(StatusCodes.OK).send(user)
    } catch (error: any) {
        next(error)
    }
}

export async function userController_getByEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const userEmail = req.params.userEmail
        if (!userEmail) {
            next(new BadRequestException("Missing user email", ErrorCodes.REQUIRED_VALUES_EMPTY))
        }

        const user = await userService_getByEmail(userEmail)

        res.status(StatusCodes.OK).send(user)
    } catch (error: any) {
        next(error)
    }
}

export async function userController_update(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        if (!userId) {
            next(new BadRequestException("Missing user id", ErrorCodes.REQUIRED_VALUES_EMPTY))
        }

        const {
            Name,
            password: Password
        } = req.body

        const user = await userService_update(Number(userId), Name, Password)

        res.status(StatusCodes.OK).send(user)
    } catch (error: any) {
        next(error)
    }
}


