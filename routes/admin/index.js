const express = require('express');
const router = express.Router();

router.use('/admin', require('./home'));
router.use('/admin/subject', require('./subject'));
router.use('/admin/group', require('./group'));

module.exports = router;