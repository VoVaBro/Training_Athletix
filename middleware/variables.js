module.exports = function(req, res, next) {
    console.log(req.session)
    res.locals.isAuth = req.session.isAuthenticated;
    next()
};
