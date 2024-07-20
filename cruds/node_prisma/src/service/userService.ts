import { JWT_SECRET } from "../config";
import { BadRequestException } from "../exceptions/badRequest";
import { ErrorCodes } from "../exceptions/httpException";
import { UserModel } from "../model/userModel";
import {
    userRepository_create,
    userRepository_delete,
    userRepository_getAll,
    userRepository_getByEmail,
    userRepository_getById,
    userRepository_update
} from "../repository/userRepository";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";

export async function userService_create(name: string, email: string, password: string) {
    if (!name.trim() || !email.trim() || !password.trim()) {
        throw new BadRequestException("Some value is empty", ErrorCodes.REQUIRED_VALUES_EMPTY)
    }

    const user = await userRepository_getByEmail(email)
    if (user) {
        throw new BadRequestException("User Already exists!", ErrorCodes.USER_ALREADY_EXISTS)
    }

    const userToCreate: UserModel = {
        name: name,
        email: email,
        password: hashSync(password, 10)
    }

    return userRepository_create(userToCreate)
}

export async function userService_login(email: string, password: string) {
    if (!email.trim() || !password.trim()) {
        throw new BadRequestException("Some value is empty", ErrorCodes.REQUIRED_VALUES_EMPTY)
    }

    const user = await userRepository_getByEmail(email)
    if (!user) {
        throw new BadRequestException("User not found", ErrorCodes.USER_NOT_FOUND)
    }

    if (!compareSync(password, user.password)) {
        throw new BadRequestException("Incorrect Credentials", ErrorCodes.INCORRECT_CREDENTIALS)
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    const { password: _, ...rest } = user

    return { rest, token }
}

export async function userService_update(id: number, name: string, password: string) {
    await userService_getById(id)

    const userToUpdate: UserModel = {
        name: name,
        email: "",
        password: hashSync(password, 10)
    }

    return await userRepository_update(id, userToUpdate)
}

export async function userService_getAll() {
    const users = await userRepository_getAll()
    return users.map((user) => {
        const { password: _, ...rest } = user
        return rest
    })
}

export async function userService_getById(id: number) {
    const user = await userRepository_getById(id)
    if (!user) {
        throw new BadRequestException(`User not found with this id: ${id}`, ErrorCodes.USER_NOT_FOUND)
    } else {
        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
    }
}

export async function userService_getByEmail(email: string) {
    const user = await userRepository_getByEmail(email)
    if (!user) {
        throw new BadRequestException(`User not found with this email: ${email}`, ErrorCodes.USER_NOT_FOUND)
    } else {
        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
    }

}

export async function userService_delete(id: number) {
    await userService_getById(id)

    userRepository_delete(id)
}

