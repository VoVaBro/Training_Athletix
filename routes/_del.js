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
            res.jsonp(result);
        })

});

router.post('/', (req, res) => {
    let errors = [];
    if (!req.body.recordTime){
        errors.push({text:"Пожалуйста выберете время для записи на тренировку"});
    }
    if (!req.body.calendar){
        errors.push({text:"Пожалуйста выберете дату для записи на тренировку"});
    }

    if (errors.length > 0) {
        res.render("record",{
            layout: false,
            errors:errors
        })
    } else {
            const newRecord = {
                user: req.session.user,
                recordTime: req.body.recordTime,
                dateTraining: req.body.calendar
            };
            new Record(newRecord)
                .save()
                .then(idea => {
                    res.redirect("/record");
                });
        }
    });



module.exports = router;
