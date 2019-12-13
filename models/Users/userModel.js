const mongoose = require ('mongoose');


const UserSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 16
    },
    secondName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 16
    },
    phoneNum: {
        type: String,
        trim: true,
        required: true,
        unique: true
        // match: /^((\+7|7|8)+([0-9]){10})$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: false
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
    },
    isConfirm: {
        type: Boolean
    }
});

let model = mongoose.model('User', UserSchema);



module.exports = model;


