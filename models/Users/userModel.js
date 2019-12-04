const mongoose = require ('mongoose');
const ObjectId = require ('mongoose').ObjectId;


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
    secretMsg: String,
    secretMsgExp: Date
});

let model = mongoose.model('User', UserSchema);

model.add = function(){
    return 123
}

module.exports = model;


