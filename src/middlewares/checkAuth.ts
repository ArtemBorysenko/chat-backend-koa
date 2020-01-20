import { verifyJWTToken } from "../utils";
import Koa from "koa";

export default async ( ctx: Koa.Context, next: Koa.Next ) => {
    try {
        if (
            ctx.path === "/auth/signin" ||
            ctx.path === "/auth/signup" ||
            ctx.path === "/auth/verify"
        ) {
            return await next()
        }

        //TODO AccessToken
        // Headers: Authorization: Bearer *

        // let token = ctx.header.authorization
        // token = token.slice(7, token.length)

        // const token = ctx.header.authorization
        // console.log("ctx.header.authorization :", ctx.header.authorization)

        verifyJWTToken(ctx.header.authorization)
            .then(async (user: any) => {
                ctx.state.user = user//?
                await next()
            })
            .catch(err => {
                 ctx.throw(401, "Invalid auth token provided.")
            })
    } catch (err) {
        throw err
    }
};