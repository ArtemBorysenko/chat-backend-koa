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

        const user = await verifyJWTToken(ctx.header.authorization)
            ctx.state.user = user
            await next()
} catch (err) {
        ctx.throw(401, err)
}
}