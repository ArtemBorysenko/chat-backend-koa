import Koa from "koa"
import socket from 'socket.io';

import { UserModel } from '../../models';

class UserController {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    show = async (ctx: Koa.Context) => {
        try {

            const id: string = ctx.params.id // express req.params.id
            const user = await UserModel.findById(id)

            return user

        }catch (err) {
            throw await err
        }
    }

    getMe = async (ctx: Koa.Context) => {
        try {
            const id: string = ctx.state.user.id
            const user = await UserModel.findById(id)

            return user

        } catch (err) {
            throw await err
        }
    }

    findUsers = async (ctx: Koa.Context) => {
        try {
            const query: string = ctx.params.query;
            console.log("query :", query)
            const users = await UserModel.find().or([
                {fullname: new RegExp(query, 'i')},
                {email: new RegExp(query, 'i')}
            ])

            return users

        } catch (err) {
            throw err
        }
    }

    delete = async (ctx: Koa.Context) => {
        try {
            const id: string = ctx.params.id;
            const user : any = await UserModel.findOneAndRemove({_id: id})

            return `User ${user.fullname} deleted`

        } catch (err) {
            throw err
        }
    };
 }

export default UserController
