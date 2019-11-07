const express = require('express');
const router = express.Router();
const Record = require('../models/recordModel');
const mongoose = require('mongoose');


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
        const newRecord = {
            recordTime: req.body.recordTime,
            dateTraining: req.body.calendar
        };
        new Record(newRecord)
            .save()
            .then(idea => {
                res.redirect("/record");
            })
    });



module.exports = router;
