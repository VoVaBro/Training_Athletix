require ('dotenv').config();
const jwt = require ('jsonwebtoken');
const { accessSecret, refreshSecret } = require('../helpers/tokenConfig').jwt;
const Token = require ('../models/tokenModel');

const { genAccessToken } = require ('../helpers/refreshJwtToken');

module.exports = async function(req, res, next) {

        const session = req.session;

        const token = session.headers['Authorization'];

        if (!token) {
            return  new Error('Authorization header not found')
        }

        let userId = session.userId;

        let isValid = await verify(token, accessSecret);

        if (isValid) {
            next();
            return
        }

        let tokens = await Token.findOne({ tokenId: userId });

        if (!tokens) {
            res.redirect('/sign')
        }

        let refreshToken = tokens.token;
        let validRefreshToken = await verify(refreshToken, refreshSecret);

        if (!validRefreshToken) {
            try {
                await Token.findOneAndDelete({tokenId: userId});
                session.destroy(err => {
                    if (err) throw err
                });
                res.redirect('/sign');
                return
            } catch (e) {
                console.log(e)
            }
        }

        const newToken = await genAccessToken(userId);
        req.session.headers = {};
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
        console.log(e);
        return false
    }
}

