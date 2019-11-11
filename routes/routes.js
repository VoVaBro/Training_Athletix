const router = require ('express').Router();
const { signup, signin, logout } = require ('../controllers/auth');
const verify = require ('../middleware/verifyToken');

//POST
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);


//GET
router.get('/signup', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
        return
    }
    res.render('signup', {
        layout: false,
        error: req.flash('error')
    });
});

router.get('/signin',  (req, res) => {
    if (req.session.user) {
        res.redirect('/');
        return
    }
    res.render('signin', {
        layout: false,
        error: req.flash('error')
    });
});

router.get('/', (req, res) =>{
    res.render("index",{layout: false});
});

router.get('/admin', verify, (req, res) =>{
    res.render("admin",{layout: false});
});

router.get('/logout', (req, res) =>{
    res.render("index",{layout: false});
});

module.exports = router;
