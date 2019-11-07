const mongoose = require ('mongoose');
const User = require ('../models/Users/userModel');
const bcrypt = require ('bcrypt');


exports.signup =  async (req, res) => {
      User.findOne({email: req.body.email})
        .select('email name password')
        .exec()
        .then(user => {
            if (user) {
                res.redirect('/')
            }
            if(!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) res.status(401).json({err: 'try to creat user again!'});
                    const newUser = new User({
                        _id: mongoose.Types.ObjectId,
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    });
                    newUser
                        .save()
                        .then((result) => {
                            res.status(200).json({created: ` new user: ${result.name}`})
                        }).catch(err => console.log('Error:', err))
                })
            }
        })
};