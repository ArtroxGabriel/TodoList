import { Request, Response } from "express"
import { userService_create, userService_delete, userService_getAll, userService_getByEmail, userService_getById, userService_update } from "../service/userService"
import { StatusCodes } from "http-status-codes"

export async function userController_create(req: Request, res: Response) {
    try {
        const {
            Name,
            Email,
            Password
        } = req.body

        const userCreated = await userService_create(Name, Email, Password);
        res.status(StatusCodes.CREATED).send(userCreated);

    } catch (error: any) {
        if (error.message === "User Already exists!") {
            res.status(StatusCodes.CONFLICT).json({ error: error.message });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }
}

export async function userController_getAll(_: Request, res: Response) {
    const quero = await userService_getAll()

    res.status(StatusCodes.OK).send(quero)
}

export async function userController_delete(req: Request, res: Response) {
    try {
        const userId = req.params.userId
        if (!userId) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: new Error("Missing user id") })
        }

        await userService_delete(Number(userId))

        res.status(StatusCodes.GONE).json(`User with id ${userId} deleted`)
    } catch (error: any) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error.message })
    }
}

export async function userController_getById(req: Request, res: Response) {
    try {
        const userId = req.params.userId
        if (!userId) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: new Error("Missing user id") })
        }

        const user = await userService_getById(Number(userId))

        res.status(StatusCodes.OK).send(user)
    } catch (error: any) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error.message })
    }
}

export async function userController_getByEmail(req: Request, res: Response) {
    try {
        const userEmail = req.params.userEmail
        if (!userEmail) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: new Error("Missing email") })
        }

        const user = await userService_getByEmail(userEmail)

        res.status(StatusCodes.OK).send(user)
    } catch (error: any) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error.message })
    }
}

export async function userController_update(req: Request, res: Response) {
    try {
        const userId = req.params.userId
        if (!userId) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: new Error("Missing user id") })
        }

        const {
            Name,
            password: Password
        } = req.body

        const user = await userService_update(Number(userId), Name, Password)

        res.status(StatusCodes.OK).send(user)
    } catch (error: any) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error.message })
    }
}


