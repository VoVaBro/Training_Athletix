  module.exports = {
    jwt: {
        secret: process.env.jwtSecret,
        tokens: {
            access: {
                type: 'access',
                expiresIn: '1h',
            },
            refresh: {
                type: 'refresh',
                expiresIn: '2h'
            }
        }
    }
};