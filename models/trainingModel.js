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

let model = mongoose.model('training', trainingSchema);

model.getTrainings = async (params) => {
    return model.find({
        ...params
    })
};

module.exports = model;