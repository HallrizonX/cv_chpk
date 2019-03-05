const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Users = mongoose.model('Users');

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]',
}, async (email, password, done) => {
    let user = {};

    try {
        user = await Users.findOne({email});
        if (!user || !user.validatePassword(password))
            return done(null, false, {status: 401, message: 'Пошта або пароль не вірні'});

    }catch (err) { throw err }

    return done(null, user);
}));