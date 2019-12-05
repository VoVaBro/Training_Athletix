
require ('dotenv').config();
const jwt = require ('jsonwebtoken');
const { tokens, accessSecret, refreshJwtSecret} = require('./tokenConfig').jwt;
const Token = require ('../models/tokenModel');

exports.genAccessToken = userId => {
    const payload = {
        id: userId,
        type: tokens.access.type
    };
    const options = { expiresIn: tokens.access.expiresIn };
    return jwt.sign(payload, accessSecret, options)
};

exports.genRefreshToken = (userId) => {
    const payload = {
        id: userId,
        type: tokens.refresh.type
    };
    const options = { expiresIn: tokens.refresh.expiresIn };

    return {
        token: jwt.sign(payload, refreshJwtSecret, options),
        tokenId: payload.id
    }
};

exports.replaceToken = userId =>{
  Token.findOneAndRemove({tokenId: userId})
};






