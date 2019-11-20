const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainingSchema = new Schema({
    date : {
        type : Date,
        default : Date.now
    },
    dateTraining : {
        type : String,
        required : true
    },
    timetable : {
        type : Array,
        required : true
    },
    onEdit : {
        type: Boolean,
        default : false
    }
});

module.exports = mongoose.model('training', trainingSchema);