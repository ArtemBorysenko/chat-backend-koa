import Router from "koa-router"
import {MessageCtrl} from "../../../controllers"
import socket from "socket.io";

export default (io: socket.Server) : Router => {
    const router = new Router()

    const MessageController = new MessageCtrl(io);

    // router.get("/", MessageController.index);

    // router.post("/", MessageController.create);

    // router.delete("/", MessageController.delete);

    return router
}