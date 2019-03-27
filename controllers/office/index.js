const User = require('../../utils/User');
const FactoryOffice = require('./FactoryOffices');

exports.officeRender = async (req, res, next) => {
    if (req.cookies.token || req.headers.authorization) {
        // Get user Object
        const user = await User.getByRequest(req);
        if (!user)
            return res.render('office/notToken.twig', {});

        const office = FactoryOffice.create(user);
        return res.render(office.template, await office.getContext(req))
    }

    return res.render('office/notToken.twig', {});
};