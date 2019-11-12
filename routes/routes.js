const router = require ('express').Router();

const { signup, signin, reset } = require ('../controllers/auth');

const adminController = require("../controllers/admin");

const isAuth = require ('../middleware/isAuth');


//POST
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/reset', reset);
router.post('/admin', adminController.addTraining);

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

router.get('/reset', (req, res) =>{
    res.render('resetPass', {layout: false});
});

router.get('/', (req, res) =>{
    res.render("index",{layout: false});
});

router.get('/admin', isAuth, (req, res) =>{
    res.render("admin",{layout: false});
});

router.get('/logout', (req, res) =>{
    req.session.destroy(err => {
        if (err) throw err
    });
    res.redirect('/')
});

module.exports = router;
