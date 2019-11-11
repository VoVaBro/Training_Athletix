const jwt = require ('jsonwebtoken');
const { secret } = require ('../settings/config').jwt;

module.exports = function (req, res, next) {
    const authHeader = req.headers ['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next()
    })
};

// exports.verifyToken = (req, res, next) => {
//      const token = req.headers('auth-token');
//      if (!token){
//          res.status(401).json('invalid token');
//          res.redirect('/')
//      } else {
//          const valid = jwt.verify( token, secret );
//          req.user = valid;
//          next()
//      }
// };

// exports.verifyToken = async (req, res, next) => {
//     const authHeader = await req.get('Authorization');
//     if (!authHeader) {
//         res.status(401).json({
//             message: 'Token not provided!'
//         });
//     }
//     const token = authHeader.replace('Bearer ', '');
//     try {
//         await jwt.verify(token, secret);
//     } catch (e) {
//         if (e instanceof jwt.TokenExpiredError){
//             res.status(401).json({ message: 'Token expired!' });
//         }
//     }
//     next();
// };
