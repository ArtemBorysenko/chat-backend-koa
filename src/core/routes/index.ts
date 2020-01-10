//TODO Create Koa Routers
import Koa from "koa"
import Router from "koa-router"
// const router = new Router()

import socket, {Socket} from "socket.io"
import { updateLastSeen, checkAuth } from "../../middlewares";

import { dialogs, files, messages, user } from "./v1"

export default (io : socket.Server) : Router => {
    const router = new Router()

    router.use(checkAuth)
    router.use(updateLastSeen)

    router.use("/user",  user(io).routes)
    router.use("/dialogs", dialogs(io).routes())
    router.use("/messages", messages(io).routes())
    router.use("/files", files().routes())

    return router
}