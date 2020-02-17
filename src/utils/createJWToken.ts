import jwt from 'jsonwebtoken';
import config from "../config"
import { reduce } from 'lodash';

interface ILoginData {
    _id: string
    email: string;
    fullname: string;
}

export default async (user: ILoginData) => {
    let token = jwt.sign(
        { id: user._id, name: user.fullname, email: user.email},
        config.secret || '',
    );

    return token;
};