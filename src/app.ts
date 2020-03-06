import Koa from "koa"
import Router from "koa-router"
import logger from "koa-logger"

import  config  from './config'

import './core/database/mongo-connection';
import index from './core/routes';
import createSocket from './core/socket'
import koaBody from "koa-body";

    const app = new Koa()
    const router = new Router()
    const io = createSocket( app.listen(config.port, () => {
        console.log("Koa started")
    }))

    app.use(koaBody())
    app.use(logger())

    router.use(async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
        try {
            await next()
        } catch (err) {
            ctx.status = err.status || 500
            ctx.body = {ERROR: err,
                message: err.message}
            ctx.app.emit('error', err, ctx)
        }
    });

    router.get("/", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { version: "0.3" }
    })

    router.get("/echo", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { Server: "Online" }
    })

    router.get("/status", async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { Status: "Online" } // ?
    })

    router.use("/api", index(io).routes())

    app.on('error', (err, ctx) => {
        /* centralized error handling:
         *   console.log error
         *   write error to log file
         *   save error and request information to database if ctx.request match condition
         *   ...
        */
    })

    app.use(router.allowedMethods()).use(router.routes())

export default app