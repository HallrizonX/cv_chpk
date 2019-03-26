const mongoose = require('mongoose');
const Groups = mongoose.model('Groups');

/*
    Get all groups from Database
 */
exports.getGroups = async (req, res, next) => {
    res.json(await Groups.find({}).sort({number: 1}))
};
/*
    Get one group by ID from params
 */
exports.getGroupByID = async (req, res, next) => {
    const {params: {id}} = req;
    await Groups.remove({_id: id});
    res.json(await Groups.find({}).sort({number: 1}))
};
/*
    Adding new group, from data post request
 */
exports.addNewGroup = async (req, res, next) => {
    const {body: {group}} = req;

    let count = await Groups.find({number: group}).count();
    if (count > 0) {
        res.json({
            "success": false,
            "msg": "Група з таким номер вже існує"
        })
    } else {
        const finalGroup = await new Groups({
            number: group
        });

        await finalGroup.save();

        res.json({
            "success": true,
            "msg": "Групу успішно створено",
            "groups": await Groups.find({}).sort({number: 1})
        })
    }

};