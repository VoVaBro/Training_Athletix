const mongoose = require ('mongoose');


const UserSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 16
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    secret: {
        type: String,
        trim: true,
        unique: true,
    },
    secretMsgExp:{
        type: Date
    },
    secretKey: {
        type: String,
        trim: true,
        unique: true
    },
    isActive: {
       type: Boolean
    }
});

module.exports = mongoose.model('User', UserSchema);


