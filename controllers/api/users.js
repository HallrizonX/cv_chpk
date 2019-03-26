const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const Subjects = mongoose.model('Subjects');
const passport = require('passport');
const Audit = require('../../utils/Audit');

/* Get current user */
exports.current = async (req, res, next) => {

    const {payload: {id}} = req;

    let user = await Users.findById(id);

    if (!user)
        return next({status: 401, message: 'Токен невірний'});

    return res.json({user: user.toAuthJSON()});
}

/* Logout user */
exports.logout = (req, res, next) => {
    const {headers: {authorization}} = req;

    req.headers.authorization = "";
    res.clearCookie('token');
    console.log(authorization);
    // Authorization
    res.redirect('/');
};

/* User authorization */
exports.login = (req, res, next) => {
    const {body: {user}} = req;

    // Authorization
    return passport.authenticate('local', {session: false}, async (err, passportUser, info) => {
        if (err) return next(err);

        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();
            return res.json({user: user.toAuthJSON()});
        }

        return next(info)
    })(req, res, next);
};

/* Adding new user from data post request */
exports.addNewUser = async (req, res, next) => {
    const {body: {user}} = req;

    let audit = await Audit.check(user);
    if (!audit.success) {
        return res.json({errors: audit.msg});
    }

    const finalUser = new Users({
        email: user.email,
        password: user.password,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        access: null
    });

    finalUser.setPassword(user.password);
    await finalUser.save();

    return res.json({
        user: finalUser.toAuthJSON()
    })
};

/* Get all users from database */
exports.getUsers = async (req, res, next) =>{
    const users = await Users.find({});
    res.json(users)
};

/* Get one user by ID */
exports.getUserByID = async (req, res, next) => {
    const {params: {id}} = req;
    const user = await Users.findById(id);
    if (!user)
        return next({status: 401, message: 'Токен невірний'});
    let user_subjects;
    try {
        user_subjects = await Subjects.find({_id: user.subjectsID});
    } catch (e) {
        user_subjects = null;
    }

    res.json({user: user, subjects: user_subjects});
};

/* Delete user by ID */
exports.deleteUserByID = async (req, res, next) => {
    const {params: {id}} = req;
    const user = await Users.findById(id);
    await user.delete();

    res.json({"success": true, 'userID': id});
};

/* Update user's data in Database */
exports.updateUserByID = async (req, res, next) => {
    const {params: {id}} = req;
    const user = await Users.findById(id);
    if (!user)
        return next({status: 401, message: 'Токен невірний'});

    if (req.body.name) {
        user.setName(req.body.name);
        user.save();
        res.json({"success": true, "change": 'name'});
    }
    if (req.body.surname) {
        user.setSurname(req.body.surname);
        user.save();
        res.json({"success": true, "change": 'surname'});
    }
    if (req.body.phone) {
        user.setPhone(req.body.phone);
        user.save();
        res.json({"success": true, "change": 'phone'});
    }
    if (req.body.email) {
        user.setEmail(req.body.email);
        user.save();
        res.json({"success": true, "change": 'email'});
    }
    if (req.body.access) {
        user.setAccess(req.body.access);
        user.save();
        res.json({"success": true, "change": 'access'});
    }
    if (req.body.password) {
        user.setPassword(req.body.password);
        user.save();
        res.json({"success": true, "change": 'password'});
    }

    res.json({"success": true});
};

/* Deleting subject by ID in current user */
exports.deleteSubjectByID = async (req, res, next) => {
    const {params: {id, sub_id}} = req;

    const user = await Users.findById(id);
    if (!user)
        return next({status: 401, message: 'Токен невірний'});

    try {
        await user.removeSubjectByID(sub_id);
        await user.save();
    } catch (e) {
        next()
    }

    const user_subjects = await Subjects.find({_id: user.subjectsID});
    res.json({"success": true, subjects: user_subjects});

};

/* Adding new subject by ID in current user */
exports.addSubjectToUser = async (req, res, next) => {
    const {params: {id, sub_id}} = req;
    const user = await Users.findById(id);
    if (!user)
        return next({status: 401, message: 'Токен невірний'});

    try {
        await user.addSubjectByID(sub_id);
        await user.save();
    } catch (e) {
        next()
    }
    const user_subjects = await Subjects.find({_id: user.subjectsID});
    res.json({"success": true, subjects: user_subjects});
}