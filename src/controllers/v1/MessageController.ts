import express from 'express';
import socket from 'socket.io';

import { MessageModel, DialogModel } from '../../models';
import Koa from "koa";

class MessageController {
    io: socket.Server

    constructor(io: socket.Server) {
        this.io = io
    }

    updateReadedStatus = async (ctx: Koa.Context, userId: string, dialogId: string) => {
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

    index = async (ctx: Koa.Context) => {
        try {
            const dialogId: string = ctx.query.dialog
            const userId: any = ctx.state.user.id //req.user._id, // any

            this.updateReadedStatus(ctx, userId, dialogId)

            const message = await MessageModel.find({dialog: dialogId})
                .populate(['dialog', 'user', 'attachments'])

            if (!message) ctx.throw(404, 'Messages not found')

            return message
        } catch (err) {
            throw err
        }
    }

    create = async (ctx: Koa.Context) => {
        try {
            const userId = ctx.state.user.id

            const postData = {
                text: ctx.request.body.text,
                dialog: ctx.request.body.dialog_id,
                attachments: ctx.request.body.attachments,
                user: userId,
            };

            const message = new MessageModel(postData)

            this.updateReadedStatus(ctx, userId, ctx.request.body.dialog_id)

            await message.save()
                .then((obj: any) => {
                    obj.populate(['dialog', 'user', 'attachments'],
                        (err: any, message: any) => {
                            if (err) ctx.throw(500, err)

                            DialogModel.findOneAndUpdate(
                                {_id: postData.dialog},
                                {lastMessage: message._id},
                                {upsert: true},
                                function (err) {
                                    if (err) if (err) ctx.throw(500, err)
                                },
                            );

                            this.io.emit('SERVER:NEW_MESSAGE', message)

                            return message
                        });
                })
        } catch (err) {
            throw err
        }
    }

    delete = async (ctx: Koa.Context) => {
        try {
            const id: string = ctx.query.id;
            const userId: any = ctx.state.user.id //req.user._id, //any

            MessageModel.findById(id, (err, message: any) => {
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
                    return ctx.throw(403, 'Not have permission')
                }
            });
        } catch (err) {

        }
    }
}

export default MessageController