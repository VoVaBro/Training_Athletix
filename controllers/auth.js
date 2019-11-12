require ('dotenv').config();
const secret = process.env.jwtSecret;
const mongoose = require ('mongoose');
const User = require ('../models/Users/userModel');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
// const crypto = require ('crypto-random-string');
const randomString = require ('randomstring');


exports.signup = async (req, res) => {
    try {
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
                    password: hash
            });
                newUser.save().then(() => console.log('user saved')).catch(err => console.log(err));
               res.redirect('/signin')
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
            res.redirect('/signin')
        } else {
            const isValid = await bcrypt.compare(req.body.password, user.password);
            if (!isValid) {
                req.flash('error', 'Неверный пароль');
                res.redirect('/signin')
            } else {
                const token = jwt.sign ({_id:user.id}, secret , {expiresIn: "3h"});
                req.session.headers = {};
                req.session.headers['Authorization'] = token;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) throw err
                });
                console.log('авторизаци прошла успешно');
                res.redirect('/');
            }
        }
    } catch (e) {
        console.log(e)
    }
};

exports.reset = async (req, res) => {
     try {
        const secret = await randomString.generate();
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            req.flash('error', 'Пользователь не найден');
            res.redirect('/reset')
        } else {
                user.secretMsg = secret;
                user.secretMsgExp = Date.now() + 60 * 60 * 1000;
                await user.save()
        }



    } catch (e) {
        if (e) {
            throw e
        }
    }
    // try {
    //     crypto.randomBytes(32, async (err, buffer) => {
    //         if (err){
    //             throw err
    //         }
    //         const secret = buffer.toString('hash');
    //         const candidate =  await User.findOne({email: req.body.email});
    //
    //         if (!candidate){
    //             req.flash('error', 'Пользователь не найден, попробуйте ввести email снова');
    //             res.redirect ('/reset')
    //         } else {
    //             candidate.secretMsg = secret;
    //             candidate.secretMsgExp = Date.now() + 60 * 60 * 1000;
    //             await candidate.save()
    //             //send msg on email
    //         }
    //     })
    // } catch (err) {
    //     if (err) throw err;
    // }
};