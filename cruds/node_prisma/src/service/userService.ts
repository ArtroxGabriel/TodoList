import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import logger from "../config/logger";
import { BadRequestException } from "../exceptions/badRequest";
import { ErrorCodes } from "../exceptions/httpException";
import { UserModel } from "../model/userModel";
import {
    createUserRepo,
    deleteUserRepo,
    getUsersRepo,
    getByEmailRepo,
    getByIdRepo,
    updateUserRepo
} from "../repository/userRepository";

export async function createUserService(name: string, email: string, password: string) {
    logger.info("Starting create user service")
    if (!name.trim() || !email.trim() || !password.trim()) {
        const error = new BadRequestException("Some value is empty", ErrorCodes.REQUIRED_VALUES_EMPTY)
        logger.error(`Empty Values: name: ${name}, email: ${email}, password: ${password}`, {
            error,
            action: "createUser"
        })
        throw error
    }

    const user = await getByEmailRepo(email)
    if (user) {
        const error = new BadRequestException("User Already exists!", ErrorCodes.USER_ALREADY_EXISTS)
        logger.error(`Already exist an user with this email: ${email}`, {
            error,
            action: "createUser"
        })
        throw error
    }

    const userToCreate: UserModel = {
        name: name,
        email: email,
        password: hashSync(password, 10)
    }

    logger.info("User created succesfully", {
        action: "createUser"
    })
    return createUserRepo(userToCreate)
}

export async function updateUserService(id: number, name: string, password: string) {
    logger.info("Starting update user service", {
        action: "updateUser"
    })
    await getByIdService(id)

    const userToUpdate: UserModel = {
        name: name,
        email: "",
        password: hashSync(password, 10)
    }

    logger.info(`user with id ${id} updated `, {
        action: "updateUser"
    })
    return await updateUserRepo(id, userToUpdate)
}

export async function getUsersService() {
    logger.info("Starting get users service", {
        action: "getUsers"
    })
    const users = await getUsersRepo()
    logger.info(`${users.length} users found`, {
        action: "getUsers"
    })
    return users.map((user) => {
        const { password: _, ...rest } = user
        return rest
    })
}

export async function getByIdService(id: number) {
    logger.info("Starting get by id service", {
        action: "getUserById"
    })
    const user = await getByIdRepo(id)
    if (!user) {
        const error = new BadRequestException(`User not found with this id: ${id}`, ErrorCodes.USER_NOT_FOUND)
        logger.error(`User not found with this id: ${id}`, {
            error,
            action: "getUserById"
        })
        throw error
    } else {
        const { password: _, ...userWithoutPassword } = user
        logger.info(`User with id ${id} found`, {
            action: "getUserById"
        })
        return userWithoutPassword
    }
}

export async function getByEmailService(email: string) {
    logger.info("Starting get by email service", {
        action: "getUserByEmail"
    })
    const user = await getByEmailRepo(email)
    if (!user) {
        const error = new BadRequestException(`User not found with this email: ${email}`, ErrorCodes.USER_NOT_FOUND)
        logger.error(`User not found with this email: ${email}`, {
            error,
            action: "getUserByEmail"
        })
        throw error
    } else {
        const { password: _, ...userWithoutPassword } = user
        logger.info(`User with email ${email} found`, {
            action: "getUserByEmail"
        })
        return userWithoutPassword
    }

}

export async function deleteUserService(id: number) {
    logger.info("Starting delete user service", {
        action: "deleteUser"
    })
    await getByIdService(id)

    deleteUserRepo(id)
    logger.info(`User with id ${id} deleted succesfully`)
}

export async function loginService(email: string, password: string) {
    logger.info("Starting login service")
    if (!email.trim() || !password.trim()) {
        const error = new BadRequestException("Empty values for email or password", ErrorCodes.REQUIRED_VALUES_EMPTY)
        logger.error(`Empty Values: email: ${email}, password: ${password}`, {
            error,
            action: "login"
        })
        throw error
    }

    const userToSignIn = await getByEmailRepo(email)
    if (!userToSignIn) {
        const error = new BadRequestException(`User not found with this email ${email}`, ErrorCodes.USER_NOT_FOUND)
        logger.error(`User not found with this email ${email}`, {
            error,
            action: "login"
        })
        throw error
    }

    if (!compareSync(password, userToSignIn.password)) {
        const error = new BadRequestException("Incorrect Credentials", ErrorCodes.INCORRECT_CREDENTIALS)
        logger.error("the passwords don't match", {
            error,
            action: "login"
        })
        throw error
    }

    const token = jwt.sign({
        userId: userToSignIn.id
    }, JWT_SECRET)

    const { password: _, ...user } = userToSignIn

    logger.info("User logged succesfully", {
        action: "login"
    })

    return { rest: user, token }
}
