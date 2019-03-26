const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const Groups = mongoose.model('Groups');
const Subjects = mongoose.model('Subjects');
/*
    Get all subjects from database
 */
exports.getSubjects = async (req, res, next) => {
    res.json({subjects: await Subjects.find()});
};
/*
    Get one subject by ID
 */
exports.getSubjectByID = async (req, res, next) => {
    const {params: {id}} = req;

    const user = await Users.findById(id);

    const user_subjects = await Subjects.find({_id: user.subjectsID});

    res.status(200).render('admin/includes/subjects-form.twig', {subjects: user_subjects});
};
/*
    Adding new subject from data post request
 */
exports.addNewSubject = async (req, res, next) => {
    const {body: {groupID, title}} = req;

    if (await Subjects.find({group: groupID, title: title}).count() > 0)
        return res.json({
            "success": false,
            "msg": "Предмет з такою назвою на групою вже зарєестровано"
        });

    const group = await Groups.findOne({_id: groupID});

    const finalSubject = await new Subjects({
        groupNumber: group.number,
        group: groupID,
        title: title,
    });

    await finalSubject.save();

    res.json({
        "success": true,
        "msg": "Предмет " + finalSubject.title+" успішно створено",
    })
};