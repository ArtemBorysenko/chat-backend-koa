// require("dotenv").config()
import  { config }  from "dotenv"
config() // ERROR ?
const rc = require('rc')

module.exports = rc('JWT', {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    database: {

    }
});
