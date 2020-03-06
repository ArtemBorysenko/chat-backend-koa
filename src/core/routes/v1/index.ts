import dialogs from './dialogs';
import files from './files';
import messages from './messages';
import user from './user';
import auth from './auth';

import Router from "koa-router"
import socket from "socket.io"

export default (io : socket.Server) : Router => {
    const router = new Router()

    router.use("/auth", auth(io).routes())
    router.use("/user",  user(io).routes())
    router.use("/dialogs", dialogs(io).routes())
    router.use("/messages", messages(io).routes())
    router.use("/files", files().routes())

    return router
}