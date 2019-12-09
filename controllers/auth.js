require ('dotenv').config();

const User = require ('../models/Users/userModel');
const Token = require ('../models/tokenModel');
const bcrypt = require ('bcrypt');
const randomString = require ('randomstring');
const mailer = require ('../helpers/sendEmail');
const msgSignup = require ('../helpers/msgForUsers');

const {genAccessToken, genRefreshToken } = require ('../helpers/refreshJwtToken');




exports.signup = async (req, res) => {
    try {
        const key = await randomString.generate(4).toUpperCase();
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
                    secretMsgExp: Date.now() + 30 * 60 * 1000,
                    secretKey: key,
                    isActive: false
                });
                newUser
                    .save()
                    .then((validNewUser) => {
                        const validEmail = msgSignup(validNewUser);
                        mailer(validEmail);
                        res.redirect(`/verifyEmail/${secret}`)
                        }).catch(err => console.log(err));
                   });
                }
            }catch (e) {
                console.log(e)
            }
        };


exports.verifyEmail =  async (req, res) => {
    try {
        const user = await User.findOne({
            secretKey: req.body.secretKey,
            secret: req.body.secret,
            secretMsgExp: {$gt: Date.now()}
        });
        if (!user){
            req.flash('error', 'token invalid');
            res.redirect ('/verifyEmail')
        }
        if (!user.secretKey === req.body.secretKey && !user.secret === req.body.secret){
            req.flash('error', 'Error');
            res.redirect('/sign')
        } else {
            User.updateOne({ _id: user._id }, {isActive: false})
                .then(() => {
                    res.redirect('/signin')
                })
            }
        } catch (e) {
        console.log(e)
    }
};


exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user){
            req.flash('error', 'Пользователь не найден');
            res.redirect('/signin')
        }
        if (req.body.secretKey !== user.secretKey && user.secretMsgExp < Date.now()) {
            req.flash('error', 'Ключ активации не подходит');
            res.redirect('/sign')
        }
            const isValid = await bcrypt.compare(req.body.password, user.password);

            if (!isValid) {
                req.flash('error', 'Неверный пароль');
                res.redirect('/sign')

            } else {
                const token = await genAccessToken(user._id);
                const refreshToken = await genRefreshToken(user._id);
                const newToken = new Token({
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
                    .then(() => {
                    res.redirect('/');
                });
            }
        } catch (e) {
            console.log(e)
        }
    };



