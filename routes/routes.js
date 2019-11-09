const router = require ('express').Router();
const { signup, signin } = require ('../controllers/auth');


//POST

router.post('/signup', signup);
router.post('/signin', signin);


//GET
router.get('/signup', (req, res) => {
    res.render('signup', {
        layout: false,
        error: req.flash('error')
    });
});

router.get('/signin', (req, res) => {
    res.render('signin', {
        layout: false,
        error: req.flash('error')
    });
});

router.get('/', (req, res) =>{
    res.render("index",{layout: false});
});

// Не успел создать роутер
router.get('/record', (req, res) =>{
    res.render("record",{layout: false});
});


module.exports = router;