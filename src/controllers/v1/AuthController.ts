import Koa from "koa"
import { compareSync } from 'bcrypt';
import socket from 'socket.io';

import {  UserModel } from '../../models';
import { IUser } from '../../models/v1/User';
import { createJWToken } from '../../utils';

class AuthCtrl {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    create = async (ctx: Koa.Context) => {
        try {
            const postData = {
                email: ctx.request.body.email,
                fullname: ctx.request.body.fullname,
                password: ctx.request.body.password
            };

            const user = await new UserModel(postData).save()
            return user
            //TODO deleted mailer.sendMail
        } catch (err) {
            ctx.throw(500, err)
        }
    }

    verify =  async (ctx: Koa.Context) => {
        try {
            const hash = ctx.query.hash;//?

            console.log("query : ", ctx.query.hash)// TODO CONTROLLER AUTH verify

            if (!hash)  ctx.throw(422, 'Invalid hash')

            const user = await UserModel.findOne({ confirm_hash: hash })

            if (!user) ctx.throw(404, 'Hash not found')

            user.confirmed = true;
            user.save();

            return 'Аккаунт успешно подтвержден!'

        } catch (err) {
            throw await err
        }
    }

    login = async (ctx: Koa.Context) => {
        try {
        const postData = {
            email: ctx.request.body.email,
            password: ctx.request.body.password
        };

            const user : IUser | null = await UserModel.findOne({ email: postData.email })
            if (!user) ctx.throw(404, 'User not found')

            if (!compareSync(postData.password, user.password)) ctx.throw(403, 'Incorrect password or email')

            const token = await createJWToken(user)// TODO add refreshToken
            return token

        } catch (err) {
            throw await err
        }
    };
}

export default AuthCtrl
