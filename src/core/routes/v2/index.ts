import messages from './messages';

import Router from "koa-router"
import socket from "socket.io"

export default (io : socket.Server) : Router => {
    const router = new Router()

    router.use("/messages", messages(io).routes())

    return router
}