import Koa from "koa"
import Router from "koa-router"
import logger from "koa-logger"
import json from "koa-json"

import { createServer } from 'http'

import  config  from './config'

import './core/database/mongo-connection';
import index from './core/routes';
import createSocket from './core/socket'
import koaBody from "koa-body";

// function CreateApp() { // ? App ?
    const app = new Koa()
    const router = new Router()

    const http = createServer(app.callback())



    const io = createSocket( app.listen(config.port, () => {
        console.log("Koa started")
    }))

    app.use(koaBody())
    app.use(logger())
    // app.use(json())

    router.use(async ( ctx: Koa.Context, next: Koa.Next ) => {
        try {
            await next()
        } catch (err) {
            ctx.status = err.status || 500
            ctx.body = {ERROR: err,
                message: err.message}
            ctx.app.emit('error', err, ctx)
        }
    });

    router.get("/", async ( ctx: Koa.Context, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { msg: "Hello world!" }
    })

    router.get("/echo", async ( ctx: Koa.Context, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { Server: "Online" }
    })

    router.get("/status", async ( ctx: Koa.Context, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { Status: "Online" } // ?
    })

    router.use("", index(io).routes())

    app.on('error', (err, ctx) => {
        /* centralized error handling:
         *   console.log error
         *   write error to log file
         *   save error and request information to database if ctx.request match condition
         *   ...
        */
    })

    app.use(router.allowedMethods()).use(router.routes())

    // return app
// }


// if (!module.parent) {
//     app.listen(config.port, () => {
//         console.log("Koa started")
//     })
// }

export default app