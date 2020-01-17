import express from 'express';
import socket from 'socket.io';

import { MessageModel, DialogModel } from '../../models';
import Koa from "koa";

class MessageController {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    updateReadedStatus = async ( ctx: Koa.Context, userId: string, dialogId: string) => {
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

    index = async ( ctx: Koa.Context ) => {
        try {
            const dialogId: string = ctx.query.dialog;
            const userId: any = ctx.state.user //req.user._id, // any

            this.updateReadedStatus(ctx, userId, dialogId);

            const message = await MessageModel.find({dialog: dialogId})
                .populate(['dialog', 'user', 'attachments'])

            if (!message) ctx.throw(404, 'Messages not found')

            return message
        } catch (err) {
            throw err
        }
    };

    // create = (req: any, res: express.Response) => {
    //     const userId = req.user._id;
    //
    //     const postData = {
    //         text: req.body.text,
    //         dialog: req.body.dialog_id,
    //         attachments: req.body.attachments,
    //         user: userId,
    //     };
    //
    //     const message = new MessageModel(postData);
    //
    //     this.updateReadedStatus(res, userId, req.body.dialog_id);
    //
    //     message
    //         .save()
    //         .then((obj: any) => {
    //             obj.populate(['dialog', 'user', 'attachments'], (err: any, message: any) => {
    //                 if (err) {
    //                     return res.status(500).json({
    //                         status: 'error',
    //                         message: err,
    //                     });
    //                 }
    //
    //                 DialogModel.findOneAndUpdate(
    //                     { _id: postData.dialog },
    //                     { lastMessage: message._id },
    //                     { upsert: true },
    //                     function(err) {
    //                         if (err) {
    //                             return res.status(500).json({
    //                                 status: 'error',
    //                                 message: err,
    //                             });
    //                         }
    //                     },
    //                 );
    //
    //                 res.json(message);
    //
    //                 this.io.emit('SERVER:NEW_MESSAGE', message);
    //             });
    //         })
    //         .catch(reason => {
    //             res.json(reason);
    //         });
    // };
    //
    // delete = (req: express.Request, res: express.Response) => {
    //     const id: string = req.query.id;
    //     const userId: any = req.user //req.user._id, //any
    //
    //     MessageModel.findById(id, (err, message: any) => {
    //         if (err || !message) {
    //             return res.status(404).json({
    //                 status: 'error',
    //                 message: 'Message not found',
    //             });
    //         }
    //
    //         if (message.user.toString() === userId) {
    //             const dialogId = message.dialog;
    //             message.remove();
    //
    //             MessageModel.findOne(
    //                 { dialog: dialogId },
    //                 {},
    //                 { sort: { created_at: -1 } },
    //                 (err, lastMessage) => {
    //                     if (err) {
    //                         res.status(500).json({
    //                             status: 'error',
    //                             message: err,
    //                         });
    //                     }
    //
    //                     DialogModel.findById(dialogId, (err, dialog: any) => {
    //                         if (err) {
    //                             res.status(500).json({
    //                                 status: 'error',
    //                                 message: err,
    //                             });
    //                         }
    //
    //                         dialog.lastMessage = lastMessage;
    //                         dialog.save();
    //                     });
    //                 },
    //             );
    //
    //             return res.json({
    //                 status: 'success',
    //                 message: 'Message deleted',
    //             });
    //         } else {
    //             return res.status(403).json({
    //                 status: 'error',
    //                 message: 'Not have permission',
    //             });
    //         }
    //     });
    // };
}

export default MessageController;