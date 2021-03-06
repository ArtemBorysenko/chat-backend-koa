import jwt from 'jsonwebtoken'
import  config  from '../config'

// export default (token: string) =>
//     new Promise((resolve, reject) => {
//         token = token.slice(7, token.length)
//         jwt.verify(token, config.secret || '', (err : any, decodedData : any) => {
//             if (err || !decodedData) {
//                 return reject(err)
//             }
//              resolve(decodedData)
//         })
//     })

export default async (token: string) => {
    try {
        if(!token) throw "Invalid token"
        token = token.slice(7, token.length)
        const decodedData = jwt.verify(token, config.secret || '')
        return decodedData
    } catch (err) {
        throw await err
    }
}