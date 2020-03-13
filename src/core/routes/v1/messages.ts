import Router from "koa-router"
import {MessageCtrl} from "../../../controllers"
import socket from "socket.io";
import Koa from "koa";

export default (io: socket.Server) : Router => {
    const router = new Router()

    const MessageController = new MessageCtrl(io)

    router.get("/", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
        try {
            const message = await MessageController.index(ctx)

            ctx.status = 200
            ctx.body = message
        } catch (err) {
            throw await err
        }
    })

    router.get("/", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
        try {
            const message = await MessageController.indexPage(ctx)

            ctx.status = 200
            ctx.body = message
        } catch (err) {
            throw await err
        }
    })

    router.post("/", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
            try {
                const message = await MessageController.create(ctx)

                io.emit('SERVER:MESSAGE_NEW', JSON.stringify(message));

                ctx.status = 200
                ctx.body = [message]
            } catch (err) {
                throw await err
            }
        })

    router.delete("/", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
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