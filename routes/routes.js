const router = require ('express').Router();

const { signup, signin, verifyEmail } = require ('../controllers/auth');

const adminController = require("../controllers/admin");

const isAuth = require ('../middleware/isAuth');

const User = require ('../models/Users/userModel');
const Token = require ('../models/tokenModel');

const mongoose = require ('mongoose');


//POST
router.post('/signup', signup);
router.post('/verifyEmail', verifyEmail);
router.post('/signin',  signin);
router.post('/admin', adminController.addTraining);




//GET

router.get('/sign', async (req, res) => {
    res.render('sign', {
        layout: false,
        error: req.flash('error')
    })
});

router.get('/signin', async (req, res) => {
    res.render('signin', {
        layout: false,
        error: req.flash('error')
    })
});

router.get('/verifyEmail/:secret', async (req, res) => {
    try {
        let user = await User.findOne({secret: req.params.secret});
        if (!user) return new Error('user not found');

        res.render('verifyEmail', {
            layout: false,
            secret: user.secret,
            userId: user._id,
            error: req.flash('error')
        })
    } catch (e) {
        console.log(e)
    }
});

router.get('/', async (req, res) => {
    try {
        let user = await User.findOne({id: req.session.userId});
        if (!user){
            res.render("index", {layout: false});
        } else {
            res.render("index", {
            isActive: user.isActive,
            layout: false,
            });
        }
    } catch (e) {
        console.log(e)
    }
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


router.get('/logout', async (req, res) =>{
    try {
        let session = req.session;
        await Token.findOneAndDelete({tokenId: session.userId});
        session.destroy(err => {
        if (err) throw err
    });
    res.redirect('/')
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;
