import Router from "koa-router"
import {MessageCtrl} from "../../../controllers"
import socket from "socket.io";
import Koa from "koa";

export default (io: socket.Server) : Router => {
    const router = new Router()

    const MessageController = new MessageCtrl(io)

    router.get("/", async ( ctx: Koa.Context, next: Koa.Next ) => {
        try {
            const message = await MessageController.index(ctx)

            ctx.status = 200
            ctx.body = message
        } catch (err) {
            throw await err
        }
    })

    router.post("/", async ( ctx: Koa.Context, next: Koa.Next ) => {
            try {
                const message = await MessageController.create(ctx)

                ctx.status = 200
                ctx.body = [message]
            } catch (err) {
                throw await err
            }
        })

    router.delete("/", async ( ctx: Koa.Context, next: Koa.Next ) => {
                try {
                    const message = await MessageController.delete(ctx)

                    ctx.status = 200
                    ctx.body = message
                } catch (err) {
                    throw await err
                }
            })

    return router
}