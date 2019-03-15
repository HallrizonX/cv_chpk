const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {Schema} = mongoose;

const UsersSchema = new Schema({
    email: String,
    hash: String,
    salt: String,
    access: String,
    name: String,
    surname: String,
    phone: String,
    subjectsID: [],
});

// Set phone number
UsersSchema.methods.setPhone = function (phone) {
    this.phone = phone;
};
// Set user email
UsersSchema.methods.setEmail = function (email) {
    this.email = email;
};
// Set user access
UsersSchema.methods.setAccess = function (access) {
    this.access = access;
};
// Set user name
UsersSchema.methods.setName = function (name) {
    this.name = name;
};
// Set user surname
UsersSchema.methods.setSurname = function (surname) {
    this.surname = surname;
};
// Add new subject into user
UsersSchema.methods.addSubjectByID = function (subjectID) {
    if (this.subjectsID.find(ele => {return ele === subjectID}) === undefined) {
        this.subjectsID.push(subjectID);
    }
};
// Remove subject from user
UsersSchema.methods.removeSubjectByID = function (subjectID) {
    this.subjectsID = this.subjectsID.filter(ele => {
        return ele !== subjectID;
    })
};
// Set user password
UsersSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};
// Check out user password
UsersSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};
// Generating token
UsersSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env.SECRET);
};
// Return json data about user
UsersSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
        access: this.access,
        name: this.name,
        surname: this.surname,
        phone: this.phone
    };
};

mongoose.model('Users', UsersSchema);
