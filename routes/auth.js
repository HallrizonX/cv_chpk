const jwt = require('express-jwt');
const Token = require('../utils/Token');

// Set User access
const auth = {
    required: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        getToken:  Token.getToken
    }),
    optional: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        getToken: Token.getToken,
        credentialsRequired: false,
    }),
    optionalAdmin: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        getToken: Token.getTokenAdmin,
        credentialsRequired: false,
    }),
};

module.exports = auth;