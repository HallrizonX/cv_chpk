const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../routes/auth');
const Users = mongoose.model('Users');


router.get('/office', auth.required, async (req, res, next) => {
    if (req.cookies.token) {
        const {payload: {id}} = req;
        let user = await Users.findById(id);

        if (!user)
            return res.render('office/notToken.twig', {});

        return res.render('office/index.twig', {user: user.toAuthJSON()})
    }

    return res.render('office/notToken.twig', {});
});



module.exports = router;