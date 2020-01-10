import Koa from "koa"
import Router from "koa-router"
import logger from "koa-logger"
import json from "koa-json"

import { createServer } from 'http'
//TODO JWT

const config = require('./config.ts')

import './core/database/mongo-connection';
import index from './core/routes';
import createSocket from './core/socket'

// function CreateApp() { // ? App ?
    const app = new Koa()
    const router = new Router()

    router.get("/", async (ctx: Koa.Context, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { msg: "Hello world!" }

        await next()
    })

    router.get("/echo", async (ctx: Koa.Context, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { Server: "Online" }
    })

    router.get("/status", async (ctx: Koa.Context, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { Status: "Online" } // ?
    })

    // router.use("", index.routes())
    app.use(router.allowedMethods());
    app.use(router.routes());

//     return app
// }

// TODO Socket
const http = createServer(app.callback())
const io = createSocket(http)
index(io)

if (!module.parent) {
    app.listen(config.port, () => {
        console.log("Koa started")
    })
}

export default app