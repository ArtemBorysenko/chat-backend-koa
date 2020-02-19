import mongoose from 'mongoose';
import  config  from '../../config'

const db = process.env.MONGODB_URL;

mongoose.connect(config.database.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});
mongoose.connection.on("error", (err: any) => {
    console.log(err);
});
mongoose.connection.on("connected", (err: any) => {
    console.log(`connected to: ${config.database.db}`);
});
module.exports = mongoose;