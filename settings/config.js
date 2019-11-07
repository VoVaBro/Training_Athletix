module.exports = {
    MONGO_URI: 'mongodb+srv://brozhik_vladimir:ER15v62EJdDwS4jN@cluster0-nudxi.mongodb.net/T_A?retryWrites=true&w=majority',
    PORT: process.env.PORT || 3000,
    jwt: {
        secret: 'nobodycanusethisapp'
    }
};