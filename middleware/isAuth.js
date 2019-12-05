require ('dotenv').config();
const jwt = require ('jsonwebtoken');
const { accessSecret, refreshSecret } = require('../helpers/tokenConfig').jwt;
const { genNewAccessToken } = require ('../helpers/genNewAccessToken');
const Token = require ('../models/tokenModel');

const { genAccessToken } = require ('../helpers/refreshJwtToken');

module.exports = async function(req, res, next) {
        const session = req.session;

        const token = session.headers['Authorization'];

        if (!token) {
            return  new Error('Authorization header not found')
        }

        let userId = req.session.userId

        let isValid = await verify(token, accessSecret)

        if (isValid) {
            next()
            return
        }

        let tokens = await Token.findOne({ tokenId: userId });

        if (!tokens) {
            throw new Error('Token not found')
        }

        let refreshToken = tokens.token;
        isValid = await verify(refreshToken, refreshSecret)


        // console.log(1232, isValid)
        if (!isValid) {
            return res.sendStatus(403);
        }

        const newToken = await genAccessToken(userId);
        req.session.headers = {};
        // console.log(newToken)
        req.session.headers['Authorization'] = newToken;
        await req.session.save(err => {
            if (err) throw err
        });
        next()
};

async function verify(token, secret) {
    try {
        await jwt.verify(token, secret);
        return true
    } catch(e) {
        console.log(e)
        return false
    }

}

