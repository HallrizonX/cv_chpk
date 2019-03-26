const router = require('express').Router();
const auth = require('../auth');

const UsersController = require('../../controllers/api/users');
const GroupsController = require('../../controllers/api/groups');
const SubjectsController = require('../../controllers/api/subjects');

//--------------------------------------------- Users ----------------------------------------------------------------->

router.get('/users/', auth.optional, UsersController.getUsers);
router.get('/users/:id', auth.optional, UsersController.getUserByID);

router.delete('/users/:id', auth.optional, UsersController.deleteUserByID);
router.delete('/users/:id/subjects/:sub_id', auth.optional, UsersController.deleteSubjectByID);

router.patch('/users/:id', auth.optional, UsersController.updateUserByID);

router.put('/users/:id/subjects/:sub_id', auth.optional, UsersController.addSubjectToUser);

//--------------------------------------------- Groups ---------------------------------------------------------------->

router.get('/groups', auth.optional, GroupsController.getGroups);

router.post('/groups', auth.optional, GroupsController.addNewGroup);

router.delete('/groups/:id', auth.optional, GroupsController.getGroupByID);

//--------------------------------------------- Subjects -------------------------------------------------------------->

router.get('/subjects/', auth.optional, SubjectsController.getSubjects);
router.get('/subject/:id', auth.optional, SubjectsController.getSubjectByID);

//POST registration new group (optional, everyone has access)
router.post('/subject/', auth.optional, SubjectsController.addNewSubject);

//--------------------------------------------------------------------------------------------------------------------->

module.exports = router;