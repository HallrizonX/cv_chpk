const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../auth');

const User = require('../../utils/User');
const Groups = mongoose.model('Groups');

router.get('/', auth.required, async (req, res, next) => {
    if (req.cookies.token || req.headers.authorization) {
        const user = await User.getByRequest(req);
        if (!user)
            return res.render('office/notToken.twig', {});

        const groups = await Groups.find();
        return res.render('admin/subject.twig', {
            user: user.toAuthJSON(),
            groups: groups
        })
    }

    return res.render('office/notToken.twig', {});
});


module.exports = router;