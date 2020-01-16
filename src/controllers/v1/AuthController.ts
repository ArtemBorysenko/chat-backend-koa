import express from 'express';
import Koa from "koa"
import { compareSync } from 'bcrypt';
import socket from 'socket.io';
import { query, validationResults, IValidationContext } from 'koa-req-validation';
import mailer from '../../core/mailer/mailer';

import {  UserModel } from '../../models';
import { IUser } from '../../models/v1/User';
import { createJWToken } from '../../utils';

class AuthCtrl {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    // delete = (req: express.Request, res: express.Response) => {
    //     const id: string = req.params.id;
    //     UserModel.findOneAndRemove({ _id: id })
    //         .then(user => {
    //             if (user) {
    //                 res.json({
    //                     message: `User ${user.fullname} deleted`
    //                 });
    //             }
    //         })
    //         .catch(() => {
    //             res.json({
    //                 message: `User not found`
    //             });
    //         });
    // };

    create = async (ctx: Koa.Context) => {
        try {
            const postData = {
                email: ctx.request.body.email,
                fullname: ctx.request.body.fullname,
                password: ctx.request.body.password
            };

            //TODO CONTROLLERS error handling
            // const errors = validationResult(req);
            //
            // if (!errors.isEmpty()) {
            //     return res.status(422).json({ errors: errors.array() });
            // }

            const user = await new UserModel(postData).save()
            return user
            //TODO deleted mailer.sendMail
        } catch (err) {
            ctx.throw(500, "ERROR REGISTRATION")
        }
    }

    // verify = (req: express.Request, res: express.Response) => {
    //     const hash = req.query.hash;
    //
    //     if (!hash) {
    //         return res.status(422).json({ errors: 'Invalid hash' });
    //     }
    //
    //     UserModel.findOne({ confirm_hash: hash }, (err, user) => {
    //         if (err || !user) {
    //             return res.status(404).json({
    //                 status: 'error',
    //                 message: 'Hash not found'
    //             });
    //         }
    //
    //         user.confirmed = true;
    //         user.save(err => {
    //             if (err) {
    //                 return res.status(404).json({
    //                     status: 'error',
    //                     message: err
    //                 });
    //             }
    //
    //             res.json({
    //                 status: 'success',
    //                 message: 'Аккаунт успешно подтвержден!'
    //             });
    //         });
    //     });
    // };

    login = (ctx: Koa.Context) => {
        const postData = {
            email: ctx.request.body.email,
            password: ctx.request.body.password
        };


        // ???? https://ppeerttu.github.io/koa-req-validation/
        const ctxAny : any = ctx
        const result = validationResults(ctxAny)

        if (result.hasErrors()) {
            ctx.throw(422, result.mapped())
        }

        // UserModel.findOne({ email: postData.email }, (err, user: IUser) => {
        //     if (err || !user) {
        //         return res.status(404).json({
        //             message: 'User not found'
        //         });
        //     }
        //
        //     if (compareSync(postData.password, user.password)) {
        //         const token = createJWToken(user);
        //         res.json({
        //             status: 'success',
        //             token
        //         });
        //     } else {
        //         res.status(403).json({
        //             status: 'error',
        //             message: 'Incorrect password or email'
        //         });
        //     }
        // });
    };
}

export default AuthCtrl
