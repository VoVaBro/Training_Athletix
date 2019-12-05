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
    }
});

let model = mongoose.model('User', UserSchema);

model.add = function(){
    return 123
}

module.exports = model;


