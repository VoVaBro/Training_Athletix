const express = require('express');
const router = express.Router();
const Record = require('../models/recordModel');
const mongoose = require('mongoose');

async function gta (req, res) {
    let user;
    await Record.find({"dateTraining": req.body.calendar}, function (err, pro) {
        user = pro;
    });
    console.log(user);
}

router.get('/', (req,res) =>{
    res.render("record",{layout: false});
});

router.get('/:id', (req, res) => {
    Record.find({
        "dateTraining" : req.params.id
    })
        .then(result => {
            res.jsonp([result,req.session.user]);
        })

});

router.post('/', (req, res) => {
     const newRecord = {
                //pull user id
                user: req.session.user,
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



module.exports = router;
