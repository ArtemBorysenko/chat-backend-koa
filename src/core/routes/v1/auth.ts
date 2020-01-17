import Router from 'koa-router';
import {loginValidation, registerValidation} from "../../../utils/validations";
import {AuthCtrl} from "../../../controllers"
import socket from "socket.io";

import Koa from 'koa';

export default (io : socket.Server) : Router => {
    const router = new Router()
    const AuthController = new AuthCtrl(io);

    router.get("/",  async ( ctx: Koa.Context, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { msg: "auth!" }
    })

    router.post("/signin", loginValidation, async ( ctx: Koa.Context, next: Koa.Next ) => {
        try {
            const token = await AuthController.login(ctx)

            ctx.status = 200
            ctx.body = token
        } catch (err) {
            throw await err
        }
     })

    router.post("/signup", registerValidation, async ( ctx: Koa.Context, next: Koa.Next ) => {
       try {
           const user = await AuthController.create(ctx)

           ctx.status = 200
           ctx.body = user
       } catch (err) {
           throw await err
       }
    })

    router.get("/verify", async ( ctx: Koa.Context, next: Koa.Next ) => {
        try {
            const verify = await AuthController.verify(ctx)

            ctx.status = 200
            ctx.body = verify
        } catch (err) {
            throw await err
        }
    })

    return router
}