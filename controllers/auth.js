const mongoose = require ('mongoose');
const User = require ('../models/Users/userModel');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const { secret } = require('../settings/config').jwt;

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
                const token = jwt.sign ({_id:user.id}, secret, {expiresIn: "3h"});
                req.session.headers = {}
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
