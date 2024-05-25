const Jwt = require('@hapi/jwt');
const variable = require('./variable');

const TokenManager = {
    generateAccessToken: (payload) => Jwt.token.generate(payload, variable.ACCESSJWT),
    generateRefreshToken: (payload) => Jwt.token.generate(payload, variable.REFRESHJWT),
    verifyRefreshToken: (refreshToken) => {
        try {
            const artifacts = Jwt.token.decode(refreshToken);
            Jwt.token.verifySignature(artifacts, variable.REFRESHJWT);
            const { payload } = artifacts.decoded;
            return payload;
        } catch (error) {
            return error;
        }
    }
}

module.exports = TokenManager;