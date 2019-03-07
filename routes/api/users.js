const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();


const auth = require('../auth');
const Users = mongoose.model('Users');
const Audit = require('../../utils/Audit');


//POST registration new user (optional, everyone has access)
router.post('/', auth.optional, async (req, res, next) => {
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
});

//POST authorization (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
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
});

//GET current user (required, only authenticated users have access)
router.get('/current', auth.required, async (req, res, next) => {

    const {payload: {id}} = req;

    let user = await Users.findById(id);

    if (!user)
        return next({status: 401, message: 'Токен невірний'});

    return res.json({user: user.toAuthJSON()});
});

module.exports = router;