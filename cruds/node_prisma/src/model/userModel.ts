import { todoListModel } from "./todoListModel"

export interface UserModel {
    id?: number
    name: string
    email: string
    password: string
    lists: todoListModel[]
}
