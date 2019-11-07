const express = require ('express');
const {PORT, MONGO_URI} = require ('./settings/config');
const path = require("path");
const exphbs  = require('express-handlebars');
const mongoose = require ('mongoose');



const app = express();

// Handlebars Middleware -> ХУЕНДЛ
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Static folder -> ХУЯТИК
app.use(express.static(path.join(__dirname,"public")));

app.get('/', (req, res) =>{
        res.render("index",{layout: false});
    });

// Не успел создать роутер -> МНЕ ЖЕСТКО ПОХУЙ
app.get('/record', (req, res) =>{
    res.render("record",{layout: false});
});

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('DB connected');
        app.listen(PORT, () => console.log(`server start on port ${PORT}`));
        }).catch(err => console.log('Error:', err ));


