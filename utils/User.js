const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const Files = mongoose.model('Files');

class User {
    constructor() {
        if (!User.instance) {
            User.instance = this;
        }
        return User.instance;
    }

}

User.prototype.getByRequest = async (req) => {
    const {payload: {id}} = req;
    return await Users.findById(id);
};

User.prototype.getAllFiles = async (userID) => {
    return await Files.find({author: userID})
};

const instance = new User();
Object.freeze(instance);

module.exports = instance;