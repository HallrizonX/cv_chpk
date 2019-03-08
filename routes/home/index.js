const express = require('express');
const router = express.Router();
const Token = require('../../utils/Token');

router.get('/', (req, res) => {
    let isAuth = false;
    if (Token.getToken(req)) {
        isAuth = true;
    }

    return res.render('index.twig', {
        'isAuth': isAuth
    });
});

module.exports = router;