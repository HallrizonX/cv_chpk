const router = require('express').Router();
const auth = require('../auth');
const OfficeController = require('../../controllers/office/index');

router.get('/', auth.required, OfficeController.officeRender);

module.exports = router;