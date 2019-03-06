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

const getTokenFromCookies = (req) => {
    // Get token from headers
    const { cookies: {token} } = req;
    console.log(token);
    // Check it
    if(token && token.split(' ')[0] === 'Token') {
        return token.split(' ')[1];
    }
    return null;
};

const getToken = (req) => {
    let tokenHeaders = getTokenFromHeaders(req);
    if ( tokenHeaders !== null)
         return tokenHeaders;

    let tokenCookies = getTokenFromCookies(req);
    if ( tokenCookies !== null)
        return tokenCookies;

    return null;
};

// Set User access
const auth = {
    required: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        getToken:  getToken
    }),
    optional: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        getToken: getToken,
        credentialsRequired: false,
    }),
};

module.exports = auth;