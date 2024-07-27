import { todoModel } from "./todoModel";

export interface todoListModel {
    id?: number,
    ownerId: number,
    title: string,
    Todos: todoModel[]
}
