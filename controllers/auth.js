require ('dotenv').config();
// const secret = process.env.jwtSecret;
// const mongoose = require ('mongoose');
const User = require ('../models/Users/userModel');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const randomString = require ('randomstring');
const mailer = require ('../helpers/sendEmail');
const msgSignup = require ('../helpers/msgForUsers');
const {genAccessToken, replaceRefreshToken, genRefreshToken } = require ('/helpers/refreshJwtToken');


const updateToken = async userId => {

    const accessToken = await genAccessToken(userId);
    const refreshToken = await genRefreshToken();

    return replaceRefreshToken(refreshToken.id, userId)
        .t
};




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
                        const validEmail = msgSignup(validNewUser, secret);
                        mailer(validEmail);
                        res.redirect('/')
                    }).catch(err => console.log(err));
           });
        }
    }catch (e) {
        console.log(e)
    }
};

exports.firstSignin =  async (req, res) => {
  try {
      const user = await User.findOne({
          userId: req.body._id,
          secretMsgExp: {$gt: Date.now()}
      });
      if (!user){
         req.flash('error', 'token invalid');
         res.redirect ('/signin')
      } else {
          const token = jwt.sign ({_id:user.id}, secret , {expiresIn: "3h"});
          user.isActive = true;
          user.secretKey = undefined;
          user.secret = undefined;
          user.secretMsgExp = undefined;
          req.session.headers = {};
          req.session.headers['Authorization'] = token;
          req.session.save(err => {
              if (err) throw err
          });
          await user.save()
              .then(() => {
                  console.log('авторизаци прошла успешно');
                  // console.log(token);
                  res.redirect('/')
              });
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
                // const token = jwt.sign ({_id:user.id}, secret , {expiresIn: "3h"});

                // req.session.headers = {};
                // req.session.headers['Authorization'] = token;
                // req.session.isAuthenticated = true;
                // req.session.save(err => {
                //     if (err) throw err
                    res.redirect('/');
                // });
                // console.log('авторизаци прошла успешно');
            }
        }
    } catch (e) {
        console.log(e)
    }
};




//
// exports.reset = async (req, res) => {
//      try {
//         const secret = await randomString.generate();
//         const user = await User.findOne({email: req.body.email});
//
//         if (!user) {
//             req.flash('error', 'Пользователь не найден');
//             res.redirect('/reset')
//         } else {
//                 user.secretMsg = secret;
//                 user.secretMsgExp = Date.now() + 60 * 60 * 1000;
//                 await user.save()
//         }
//
//     } catch (e) {
//         if (e) {
//             throw e
//         }
//     }
// };