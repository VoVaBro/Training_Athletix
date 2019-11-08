exports.isAuth = (req, res, next) => {
    res.locals = req.session.isAuthenticated;
    next()
};