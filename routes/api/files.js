const mongoose = require('mongoose');
const router = require('express').Router();
const fileUpload = require('express-fileupload');

const auth = require('../auth');
const Users = mongoose.model('Users');


//GET current route (required, only authenticated users have access)
router.post('/', auth.required, async (req, res, next) => {
    const {payload: {id}} = req;

    let user = await Users.findById(id);

    if (!user)
        return next({status: 401, message: 'Токен невірний'});

    if (Object.keys(req.files).length === 0) {
        return res.json({"ok": false});
        // return res.status(400).send('No files were uploaded.');
    }

    let sampleFile = req.files.sampleFile;
    console.log(sampleFile);
    /*// Use the mv() method to place the file somewhere on your server
    sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });*/
    res.send('File uploaded!');
    //return res.json({user: user.toAuthJSON()});
});

module.exports = router;