import Koa from "koa";
import { UserModel } from '../models';

declare module 'koa' {
    export interface Request {
        user?: any;
    }
}

//TODO interface ctx.USER

export default async ( ctx: Koa.Context, next: Koa.Next ) => {
    if (ctx.user) {
        UserModel.findOneAndUpdate(
            { _id: ctx.user.id },
            {
                last_seen: new Date()
            },
            { new: true },
            () => {}
        );
    }
    await next();
};