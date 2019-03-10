const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));
router.use(require('./home'));
router.use(require('./office'));
router.use(require('./admin'));

module.exports = router;