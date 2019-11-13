const Training = require("../models/trainingModel");
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
                res.status(201).jsonp(["Расписание сохранено"]);
            })
    }
};

exports.loadTraining = (req, res) => {
    Training.find({
        "dateTraining" : req.params.id
    })
        .then(result => {
            res.jsonp(result);
        })
    };

exports.editTraining = (req, res) => {
    Training.findOne({
        "dateTraining" : req.params.id
    })
        .then(result => {
            result.timetable = req.body.timetable;
            result.save();
            res.jsonp(["Расписание перезаписано"]);
        })

};

exports.removeTraining = (req, res) => {
    Training.deleteOne({
        "dateTraining" : req.params.date
    })
        .then( () => {
            res.jsonp(["Расписание удалено"]);
        })
};