const router = require('express').Router();

const auth = require('../auth');
const UsersController = require('../../controllers/api/users');

//POST registration new user (optional, everyone has access)
router.post('/', auth.optional, UsersController.addNewUser);

//POST authorization (optional, everyone has access)
router.post('/login', auth.optional, UsersController.login);

//POST logout (optional, everyone has access)
router.get('/logout', auth.optional, UsersController.logout);

//GET current user (required, only authenticated users have access)
router.get('/current', auth.required, UsersController.current);

module.exports = router;