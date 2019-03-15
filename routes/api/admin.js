const mongoose = require('mongoose');
const router = require('express').Router();
const twig = require('twig');
const auth = require('../auth');
const Users = mongoose.model('Users');
const Groups = mongoose.model('Groups');
const Subjects = mongoose.model('Subjects');
const Audit = require('../../utils/Audit');

//--------------------------------------------- GROUP ----------------------------------------------------------------->
router.get('/users/', auth.optional, async (req, res, next) => {
    const users = await Users.find({});
    res.json(users)
});

router.get('/users/:id', auth.optional, async (req, res, next) => {
    const { params: {id} } = req;
    const user = await Users.findById(id);
    if (!user)
        return next({status: 401, message: 'Токен невірний'});
    let user_subjects;
    try {
        user_subjects = await Subjects.find({_id: user.subjectsID});
    }catch (e) {
        user_subjects = null;
    }

    res.json({user: user, subjects: user_subjects});
});

router.delete('/users/:id', auth.optional, async (req, res, next) => {
    const { params: {id} } = req;
    const user = await Users.findById(id);
    await user.delete();

    res.json({"sucess": true, 'userID': id});
});

router.patch('/users/:id', auth.optional, async (req, res, next) => {
    const { params: {id} } = req;
    const user = await Users.findById(id);
    if (!user)
        return next({status: 401, message: 'Токен невірний'});

    if (req.body.name){
        user.setName(req.body.name);
        user.save();
        res.json({"success": true, "change": 'name'});
    }
    if (req.body.surname){
        user.setSurname(req.body.surname);
        user.save();
        res.json({"success": true, "change": 'surname'});
    }
    if (req.body.phone){
        user.setPhone(req.body.phone);
        user.save();
        res.json({"success": true, "change": 'phone'});
    }
    if (req.body.email){
        user.setEmail(req.body.email);
        user.save();
        res.json({"success": true, "change": 'email'});
    }
    if (req.body.access){
        user.setAccess(req.body.access);
        user.save();
        res.json({"success": true, "change": 'access'});
    }
    if (req.body.password){
        user.setPassword(req.body.password);
        user.save();
        res.json({"success": true, "change": 'password'});
    }

    res.json({"success": true});
});


router.delete('/users/:id/subjects/:sub_id', auth.optional, async (req, res, next) => {
    const { params: {id, sub_id} } = req;

    const user = await Users.findById(id);
    if (!user)
        return next({status: 401, message: 'Токен невірний'});

    try {
        await user.removeSubjectByID(sub_id);
        await user.save();
    }catch (e) {
        next()
    }

    const user_subjects = await Subjects.find({_id: user.subjectsID});
    res.json({"success": true, subjects: user_subjects});

});

router.put('/users/:id/subjects/:sub_id', auth.optional, async (req, res, next) => {
    const { params: {id, sub_id} } = req;
    const user = await Users.findById(id);
    if (!user)
        return next({status: 401, message: 'Токен невірний'});

    try {
        await user.addSubjectByID(sub_id);
        await user.save();
    }catch (e) {
        next()
    }
    const user_subjects = await Subjects.find({_id: user.subjectsID});
    res.json({"success": true, subjects: user_subjects});
});




//--------------------------------------------- GROUP ----------------------------------------------------------------->
//POST registration new group (optional, everyone has access)
router.post('/group', auth.optional, async (req, res, next) => {
    const {body: {group}} = req;

    if (await Groups.find({number: group.number}).count() > 0)
        return res.json({
            "success": false
        });


    const finalGroup = new Groups({
        number: group.number
    });

    await finalGroup.save();

    return res.json({
        "success": true
    })
});


//--------------------------------------------- Subject --------------------------------------------------------------->
router.get('/subjects/', auth.optional, async (req, res, next) => {
    res.json({subjects: await Subjects.find()});
});

router.get('/subject/:id', auth.optional, async (req, res, next) => {
    const { params: {id}} = req;

    const user = await Users.findById(id);

    const user_subjects = await Subjects.find({_id: user.subjectsID});

    res.status(200).render('admin/includes/subjects-form.twig', {subjects: user_subjects});
});

//POST registration new group (optional, everyone has access)
router.post('/subject', auth.optional, async (req, res, next) => {
    const {body: {subject}} = req;

    if (await Subjects.find({group: subject.group, title: subject.title}).count() > 0)
        return res.json({
            "success": false
        });

    const group = await Groups.findOne({_id: subject.group});

    const finalSubject = await new Subjects({
        groupNumber: group.number,
        group: subject.group,
        title: subject.title,
    });

    await finalSubject.save();

    return res.json({
        "success": true
    })
});
module.exports = router;