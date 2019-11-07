const router = require ('express').Router();
const { signup } = require ('../controllers/signup');

router.get('/signup', (req, res) => {
    res.render('signup', {layout: false});
});

router.post('/signup', signup);


router.get('/', (req, res) =>{
    res.render("index",{layout: false});
});

// Не успел создать роутер
router.get('/record', (req, res) =>{
    res.render("record",{layout: false});
});


module.exports = router;