import mongoose, { Schema, Document } from 'mongoose';
import  validator  from 'validator';
import { generatePasswordHash } from '../../utils';

import datefns from 'date-fns';
import {strict} from "assert";

export interface IUser extends Document {
    email: string;
}

const UserSchema = new Schema(
    {
        email: {
            type: String,
            require: 'Email address is required', // ?
            validate: [validator.isEmail, 'Invalid email'],
            unique: true,
        },
    },
    {
        timestamps: true,
    },
);

const UserModel = mongoose.model('CreateUser', UserSchema);

export default UserModel;