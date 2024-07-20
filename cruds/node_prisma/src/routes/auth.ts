import { Router } from "express";
import {
    userController_create,
    userController_delete,
    userController_getAll,
    userController_getByEmail,
    userController_getById,
    userController_update
} from "../controller/userController";

const userRouter: Router = Router()


userRouter.post("/create", userController_create)
userRouter.delete("/delete/:userId", userController_delete)
userRouter.get("/get", userController_getAll)
userRouter.get("/get/:userId", userController_getById)
userRouter.get("/email/:userEmail", userController_getByEmail)
userRouter.put("/update/:userId", userController_update)


export default userRouter
