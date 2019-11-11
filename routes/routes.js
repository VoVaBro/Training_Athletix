const router = require ('express').Router();
const { signup, signin } = require ('../controllers/auth');

const adminController = require("../controllers/admin");


const verify = require ('../middleware/verifyToken');


//POST
router.post('/signup', signup);
router.post('/signin', signin);

router.post('/admin', adminController.addTraining);

//GET
router.get('/signup', verify, (req, res) => {
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

router.get('/admin',  (req, res) =>{
    res.render("admin",{layout: false});
});

module.exports = router;
