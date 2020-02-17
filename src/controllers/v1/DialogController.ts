import express from 'express';
import socket from 'socket.io';

import { DialogModel, MessageModel } from '../../models';
import Koa from "koa";

class DialogController {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    index = async ( ctx: Koa.Context ) => {
        try {
            // const userId = req.user._id;
            const userId = ctx.state.user.id

            const dialog = await DialogModel.find()
                .or([{author: userId}, {partner: userId}])
                .populate(['author', 'partner'])
                .populate({
                    path: 'lastMessage',
                    populate: {
                        path: 'user',
                    },
                })

            if (!dialog) return ctx.throw(404, 'Dialogs not found')

            return dialog

        } catch (err) {
            throw err
        }
    };

    create = async ( ctx: Koa.Context ) => {
        try {
            const postData = {
                author: ctx.state.user.id,
                partner: ctx.request.body.partner,
            }

            if (await DialogModel.findOne({
                author: ctx.state.user.id,
                partner: ctx.request.body.partner,
            })) ctx.throw(403, 'Такой диалог уже есть')

            const dialog = new DialogModel(postData);

            return await dialog.save()
                .then(async (dialogObj: any) => {
                    const message = new MessageModel({
                        text: ctx.request.body.text,
                        user: ctx.state.user.id,
                        dialog: dialogObj._id,
                    });

            return await message
                        .save()
                        .then(async () => {
                            dialogObj.lastMessage = message._id;
                            return await dialogObj.save().then( async () => {
                                this.io.emit('SERVER:DIALOG_CREATED', {
                                    ...postData,
                                    dialog: dialogObj,
                                })
                                return await dialogObj
                            });
                        })
                })
        } catch (err) {
            throw err
        }
    }

    delete = async ( ctx: Koa.Context ) => {
        try {
            const id: string = ctx.params.id;
            const dialog = await DialogModel.findOneAndRemove({_id: id})
            await MessageModel.deleteMany({dialog: id})
            // await MessageModel.remove({dialog: id})

            if (!dialog) ctx.throw(404, `Dialog not found`)

            return `Dialog deleted`

        } catch (err) {
            throw err
        }
    }
}

export default DialogController;