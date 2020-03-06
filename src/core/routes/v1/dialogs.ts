import Router from "koa-router"
import { DialogCtrl } from "../../../controllers"
import socket from "socket.io"
import Koa from "koa";

export default (io: socket.Server) : Router => {
    const router = new Router()
    const DialogController = new DialogCtrl(io)

    router.get("/", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
        try {
            const dialog = await DialogController.index(ctx)

            ctx.status = 200
            ctx.body = dialog
        } catch (err) {
            throw err
        }
    })

    router.delete("/:id", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
        try {
            const dialog = await DialogController.delete(ctx)

            ctx.status = 200
            ctx.body = dialog
        } catch (err) {
            throw err
        }
    })

    router.post("/", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
        try {
            const dialog = await DialogController.create(ctx)

            ctx.status = 200
            ctx.body = dialog
        } catch (err) {
            throw err
        }
    })

    return router
}