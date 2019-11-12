require ('dotenv').config();
const jwt = require ('jsonwebtoken');
const secret = process.env.jwtSecret;

module.exports = async function(req, res, next) {
    try {
        const session = req.session;

        if (!session.headers['Authorization'] && !session.isAuth) {
            throw new Error('Authorization header not found')
        }

        const token = session.headers['Authorization'];

        let data = new Promise((resolve, reject) => {
            jwt.verify(token, secret, {}, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            })
        });

        const { _id } = await data;
        req.session.user = _id;
        next()
    } catch(err) {
        console.log(err);
        return res.sendStatus(403);
    }
};

