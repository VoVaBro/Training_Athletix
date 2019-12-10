
require ('dotenv').config();


module.exports = {
    jwt: {
        accessSecret: process.env.accessJwtSecret,
        refreshSecret: process.env.refreshJwtSecret,
        tokens: {
            access: {
                type: 'access',
                expiresIn: '15m',
            },
            refresh: {
                type: 'refresh',
                expiresIn: '36h'

            }
        }
    }
};