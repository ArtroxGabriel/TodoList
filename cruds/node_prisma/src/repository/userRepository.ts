import { prismaClient } from "../config";
import { UserModel } from "../model/userModel";

export const createUserRepo = async (user: UserModel) => {
    const userCreated = await prismaClient.user.create({
        data: {
            name: user.name,
            email: user.email,
            password: user.password
        }
    })
    return userCreated
}

export async function updateUserRepo(id: number, user: UserModel) {
    const userUpdated = await prismaClient.user.update({
        where: { id },
        data: {
            name: user.name,
            password: user.password
        },
        include: {
            List: true
        }
    })

    return userUpdated
}

export async function deleteUserRepo(id: number) {
    await prismaClient.user.delete({
        where: { id }
    });
}

export async function getByIdRepo(id: number) {
    return await prismaClient.user.findFirst({
        where: { id }
    });
}

export async function getByEmailRepo(email: string) {
    return await prismaClient.user.findFirst({
        where: { email }
    });
}

export async function getUsersRepo() {
    return await prismaClient.user.findMany();
}


