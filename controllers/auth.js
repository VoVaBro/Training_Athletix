require ('dotenv').config();

const User = require ('../models/Users/userModel');
const Token = require ('../models/tokenModel');
const bcrypt = require ('bcrypt');
const randomString = require ('randomstring');
const mailer = require ('../helpers/sendEmail');
const msgSignup = require ('../helpers/msgForUsers');
const msgReset = require ('../helpers/msgToResetPass');

const {genAccessToken, genRefreshToken } = require ('../helpers/refreshJwtToken');




exports.signup = async (req, res) => {
    try {
        const secretKey = await randomString.generate(4);
        const secret = await randomString.generate(16);
        const user = await User.findOne({email: req.body.email});

        if (user){
            req.flash('error', 'Такой email уже используется');
            res.status(500).redirect('/sign')
        }
        if (!user){
           await bcrypt.hash(req.body.password, 10, (err, hash) => {
                const newUser = new User({
                    name: req.body.name,
                    secondName: req.body.secondName,
                    phoneNum: req.body.phoneNum,
                    email: req.body.email,
                    password: hash,
                    secret: secret,
                    secretKey: secretKey,
                    secretMsgExp: Date.now() + 30 * 60 * 1000,
                    isActive: false
                });
                newUser
                    .save()
                    .then(validNewUser => {
                        let validEmail = msgSignup(validNewUser);
                        mailer(validEmail);
                        res.redirect('/')
                        }).catch(err => console.log(err));
                   });
                }
            }catch (e) {
                console.log(e)
            }
        };



exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user){
            req.flash('error', 'Пользователь не найден');
            res.redirect('/sign')
        }

            const isValid = await bcrypt.compare(req.body.password, user.password);

            if (!isValid) {
                req.flash('error', 'Неверный пароль');
                res.redirect('/sign')

            } else {
                let token = await genAccessToken(user._id);
                let refreshToken = await genRefreshToken(user._id);
                let newToken = new Token({
                    token: refreshToken.token,
                    tokenId: refreshToken.tokenId
                });

                user.secretKey = undefined;
                user.secretMsgExp = undefined;
                user.secret = undefined;
                user.isActive = true;

                req.session.headers = {};
                req.session.headers['Authorization'] = token;
                req.session.userId = user._id;

                await user.save();
                await req.session.save(err => {
                    if (err) throw err
                });
                await newToken.save()
                    .then(() => res.redirect('/'));
            }
        } catch (e) {
            console.log(e)
        }
    };



exports.resetPass = async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email});
        let secretKey = await randomString.generate(4).toUpperCase();
        let secret = await randomString.generate(32);


        if(!user) {
            req.flash('error', 'email not found');
            res.redirect('/resetPass')
        }else if (user.name !== req.body.name) {
            req.flash('error', 'phone not found');
            res.redirect('/resetPass')
        } else {

            user.secret = secret;
            user.secretKey = secretKey;
            user.secretMsgExp = Date.now() + 30 * 60 * 1000;
            user.isConfirm = true;

            let msg = await msgReset(user);
            await mailer(msg);

            await user.save()
                .then(() =>{
                    console.log('success');
                    res.redirect('/')
                } )
        }
    } catch (e) {
        console.log(e)
    }
};


exports.newPass =  async (req, res) => {
    try {
        const user = await User.findOne({
            phoneNum: req.body.phoneNum,
        });
        if (!user){
            req.flash('error', 'num not find');
            res.redirect ('/verifyEmail')
        }
        if (user.secretKey !== req.body.secretKey){
            req.flash('error', 'Error');
            res.redirect('/sign')
        } else {
            let hash = await bcrypt.hash(req.body.newPassword, 10);
            await User.updateOne({ _id: user._id }, {password: hash});
               await user.save()
                   .then(() => {
                    user.secret = undefined;
                    user.secretKey = undefined;
                    user.secretMsgExp = undefined;
                    res.redirect('/')
                })
            }
        } catch (e) {
        console.log(e)
    }
};




