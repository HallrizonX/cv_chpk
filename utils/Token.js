class Token {
    constructor() {
        if (!Token.instance) {
            Token.instance = this;
        }
        return Token.instance;
    }

    getToken(req) {
        const tokenHeaders = Token.getTokenFromHeaders(req);
        if ( tokenHeaders !== null)
            return tokenHeaders;

        const tokenCookies = Token.getTokenFromCookies(req);
        if ( tokenCookies !== null)
            return tokenCookies;

        return null;
    }

    getTokenAdmin(req) {
        const {cookies: {adm}} = req;

        if (!adm)
            throw new Error("Not admin");


        const tokenHeaders = Token.getTokenFromHeaders(req);
        if ( tokenHeaders !== null)
            return tokenHeaders;

        const tokenCookies = Token.getTokenFromCookies(req);
        if ( tokenCookies !== null)
            return tokenCookies;

        return null;
    }

    static getTokenFromHeaders(req) {
        // Get token from headers
        const {headers: {authorization}} = req;
        // Check it
        if (authorization && authorization.split(' ')[0] === 'Token') {
            return authorization.split(' ')[1];
        }
        return null;
    }

    static getTokenFromCookies(req) {
        // Get token from headers
        const {cookies: {token}} = req;
        console.log(token);
        // Check it
        if (token && token.split(' ')[0] === 'Token') {
            return token.split(' ')[1];
        }
        return null;
    }

}

const instance = new Token();
Object.freeze(instance);

module.exports = instance;

