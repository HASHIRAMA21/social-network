const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/socialnetwork', {
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
        //useCreateIndex: true,
        // useFIndAndModify: false
    })
    .then(() => console.log('connecting to db'))
    .catch((err) => console.log('Failed to connecr to mongoDB', err))