import Koa from "koa"
import Router from "koa-router"

import socket from "socket.io"
import { updateLastSeen, checkAuth } from "../../middlewares"
import v1 from "./v1"
import v2 from "./v2"

export default (io : socket.Server) : Router => {
    const router = new Router()

    router.use(checkAuth)
    router.use(updateLastSeen)

    router.use("/v1", v1(io).routes())
    router.use("/v2", v2(io).routes())

    return router
}