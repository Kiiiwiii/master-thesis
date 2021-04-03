import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
const mongodbEndpoint = process.env.MONGODB_URI;
// https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.connect(mongodbEndpoint, { useNewUrlParser: true, useFindAndModify: false }).catch(console.error);
