import  { config }  from "dotenv"
config() // ERROR ?
const rc = require('rc')

export default rc('JWT', {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    secret: process.env.JWT_KEY || "VerySecretKey",
    jwt_time: process.env.JWT_MAX_AGE || "",
    database: {
    }
});
