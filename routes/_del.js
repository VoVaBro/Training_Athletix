const express = require('express');
const router = express.Router();
const Record = require('../models/recordModel');
const mongoose = require('mongoose');


router.get('/', (req,res) =>{
    res.render("record",{layout: false});
});

router.get('/:id', (req, res) => {
    if (req.params.id === "all") {
        Record.find({}).populate('user')
            .then(result => {
                res.jsonp([result, req.session.userId]);
            })
    } else {
        Record.find({
            "dateTraining": req.params.id
        }).populate('user')
            .then(result => {
                res.jsonp([result, req.session.userId]);
            })
    }
});

router.post('/', (req, res) => {
     const newRecord = {
                //pull user id
                user: req.session.userId,
                recordTime: req.body.recordTime,
                dateTraining: req.body.dateTraining
            };
    new Record(newRecord)
                .save()
                .then( () => {
                    res.jsonp([{text : "Спасибо что записались на тренировку!", bool : 1}]);
                })
                .catch( err => {
                    if (err) {
                        res.jsonp([{text : "Возникли проблемы с записью на тренировку. Пожалуйста повторите операцию позже", bool : 0}]);
                    }
                });

    });

router.delete('/:id', (req, res) => {
    if (req.params.id === "many") {
        let { ids } = req.body;
        Record.deleteMany({ _id : { $in: ids} })
            .then( () => {
                res.jsonp([{text : "Расписание на тренировку удалено", bool : 1}]);
            })
            .catch(err => {
                if (err){
                    res.jsonp([{text : "Ошибка, обновите страницу и попробуйте удалить запись", bool : 0}]);
                }
            })
    } else {
        Record.deleteOne({
            "_id" : req.params.id
        })
            .then( () => {
                res.jsonp([{text : "Расписание на тренировку удалено", bool : 1}]);
            })
            .catch(err => {
                if (err){
                    res.jsonp([{text : "Ошибка, обновите страницу и попробуйте удалить запись", bool : 0}]);
                }
            })
    }

});

router.put(`/:id`, async (req,res) => {
    try {
        await Record.updateOne({ _id : req.params.id }, { recordTime: req.body.recordTime });
    } catch (e) {
        console.log(e);
    }
    // Record.findOne({
    //     "_id" : req.params.id
    // })
    //     .then(result => {
    //             result.recordTime = req.body.recordTime;
    //             result.save();
    //     })
    //     .catch(err => {
    //         if (err) {
    //             res.jsonp([{text : "Произошла ошибка, попробуйте позже", bool : 0}]);
    //         }
    //     })
});

module.exports = router;
