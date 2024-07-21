import { Router } from "express";
import {
    createUser,
    deleteUser,
    getUsers,
    getUserByEmail,
    getUserById,
    loginController,
    updateUser
} from "../controller/userController";

const userRouter: Router = Router()


userRouter.post("/create", createUser)
userRouter.post("/login", loginController)
userRouter.delete("/delete/:userId", deleteUser)
userRouter.get("/get", getUsers)
userRouter.get("/get/:userId", getUserById)
userRouter.get("/email/:userEmail", getUserByEmail)
userRouter.put("/update/:userId", updateUser)


export default userRouter
