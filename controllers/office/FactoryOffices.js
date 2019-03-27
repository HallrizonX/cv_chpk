const User = require('../../utils/User');
const Token = require('../../utils/Token');

class OfficeFactory  {
    static create(userObject) {
        if (typeof userObject !== 'object')
            throw new Error("The passes argument must be of string type");

        let userOffice = null;

        if (userObject.access === 'student')
            userOffice = new StudentOffice(userObject, 'office/student/index.twig');

        if (userObject.access === 'teacher')
            userOffice = new TeacherOffice(userObject, 'office/teacher/index.twig');


        return userOffice;
    }

}

class InterfaceOffice{
    constructor(userObj, template){
        this.userObj = userObj;
        this.template = template;
        this.getContext = async (req) => {
            return {
                'user': await this.userObj.toAuthJSON(),
                'isAuth': await !!Token.getToken(req)
            }
        }

    }
}

class StudentOffice extends InterfaceOffice{
    constructor(userObj, template){
        super(userObj, template);
    }
}

class TeacherOffice extends InterfaceOffice{
    constructor(userObj, template){
        super(userObj, template);
        this.getContext = async (req) => {
            return {
                'files': await User.getAllFiles(this.userObj._id),
                'user': await this.userObj.toAuthJSON(),
                'isAuth': await !!Token.getToken(req)
            }
        }
    }
}

module.exports = OfficeFactory;