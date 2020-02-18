import mongoose from 'mongoose';
//'mongodb+srv://admin:1234@clus-tyy5m.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect('mongodb+srv://admin:1234@clus-tyy5m.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});