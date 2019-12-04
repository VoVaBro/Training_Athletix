const Training = require("../models/trainingModel");
const User = require ('../models/Users/userModel');
const Record = require('../models/recordModel');
const mongoose = require('mongoose');

exports.addTraining = (req,res) => {
    let errors = [];

    if(!req.body.dateTraining){
        errors.push({text:'Пожалуйста выберите дату тренировки'});
    }
    if(req.body.timetable.length<1){
        errors.push({text:'Пожалуйста добавьте события'});
    }
    if(errors.length > 0){
        res.jsonp(errors);
    } else {
        const newTraining = {
            timetable : req.body.timetable,
            dateTraining : req.body.dateTraining
        };
        new Training(newTraining)
            .save()
            .then(training => {
                res.status(201).jsonp([{text : "Расписание сохранено", bool : 1}]);
            })
    }
};

exports.loadTraining = async (req, res) => {
    let params = {
        "dateTraining" : req.params.id
    };

    try {
        let trainings = await Training.getTrainings(params)

        res.jsonp(trainings);
    } catch(e) {
        throw new Error(e)
    }
};

exports.editTraining = (req, res) => {
    Training.findOne({
        "dateTraining" : req.params.id
    })
        .then(result => {
            if (req.body.onEdit !== undefined) {
                result.onEdit = req.body.onEdit;}
                // result.save();
                // res.jsonp([{text : "onEdit = true", bool : 1}]);

            // else {
            if (req.body.timetable !== undefined) {
                result.timetable = req.body.timetable;
            }
                result.save();
                res.jsonp([{text : "Расписание сохранено", bool : 1}]);
            // }
        })
        .catch(err => {
            if (err) {
                res.jsonp([{text : "Произошла ошибка, попробуйте позже", bool : 0}]);
            }
        })

};

exports.removeTraining = (req, res) => {
    Training.deleteOne({
        "dateTraining" : req.params.date
    })
        .then( () => {
            res.jsonp([{text : "Расписание удалено", bool : 1}]);
        })
};

exports.loadUser = (req, res) => {
    User.findOne({
        "_id" : req.params.id
    })
        .then(result => {
            res.jsonp(result);
        })
};

exports.removeAllRec = (req, res) => {
    Record.deleteMany({
       "dateTraining" : req.params.date
    })
    .then(result => {
        res.jsonp(result);
    })
        .catch(err => {
            if (err) {
                res.jsonp([{text: "Произошла ошибка, повторите операцию позже", bool : 0}]);
            }
        })
};