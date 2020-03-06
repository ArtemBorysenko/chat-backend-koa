import Router from "koa-router"
import { UserCtrl } from "../../../controllers"
import socket from "socket.io";

import Koa from "koa";

export default (io: socket.Server) : Router => {
    const router = new Router()

    const UserController = new UserCtrl(io)

    router.get("/me", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
        try {
            const user = await UserController.getMe(ctx)

            console.log("user me" , user)

            ctx.status = 200
            ctx.body = user
        } catch (err) {
            throw await err
        }
    })

    router.get("/find", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
            try {
                const user = await UserController.findUsers(ctx)
                ctx.status = 200
                ctx.body = user
            } catch (err) {
                throw await err
            }
    })

    router.get("/:id", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
        try {
            const user = await UserController.show(ctx)

            console.log("user :", user)

            ctx.status = 200
            ctx.body = user
        } catch (err) {
            throw await err
        }
    })

     router.delete("/:id", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
         try {
             const user = await UserController.delete(ctx)
             ctx.status = 200
             ctx.body = {user}
         } catch (err) {
             throw await err
         }
     });

    return router
}