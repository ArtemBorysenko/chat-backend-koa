import Koa from "koa"
import Router from "koa-router"

import socket from "socket.io"
import { updateLastSeen, checkAuth } from "../../middlewares";
import { dialogs, files, messages, user, auth } from "./v1"

export default (io : socket.Server) : Router => {
    const router = new Router()

    // router.use(checkAuth) //null
    // router.use(updateLastSeen) //null

    router.get("/users",  async (ctx: Koa.Context, next: Koa.Next ) => {
        ctx.status = 200
        ctx.body = { msg: "Hello user!" }
    })

    router.use("/auth", auth(io).routes())
    router.use("/user",  user(io).routes())
    router.use("/dialogs", dialogs(io).routes())
    router.use("/messages", messages(io).routes())
    router.use("/files", files().routes())

    return router
}