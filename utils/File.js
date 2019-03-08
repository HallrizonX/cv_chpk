const mongoose = require('mongoose');
const fs = require('fs');

const Files = mongoose.model('Files');


class File {
    constructor() {
        if (!File.instance) {
            File.instance = this;
        }
        return File.instance;
    }
}

File.prototype.uploadFile = async (res, file, user) => {
    if (!fs.existsSync(`uploads/${user._id}`)) {
        await fs.mkdir(`uploads/${user._id}`, {recursive: true}, (err) => {
            if (err) throw err;
        })
    }

    file.mv(`uploads/${user._id}/${file.name}`, async function (err) {
        if (err)
            return res.status(500).send(err);

        const newFile = await Files.create({
            title: file.name,
            path: `/uploads/${user._id}/${file.name}`,
            author: user._id
        });

        res.json({'path': `/uploads/${user._id}/${newFile.title}`})
    });

};

const instance = new File();
Object.freeze(instance);

module.exports = instance;