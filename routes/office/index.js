const express = require('express');
const router = express.Router();

router.use('/office', require('./office'));

module.exports = router;