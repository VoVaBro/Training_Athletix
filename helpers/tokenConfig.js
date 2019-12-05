
require ('dotenv').config();

module.exports = {
    jwt: {
        accessSecret: process.env.accessJwtSecret,
        refreshJwtSecret: process.env.refreshJwtSecret,
        tokens: {
            access: {
                type: 'access',
                expiresIn: '10s',
            },
            refresh: {
                type: 'refresh',
                expiresIn: '20s'

            }
        }
    }
};