const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

mongoose.set('useNewUrlParser', true);

mongoose.connect(process.env.MONGO_DB, err => {
    if (err) {
        throw err
    }
    console.log("Connect")
});
mongoose.set('debug', true);