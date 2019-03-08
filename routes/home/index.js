const express = require('express');
const router = express.Router();
const Token = require('../../utils/Token');

router.get('/', (req, res) => {
    const isAuth = !!Token.getToken(req);

    return res.render('index.twig', {
        'isAuth': isAuth
    });
});

module.exports = router;