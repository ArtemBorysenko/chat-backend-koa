import express from "express";
import fs from "fs";

import cloudinary from "../../core/cloudinary"; //TODO cloudinary
import { UploadFileModel } from "../../models";
import Koa from "koa";

class UserController {
    create = async ( ctx: Koa.Context ) => {
        try {
            const userId = ctx.state.user.id //req.user._id,
            const file: any = ctx.state.file // TODO req.file

            cloudinary.v2.uploader
                .upload_stream({resource_type: "auto"}, (error: any, result: any) => {
                    if (error) {
                        throw new Error(error);
                    }

                    const fileData = {
                        filename: result.original_filename,
                        size: result.bytes,
                        ext: result.format,
                        url: result.url,
                        user: userId
                    };

                    const uploadFile = new UploadFileModel(fileData);

                    uploadFile
                        .save()
                        .then((fileObj: any) => {
                            console.log({
                                status: "success",
                                file: fileObj
                            });
                        })
                })
                .end(file.buffer);
        } catch (err) {
            throw err
        }
    };

    delete = async () => {};
}

export default UserController;