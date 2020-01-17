import express from 'express';
import socket from 'socket.io';

import { DialogModel, MessageModel } from '../../models';
import Koa from "koa";

class DialogController {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    index = async ( ctx: Koa.Context ) => {//TODO need test dialog?
        try {
            // const userId = req.user._id;
            const userId = ctx.state.user.id

            console.log("ctx.state.user :", ctx.state.user.id)

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

         if(await DialogModel.findOne({
             author: ctx.state.user.id,
             partner: ctx.request.body.partner,
         })) ctx.throw(403, 'Такой диалог уже есть')

         const dialog = new DialogModel(postData);

         await dialog.save()
                .then((dialogObj: any) => {
                    const message = new MessageModel({
                        text: ctx.request.body.text,
                        user:  ctx.state.user,
                        dialog: dialogObj._id,
                    });

                    message
                        .save()
                        .then(() => {
                            dialogObj.lastMessage = message._id;
                            dialogObj.save().then(() => {
                                this.io.emit('SERVER:DIALOG_CREATED', {
                                    ...postData,
                                    dialog: dialogObj,
                                });
                                return dialogObj
                            });
                        })
                        .catch(reason => {
                            return reason
                        });
                })

        // const dialogObj : any = await dialog.save()
        // const message = new MessageModel({
        //         text: ctx.request.body.text,
        //         user: ctx.state.user, //req.user._id,
        //         dialog: dialogObj._id,
        //     });
        //
        // const dialogObj2 : any =   await message.save()
        //
        //     dialogObj2.lastMessage = message._id;
        //     dialogObj2.save().then(() => {
        //         this.io.emit('SERVER:DIALOG_CREATED', {// TODO DIALOG SOCKET
        //             ...postData,
        //             dialog: dialogObj2,
        //         });
        //         return dialogObj2
        //     })
        //     message.save()
        //     dialogObj.lastMessage = message._id;
        //     dialogObj.save().then(() => {
        //         this.io.emit('SERVER:DIALOG_CREATED', {
        //             ...postData,
        //             dialog: dialogObj,
        //         });
        //         return dialogObj2
        //     });
    } catch (err) {
        throw err
    }
                    //TODO
                    // const dialog = new DialogModel(postData);
                    //
                    // dialog
                    //     .save()
                    //     .then((dialogObj: any) => {
                    //         const message = new MessageModel({
                    //             text: req.body.text,
                    //             user: req.user._id,
                    //             dialog: dialogObj._id,
                    //         });
                    //
                    //         message
                    //             .save()
                    //             .then(() => {
                    //                 dialogObj.lastMessage = message._id;
                    //                 dialogObj.save().then(() => {
                    //                     res.json(dialogObj);
                    //                     this.io.emit('SERVER:DIALOG_CREATED', {
                    //                         ...postData,
                    //                         dialog: dialogObj,
                    //                     });
                    //                 });
                    //             })
                    //             .catch(reason => {
                    //                 res.json(reason);
                    //             });
                    //     })
                    //     .catch(err => {
                    //         res.json({
                    //             status: 'error',
                    //             message: err,
                    //         });
                    //     });
    };

    delete = async ( ctx: Koa.Context ) => {
        try {
            const id: string = ctx.params.id;
            const dialog = await DialogModel.findOneAndRemove({_id: id})

            if (!dialog) ctx.throw(404, `Dialog not found`)

            return `Dialog deleted`

        } catch (err) {
            throw err
        }
    }
}

export default DialogController;