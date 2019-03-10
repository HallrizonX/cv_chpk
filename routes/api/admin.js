const mongoose = require('mongoose');
const router = require('express').Router();
const twig = require('twig');
const auth = require('../auth');
const Users = mongoose.model('Users');
const Groups = mongoose.model('Groups');
const Subjects = mongoose.model('Subjects');
const Audit = require('../../utils/Audit');

//--------------------------------------------- GROUP ----------------------------------------------------------------->
router.get('/user/:id', auth.optional, async (req, res, next) => {
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

    res.render('admin/includes/ajax-edit-modal.twig', {user: user, subjects: user_subjects});
});

router.delete('/user/:id/subject', auth.optional, async (req, res, next) => {
    const {body: {subject_id}, params: {id}} = req;

    let user = await Users.findById(id);

    await user.updateOne({$pull: {subjectsID: subject_id}});

    user = await Users.findById(id);

    const user_subjects = await Subjects.find({_id: user.subjectsID});

    res.status(200).render('admin/includes/ajax-edit-modal.twig', {user: user, subjects: user_subjects});
    next({status: 200});
});

router.patch('/user/:id/subject', auth.optional, async (req, res, next) => {
    const {body: {subject_id}, params: {id}} = req;

    let user = await Users.findById(id);

    if (!await Users.findOne({_id: id, subjectsID: subject_id}).select('subjectsID')){
        res.status(200).json({
            "success": false
        });

    }

    await user.updateOne({$push: {subjectsID: subject_id}});

    const user_subjects = await Subjects.find({_id: user.subjectsID});

    res.status(200).render('admin/includes/ajax-edit-modal.twig', {user: user, subjects: user_subjects});
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