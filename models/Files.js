const mongoose = require('mongoose');
const { Schema } = mongoose;

const FilesSchema = Schema({
    author: { type: Schema.Types.ObjectId, ref: 'Users' },
    title: String,
    path: String
});

mongoose.model('Files', FilesSchema);