import { UserModel } from "../model/userModel"
import { userRepository_create as userRepository_create, userRepository_delete, userRepository_getAll, userRepository_getByEmail, userRepository_getById, userRepository_update } from "../repository/userRepository"
import { hashSync } from "bcrypt"

export async function userService_create(name: string, email: string, password: string) {
    if (!name.trim() || !email.trim() || !password.trim()) {
        throw new Error(`Some value is empty`)
    }

    const user = await userRepository_getByEmail(email)
    if (user) {
        throw new Error("User Already exists!")
    }

    const userToCreate: UserModel = {
        name: name,
        email: email,
        password: hashSync(password, 10)
    }

    return userRepository_create(userToCreate)
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
        const { password, ...rest } = user
        return rest
    })
}

export async function userService_getById(id: number) {
    const user = await userRepository_getById(id)
    if (!user) {
        throw new Error(`User not found with this id: ${id}`)
    } else {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
}

export async function userService_getByEmail(email: string) {
    const user = await userRepository_getByEmail(email)
    if (!user) {
        throw new Error(`User not found with this email: ${email}`)
    } else {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    }

}

export async function userService_delete(id: number) {
    await userService_getById(id)

    userRepository_delete(id)
}

