const router = require('express').Router();
const auth = require('../auth');
const FileController = require('../../controllers/api/files');

//POST adding new files (required, only authenticated users have access)
router.post('/', auth.required, FileController.uploadNewFile);

module.exports = router;