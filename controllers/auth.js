require ('dotenv').config();

const mongoose = require('mongoose');
const User = require ('../models/Users/userModel');
const Token = require ('../models/tokenModel');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const randomString = require ('randomstring');
const mailer = require ('../helpers/sendEmail');
const msgSignup = require ('../helpers/msgForUsers');
const { refreshJwtSecret } = require ('../helpers/tokenConfig').jwt;

const {genAccessToken, genRefreshToken } = require ('../helpers/refreshJwtToken');




exports.signup = async (req, res) => {
    try {
        const key = await randomString.generate(6).toUpperCase();
        const secret = await randomString.generate();
        const user = await User.findOne({email: req.body.email});
        if (user){
            req.flash('error', 'Такой email уже используется');
            res.status(500).redirect('/signup')
        }
        if (!user){
           await bcrypt.hash(req.body.password, 10, (err, hash) => {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    secret: secret,
                    secretMsgExp: Date.now() + 60 * 60 * 1000,
                    secretKey: key,
                    isActive: false
            });
                newUser
                    .save()
                    .then((validNewUser) => {
                        const validEmail = msgSignup(validNewUser);
                        mailer(validEmail);
                        res.redirect('/')
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
         res.redirect ('/signin')
      }
      if (!user.secretKey === req.body.secretKey && !user.secret === req.body.secret){
          req.flash('error', 'Error');
          res.redirect('/')
      } else {
          User.updateOne({ _id: user._id }, {isActive: true})
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
        } else {
            const isValid = await bcrypt.compare(req.body.password, user.password);
            if (!isValid) {
                req.flash('error', 'Неверный пароль');
                res.redirect('/signin')
            } else {

                const token = await genAccessToken(user._id);
                const refreshToken = await genRefreshToken(user._id);

                const newToken = new Token({
                    token: refreshToken.token,
                    tokenId: refreshToken.tokenId
                });

               delete user.secret;
               delete user.secretKey;
               delete user.secretMsgExp;

               await user.save();

                req.session.headers = {};
                req.session.headers['Authorization'] = token;
                // req.session.id = user._id;
                req.session.userId = user._id;
                await req.session.save(err => {
                    if (err) throw err
                });
                await newToken.save()
                    .then(() => {
                    res.redirect('/');
                });
            }
        }
    } catch (e) {
        console.log(e)
    }
};

exports.refreshToken = async (req, res) => {

    try {

        const refreshToken = await Token.findOne({tokenId: req.session.id});
        if(!refreshToken) return res.status(403).redirect('/signin');
        const decoded = await jwt.verify(refreshToken, refreshJwtSecret);
        if (!decoded) res.status(401).redirect('/signin');
        return await genAccessToken(decoded);

    } catch (e) {
        if (e) throw e
    }
};

