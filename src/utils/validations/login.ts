import validator from "validator";
import Koa from 'koa';

interface IValidationError {
    value: string,
    msg: string,
    param: string
}

async function login ( ctx: Koa.Context, next: Koa.Next ) {
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

    if (errors[0] != undefined) ctx.throw(422, errors)

    await next()

} catch (err) {
    throw await err
}
}

export default login