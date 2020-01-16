import { verifyJWTToken } from "../utils";
import Koa from "koa";

export default ( ctx: Koa.Context, next: Koa.Next ) => {
    if (
        ctx.path === "/auth/signin" ||
        ctx.path === "/auth/signup" ||
        ctx.path === "/auth/verify"
    ) {
        return next();
    }

    //TODO AccessToken
    // Headers: Authorization: Bearer *

    let token = ctx.request.headers.authorization
    token = token.slice(7, token.length)

    // const token = req.headers.token;

    verifyJWTToken(token)
        .then((user: any) => {
            ctx.state.user = user.data._doc
            next()
        })
        .catch(err => {
            ctx.status = 403
            ctx.body = { message: "Invalid auth token provided." }
        });
};