const mongoose = require ('mongoose');
const User = require ('../models/Users/userModel');
const bcrypt = require ('bcrypt');


exports.signup = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (user){
            req.flash('emailError', 'email has already exist')
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

};