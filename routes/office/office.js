const router = require('express').Router();

const auth = require('../auth');
const User = require('../../utils/User');
const Token = require('../../utils/Token');

router.get('/', auth.required, async (req, res, next) => {
    if (req.cookies.token || req.headers.authorization) {
        const user = await User.getByRequest(req);
        if (!user)
            return res.render('office/notToken.twig', {});

        const isAuth = !!Token.getToken(req);
        const files = await User.getAllFiles(user._id);

        return res.render('office/index.twig', {
            user: user.toAuthJSON(),
            'isAuth': isAuth,
            'files': files
        })
    }

    return res.render('office/notToken.twig', {});
});


module.exports = router;