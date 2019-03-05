const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
    // Get token from headers
    const { headers: { authorization } } = req;
    // Check it
    if(authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
};


// Set User access
const auth = {
    required: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
};

module.exports = auth;