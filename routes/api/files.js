const router = require('express').Router();
const auth = require('../auth');

const User = require('../../utils/User');
const File = require('../../utils/File');
//POST adding new files (required, only authenticated users have access)
router.post('/', auth.required, async (req, res, next) => {

    const user = await User.getByRequest(req);
    if (!user)
        return next({status: 401, message: 'Токен невірний'});

    if (Object.keys(req.files).length === 0)
        return res.json({"ok": false, msg: 'No files were uploaded'});

    await File.uploadFile(res, req.files.sampleFile, user);
});

module.exports = router;