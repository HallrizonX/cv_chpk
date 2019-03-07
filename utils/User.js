const mongoose = require('mongoose');
const Users = mongoose.model('Users');

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


const instance = new User();
Object.freeze(instance);

module.exports = instance;