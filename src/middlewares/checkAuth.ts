import { verifyJWTToken } from "../utils";
import Koa from "koa";

export default async ( ctx: Koa.DefaultContext, next: Koa.Next ) => {
    try {
        if (
            ctx.path === "/api/v1/auth/signin" ||
            ctx.path === "/api/v1/auth/signup" ||
            ctx.path === "/api/v1/auth/verify"
        ) {
            return await next()
        }

        const user = await verifyJWTToken(ctx.header.authorization)
            ctx.state.user = user
            await next()
} catch (err) {
        ctx.throw(401, err)
}
}