const router = require('express').Router();
const auth = require('../auth');

const User = require('../../utils/User');

router.get('/', auth.required, async (req, res, next) => {
    if (req.cookies.token || req.headers.authorization) {
        const user = await User.getByRequest(req);
        if (!user)
            return res.render('office/notToken.twig', {});

        return res.render('admin/group.twig', {
            user: user.toAuthJSON(),

        })
    }

    return res.render('office/notToken.twig', {});
});


module.exports = router;