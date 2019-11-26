require ('dotenv').config();
const jwt = require ('jsonwebtoken');
const { tokens, secret } = require ('/helpers/tokenConfig').jwt;
const Token = require ('/models/tokenModel');

const genAccessToken = userId => {
    const payload = {
        userId,
        type: tokens.access.type
    };
    const options = { expiresIn: tokens.access.expiresIn };

    return jwt.sign(payload, secret, options)
};

const genRefreshToken = () => {
    const payload = {
        id: req.session.user,
        type: tokens.refresh.type
    };
    const options = { expiresIn: tokens.refresh.expiresIn };

    return {
        token: jwt.sign(payload, secret, options),
        id: payload.id
    }
};

const replaceRefreshToken = (tokenId, userId) => {
    Token.findOneAndRemove({userId})
        .exec()
        .then(() => Token.create({tokenId, userId}))
};

module.exports = {
    genAccessToken,
    genRefreshToken,
    replaceRefreshToken
};