const router = require('express').Router();
const mongoose = require("mongoose");
const auth = require('../auth');

const Users = mongoose.model('Users');
const Groups = mongoose.model('Groups');
const Subjects = mongoose.model('Subjects');
const User = require('../../utils/User');

router.get('/', auth.optionalAdmin, async (req, res, next) => {
    if (req.cookies.token || req.headers.authorization) {
        const user = await User.getByRequest(req);
        if (!user)
            return res.render('office/notToken.twig', {});

        const users = await Users.find().sort({access: -1});

        const subjects = await Subjects.find();

        return res.render('admin/index.twig', {
            user: user.toAuthJSON(),
            users: users,
            subjects: subjects
        })
    }

    return res.render('office/notToken.twig', {});
});


module.exports = router;