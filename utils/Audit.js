const EmailValidator = require('email-validator');
const mongoose = require('mongoose');
const Users = mongoose.model('Users');

class Audit{
    constructor(){
        if(! Audit.instance){
            Audit.instance = this;
        }
        return Audit.instance;
    }
}

Audit.prototype.check = async user =>{
    let msg_arr = [];

    if (!user.email)
        msg_arr.push('Пошта обов`язкова');

    if (await Users.findOne({email: user.email}))
        msg_arr.push('Користувач з такою поштою вже зареєстрований');

    if (!EmailValidator.validate(user.email))
        msg_arr.push('Введіть існуючу пошту');

    if (!user.password)
        msg_arr.push('Пароль є обов`язвоким');

    if (user.password.length < 6)
        msg_arr.push('Пароль повинен бути більше 6 символів');

    if (msg_arr.length > 0){
        return { 'success': false, msg: msg_arr}
    } else{
        return { 'success': true}
    }

};

const instance = new Audit();
Object.freeze(instance);

module.exports = instance;

