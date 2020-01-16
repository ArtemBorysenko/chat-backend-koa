import Router from "koa-router"
import { UserCtrl } from "../../../controllers"
import socket from "socket.io";

import * as User from "../../../models"
import Koa from "koa";

export default (io: socket.Server) : Router => {
    const router = new Router()

    router.get("/user",  async  (ctx: Koa.Context, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { msg: "user user!" }
    })

    const UserController = new UserCtrl(io);

    router.get("/me", async ( ctx: Koa.Context, next: Koa.Next ) => {
       const user = await UserController.getMe(ctx)
    });

    // router.get("/verify", UserController.verify);
    //
    // router.get("/find", UserController.findUsers);
    //
    router.get("/:id", async ( ctx: Koa.Context, next: Koa.Next ) => {
        try {
            const user : any = await UserController.show(ctx)
            ctx.body = {user}
        } catch (err) {
            // ? err.msg
            ctx.throw(404, err);
        }
    });
    //
    // router.delete("/:id", UserController.delete);
    return router
}