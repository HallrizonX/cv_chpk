const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();


const auth = require('../auth');
const Users = mongoose.model('Users');
const Audit = require('../../utils/Audit');
/*
New users
POST -> http://127.0.0.1:3000/api/users
application/json
{
  "user": {
    "email": "fokkiminkov@gmail.com",
    "password": "rombik99"
  }
}

GET -> http://127.0.0.1:3000/api/users/current
Authorization : Token <token>
 */


//POST new user route (optional, everyone has access)
router.post('/', auth.optional, async (req, res, next) => {
    const {body: {user}} = req;

    let audit = await Audit.check(user);
    if (!audit.success) {
        return res.status(422).json({errors: audit.msg});
    }

    const finalUser = new Users({
        email: user.email,
        password: user.password,
        access: null
    });

    finalUser.setPassword(user.password);
    await finalUser.save();

    return res.json({
        user: finalUser.toAuthJSON()
    })
});

//POST login route (optional, everyone has access)
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

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, async (req, res, next) => {
    const {payload: {id}} = req;
    let user = await Users.findById(id);

    if (!user)
        return next({status: 401, message: 'Токен невірний'});

    return res.json({user: user.toAuthJSON()});
});

module.exports = router;