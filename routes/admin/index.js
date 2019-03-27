const express = require('express');
const router = express.Router();

router.use('/admin', require('./home'));
router.use('/admin/user', require('./home'));
router.use('/admin/subject', require('./home'));
router.use('/admin/group', require('./home'));
module.exports = router;