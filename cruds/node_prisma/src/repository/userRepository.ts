import { prismaClient } from "../config";
import { UserModel } from "../model/userModel";

export const userRepository_create = async (user: UserModel) => {
    const userCreated = await prismaClient.user.create({
        data: {
            name: user.name,
            email: user.email,
            password: user.password
        }
    })
    return userCreated
}

export async function userRepository_update(id: number, user: UserModel) {
    const userUpdated = await prismaClient.user.update({
        where: { id },
        data: {
            name: user.name,
            password: user.password
        }
    })

    return userUpdated
}

export async function userRepository_delete(id: number) {
    await prismaClient.user.delete({
        where: { id }
    });
}

export async function userRepository_getById(id: number) {
    return await prismaClient.user.findFirst({
        where: { id }

    });
}

export async function userRepository_getByEmail(email: string) {
    return await prismaClient.user.findFirst({
        where: { email }
    });
}

export async function userRepository_getAll() {
    return await prismaClient.user.findMany();
}


