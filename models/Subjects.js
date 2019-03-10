const mongoose = require('mongoose');
const {Schema} = mongoose;
const Groups = mongoose.model('Groups');

const SubjectsSchema = Schema({
    groupNumber: Number,
    group: {type: Schema.Types.ObjectId, ref: 'Groups'},
    title: String,
});

/* Hook that password reset in hash
SubjectsSchema.pre('save', async (next) => {
    const group = await Groups.find({_id: this.group});
    console.log(group._id, group);
    next();
});
*/


mongoose.model('Subjects', SubjectsSchema);