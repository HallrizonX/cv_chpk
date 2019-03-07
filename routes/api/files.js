const router = require('express').Router();
const auth = require('../auth');

const User = require('../../utils/User');

//POST adding new files (required, only authenticated users have access)
router.post('/', auth.required, async (req, res, next) => {
    const user = await User.getByRequest(req);

    if (!user)
        return next({status: 401, message: 'Токен невірний'});

    console.log(req.files);

    if (Object.keys(req.files).length === 0) {
        return res.json({"ok": false});
        // return res.status(400).send('No files were uploaded.');
    }

    let sampleFile = req.files.sampleFile;

    console.log(req.body); // get another params

    sampleFile.mv(`uploads/${sampleFile.name}`, function(err) {
        if (err)
            return res.status(500).send(err);

        res.json({'path':`/uploads/${sampleFile.name}`})
    });
    console.log(sampleFile.name);

});

module.exports = router;