// import validator from "validator";
// import koaBody from 'koa-body'
// import Koa from "koa";
//
// interface IValidationError {
//     value: string,
//     msg: string,
//     param: string
// }
//
// async function registration ( ctx: Koa.Context, next: Koa.Next ) {
//     const errors : IValidationError[] | undefined = []
//
//     try {
//
//         if (!validator.isEmail(ctx.request.body.email)) {
//             errors.push({
//                 value: ctx.request.body.email,
//                 msg: "Invalid email",
//                 param: "email",
//             })
//         }
//         if (validator.isEmpty(ctx.request.body.password)) {
//             errors.push({
//                 value: ctx.request.body.password,
//                 msg: "password is empty",
//                 param: "password",
//             })
//         }
//         if (!validator.isLength(ctx.request.body.password, {min: 4, max: undefined})) {
//             errors.push({
//                 value: ctx.request.body.password,
//                 msg: "password must be at least 4 chars long",
//                 param: "password",
//             })
//         }
//         if (validator.isEmpty(ctx.request.body.fullname)) {
//             errors.push({
//                 value: ctx.request.body.fullname,
//                 msg: "fullname is empty",
//                 param: "fullname",
//             })
//         }
//         if (!validator.isLength(ctx.request.body.fullname, {min: 4, max: undefined})) {
//             errors.push({
//                 value: ctx.request.body.fullname,
//                 msg: "fullname must be at least 4 chars long",
//                 param: "fullname",
//             })
//         }
//
//         if (errors[0] != undefined) throw new Error
//
//         next()
//
//     } catch (err) {
//         ctx.throw(422, {message: errors})
//     }
// }
//
// export default registration

import validator from "validator";
import koaBody from 'koa-body'
import Koa from 'koa';

interface IValidationError {
    value: string,
    msg: string,
    param: string
}

async function registration ( ctx: Koa.Context, next: Koa.Next ) {
    const errors : IValidationError[] | undefined = []
    try {
        if (!validator.isEmail(ctx.request.body.email)) {
            errors.push({
                value: ctx.request.body.email,
                msg: "Invalid email",
                param: "email",
            })
        }
        if (validator.isEmpty(ctx.request.body.password)) {
            errors.push({
                value: ctx.request.body.password,
                msg: "password is empty",
                param: "password",
            })
        }
        if (!validator.isLength(ctx.request.body.password, {min: 4, max: undefined})) {
            errors.push({
                value: ctx.request.body.password,
                msg: "password must be at least 4 chars long",
                param: "password",
            })
        }
        if (validator.isEmpty(ctx.request.body.fullname)) {
            errors.push({
                value: ctx.request.body.fullname,
                msg: "fullname is empty",
                param: "fullname",
            })
        }
        if (!validator.isLength(ctx.request.body.fullname, {min: 4, max: undefined})) {
            errors.push({
                value: ctx.request.body.fullname,
                msg: "fullname must be at least 4 chars long",
                param: "fullname",
            })
        }
        if (errors[0] != undefined) throw new Error

        await next()

    } catch (err) {
        ctx.throw(422, {message: errors})
    }
}

export default registration