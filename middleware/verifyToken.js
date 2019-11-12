const jwt = require ('jsonwebtoken');
const { secret } = require ('../settings/config').jwt;

module.exports = function (req, res, next) {
    const authHeader = req.session.headers ['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next()
    })
};
