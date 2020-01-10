import Router from "koa-router"
import { DialogCtrl } from "../../../controllers"
import socket from "socket.io"

export default (io: socket.Server) : Router => {
    const router = new Router()

    const DialogController = new DialogCtrl(io)

    // router.get("/", DialogController.index)

    // router.delete("/:id", DialogController.delete)

    // router.post("/", DialogController.create)

    return router
}