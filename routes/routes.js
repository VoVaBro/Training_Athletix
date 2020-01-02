const router = require ('express').Router();

const { signup, signin, resetPass, newPass } = require ('../controllers/auth');

const adminController = require("../controllers/admin");

const isAuth = require ('../middleware/isAuth');

const User = require ('../models/Users/userModel');
const Token = require ('../models/tokenModel');

const mongoose = require ('mongoose');


//POST
router.post('/signup', signup);
router.post('/newPass', newPass);
router.post('/signin',  signin);
router.post('/resetPass', resetPass);
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

router.get('/verifyEmail/:secretKey/:secret', async (req, res) => {
    try {
        let user = await User.findOne({
            secret: req.params.secret,
            secretKey: req.params.secretKey,
            secretMsgExp: {$gt: Date.now()}
        });
        if (!user) return new Error('user not found');

        res.render('signin', {
            layout: false,
            error: req.flash('error')
        });
    } catch (e) {
        console.log(e)
    }
});

router.get('/resetPass',  (req, res) => {
    res.render('resetpass', {
        layout: false,
        error: req.flash('error')
    })
});
router.get('/resetPass/:secret', async (req, res) => {
    try {
        let user = await User.findOne({secret: req.params.secret});
        if (!user){
            res.render("resetpass", {layout: false});
        } else {
            res.render("resetpass", {
            isConfirm: user.isConfirm,
            layout: false,
            });
        }
    } catch (e) {
        console.log(e)
    }
});

router.get('/', async (req, res) => {
    try {
        let user = await User.findOne({_id: req.session.userId});
        console.log(user);
        if (!user){
            res.render("index", {isActive: true, layout: false});
        } else {
            res.render("index", {
            isActive: false,
            layout: false,
            });
        }
    } catch (e) {
        console.log(e)
    }
});

router.get('/programs', (req, res) =>{
    res.render("programs",{layout: false});
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
