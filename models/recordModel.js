const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    recordTime: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    dateTraining: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('record',recordSchema);
