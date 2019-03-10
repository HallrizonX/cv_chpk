const mongoose = require('mongoose');

const { Schema } = mongoose;

const GroupsSchema = new Schema({
    number: Number
});


mongoose.model('Groups', GroupsSchema);
