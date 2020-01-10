import Router from "koa-router"
import {loginValidation, registerValidation} from "../../../utils/validations";//TODO validator for signup and signin
import { UserCtrl } from "../../../controllers"
import socket from "socket.io";

export default (io: socket.Server) : Router => {
    const router = new Router()

    const UserController = new UserCtrl(io);

    // router.get("/me", UserController.getMe);
    //
    // router.get("/verify", UserController.verify);
    //
    // router.post("/signup", UserController.create);
    //
    // router.post("/signin", UserController.login);
    //
    // router.get("/find", UserController.findUsers);
    //
    // router.get("/:id", UserController.show);
    //
    // router.delete("/:id", UserController.delete);

    return router
}