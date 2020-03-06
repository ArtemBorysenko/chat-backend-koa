import socket from 'socket.io';

import { MessageModel, DialogModel } from '../../models';
import Koa from "koa";

class MessageController {
    io: socket.Server

    constructor(io: socket.Server) {
        this.io = io
    }

    updateReadedStatus = async (ctx: Koa.DefaultContext, userId: string, dialogId: string) => {
        try {
            const message = await MessageModel.updateMany(
                {dialog: dialogId, user: {$ne: userId}},
                {$set: {readed: true}})

            if (!message) ctx.throw(500, "error")
            this.io.emit('SERVER:MESSAGES_READED', {
                userId,
                dialogId,
            });
            return message
        } catch (err) {
            throw err
        }
    };

    index = async (ctx: Koa.DefaultContext) => {
        try {

            const dialogIsHave = await DialogModel.findOne({
                author: ctx.state.user.id,
                partner: ctx.query.partner,
            }).then((obj: any) => {
                return obj._id;
            }).catch((err: any) => {
                ctx.throw(404, 'User not found')
            })

            const dialogId: string = dialogIsHave
            const userId: string = ctx.state.user.id

            this.updateReadedStatus(ctx, userId, dialogId)

            const message = await MessageModel.find({dialog: dialogId})
                .sort({createdAt: -1})
                // .exec(function(err,data){
                //     console.log(data)
                //     return data;
                // });
                .populate(['dialog', 'user', 'attachments'])

            if (!message) ctx.throw(404, 'Messages not found')

            return message
        } catch (err) {
            throw err
        }
    }

    indexPage = async (ctx: Koa.DefaultContext) => {
        try {

            const perPage = 10
            const page = 0 || ctx.query.page

            const dialogIsHave = await DialogModel.findOne({
                author: ctx.state.user.id,
                partner: ctx.query.partner,
            }).then((obj: any) => {
                return obj._id;
            }).catch((err: any) => {
                ctx.throw(404, 'User not found')
            })

            const dialogId: string = dialogIsHave
            const userId: string = ctx.state.user.id

            this.updateReadedStatus(ctx, userId, dialogId)

            const message = await MessageModel.find({dialog: dialogId})
                .sort({createdAt: -1})
                .limit(perPage)
                .skip(perPage * page)
                // .exec(function(err,data){
                //     console.log(data)
                //     return data;
                // });
                .populate(['dialog', 'user', 'attachments'])

            if (!message) ctx.throw(404, 'Messages not found')

            return message
        } catch (err) {
            throw err
        }
    }

    create = async (ctx: Koa.DefaultContext) => {
        try {
            const userId = ctx.state.user.id

            const postData = {
                text: ctx.request.body.text,
                dialog: ctx.request.body.dialog_id,
                attachments: ctx.request.body.attachments,
                user: userId,
            }

            const message = new MessageModel(postData)

            this.updateReadedStatus(ctx, userId, ctx.request.body.dialog_id)

             await message.save()
                .then( async (obj: any) => {
                   return await obj.populate(['dialog', 'user', 'attachments']).execPopulate()})
                .catch((err: any) => ctx.throw(500, err));

            await DialogModel.findOneAndUpdate(
                {_id: postData.dialog},
                {lastMessage: message._id},
                {upsert: true},
                function (err) {
                    if (err) if (err) ctx.throw(500, err)
                },
            );

            this.io.emit('SERVER:MESSAGE_NEW', JSON.stringify(message));

            return message;
        } catch (err) {
            throw err
        }
    }

    delete = async (ctx: Koa.DefaultContext) => {
        try {
            const id: string = ctx.query.id;
            const userId: any = ctx.state.user.id //req.user._id, //any

            return await MessageModel.findById(id, async (err, message: any) => {
                if (err || !message) ctx.throw(500, err)

                if (message.user.toString() === userId) {
                    const dialogId = message.dialog;
                    message.remove();

                    MessageModel.findOne(
                        {dialog: dialogId},
                        {},
                        {sort: {created_at: -1}},
                        (err, lastMessage) => {
                            if (err) ctx.throw(500, err)

                            DialogModel.findById(dialogId, (err, dialog: any) => {
                                if (err) ctx.throw(500, err)

                                dialog.lastMessage = lastMessage;
                                dialog.save()
                            });
                        },
                    );

                    return 'Message deleted'

                } else {
                     ctx.throw(403, 'Not have permission')
                }
            })
        } catch (err) {
            throw err
        }
    }
}

export default MessageController