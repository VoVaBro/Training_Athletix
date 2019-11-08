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
               res.redirect('/') //login
            });
        }
    }catch (e) {
        console.log(e)
    }
};

exports.signin = async (req, res) => {
    req.session.isAuthenticated = true;
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user){
            req.flash('msg', 'Пользователь не найден')
        }
        if (user){
            const isValid = await bcrypt.compare(req.body.password, user.password);
            if (!isValid){
                req.flash('error', 'Неверный пароль');
                res.redirect('/signig')
            }
            if (isValid) {
                const token = jwt.sign ({_id:user.id, secret});
                res.header('auth-token', token).send('token:', token)
            } else {
                res.status(401).json({msg: 'auth failed'})
            }
        }
    }catch (e) {
        console.log(e)
    }
};