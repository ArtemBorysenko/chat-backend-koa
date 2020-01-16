import Router from "koa-router"
import { DialogCtrl } from "../../../controllers"
import socket from "socket.io"
import Koa from "koa";

export default (io: socket.Server) : Router => {
    const router = new Router()

    const DialogController = new DialogCtrl(io)

    // router.get("/", async ( ctx: Koa.Context, next: Koa.Next ) => {
    //     DialogController.index(ctx)
    // })

    // router.delete("/:id", DialogController.delete)

    // router.post("/", DialogController.create)

    return router
}