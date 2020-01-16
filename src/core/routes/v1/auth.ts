import Router, { IRouterContext } from 'koa-router';
import {loginValidation, registerValidation} from "../../../utils/validations";//TODO validator for signup and signin
import {param, query, body, validationResults, IValidationContext } from 'koa-req-validation';
import {AuthCtrl, UserCtrl} from "../../../controllers"
import socket from "socket.io";

import Koa, { ParameterizedContext } from 'koa';
import * as User from "../../../models"

export default (io : socket.Server) : Router => {
    const router = new Router()

    router.get("/",  async ( ctx: Koa.Context, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { msg: "auth!" }
    })


    router.post("/signin", loginValidation, async ( ctx: Koa.Context, next: Koa.Next ) => {
        try {
            const AuthController = new AuthCtrl(io);

            const user = await AuthController.create(ctx)

            ctx.status = 200
            ctx.body = user
        } catch (err) {
            //TODO try/catch error validations
            ctx.throw("422", {message: err.message})
        }
     })

    // const UserController = new UserCtrl(io);

    router.post("/signup", registerValidation, async ( ctx: Koa.Context, next: Koa.Next ) => {
       try {
           const AuthController = new AuthCtrl(io);

           const user = await AuthController.create(ctx)
           // console.log("user :", user)
           ctx.status = 200
           ctx.body = user
       } catch (err) {
           throw err
       }
    })

    // router.post("/signin", UserController.login);

    // router.get("/verify", UserController.verify);

    return router
}