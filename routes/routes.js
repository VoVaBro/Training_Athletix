const router = require ('express').Router();

const { signup, signin, verifyEmail } = require ('../controllers/auth');

const adminController = require("../controllers/admin");

const isAuth = require ('../middleware/isAuth');

const User = require ('../models/Users/userModel');

const mongoose = require ('mongoose');


//POST
router.post('/signup', signup);
router.post('/verifyEmail', verifyEmail);
router.post('/signin',  signin);
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

router.get('/signin/:secret', async (req, res) => {
    if (!req.params.secret) {
        req.flash('error', 'try again');
        res.redirect('/signup')
    }
    try {
        const user = await User.findOne ({
            secret: req.params.secret
        });
        if (!user) return new Error('User dosent exist!');

        res.render('signin',{
            layout: false,
            secret: req.params.secret,
            userId: user._id
        });
    } catch (e) {
        console.log(e)
    }

});



router.get('/signin', async (req, res) => {
    try {
        if (req.session.user) {
        res.redirect('/');
        return
    }
        const user = await User.findOne({});
        if (!user){
            res.redirect('/signup')
        } else {
            res.render('signin', {
                layout: false,
                isActive: user.isActive,
                error: req.flash('error')
            })
        }
    } catch (e) {
        console.log(e)
    }
});


// router.get('/reset', (req, res) =>{
//     res.render('resetPass', {layout: false});
// });

router.get('/', (req, res) =>{
    res.render("index",{layout: false});
});

router.get('/admin', isAuth, (req, res) =>{
    res.render("admin",{layout: false});
});


router.get('/admin/:id', adminController.loadTraining);

router.get('/getUser/:id', adminController.loadUser);


//PUT
router.put('/admin/:id', adminController.editTraining);

//DElETE
router.delete('/admin/:date',adminController.removeTraining);

  // Нужно доделать!!!
router.delete(`/recordDelAll/:date`, adminController.removeAllRec);

router.get('/logout', (req, res) =>{
    //стереть токен в БД
    req.session.destroy(err => {
        if (err) throw err
    });
    res.redirect('/')
});

module.exports = router;
