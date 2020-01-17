import jwt from 'jsonwebtoken';
import config from "../config"
import { reduce } from 'lodash';

interface ILoginData {//??email password
    _id: string
    email: string;
    fullname: string;
}

export default async (user: ILoginData) => {
    let token = jwt.sign(
        { id: user._id, name: user.fullname, email: user.email
            // data: reduce(
            //     user,
            //     (result: any, value: string, key: string) => {
            //         if (key !== 'password') {
            //             result[key] = value;
            //         }
            //         //TODO Access token
            //         // console.log("JWT result :", result)
            //         return result;
            //     },
            //     {},
            // ),
        },
        config.secret || '',
        // {
        //     expiresIn: config.jwt_time,
        //     algorithm: 'HS256',
        // },
    );

    return token;
};