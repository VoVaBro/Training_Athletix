const jwt = require ('jsonwebtoken');
const { secret } = require ('../settings/config').jwt;

exports.verifyToken = (req, res, next) => {
     const token = req.header('auth-token');
     if (!token){
         res.status(401).json('invalid token')
     } else {
         const valid = jwt.verify( token, secret );
         req.user = valid;
         next()
     }
};