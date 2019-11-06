const express = require ('express');
const {PORT} = require ('./settings/config');
const path = require("path");
const exphbs  = require('express-handlebars');

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Static folder
app.use(express.static(path.join(__dirname,"public")));

app.get('/', (req, res) =>{
        res.render("index",{layout: false});
    });


app.listen(PORT, () => console.log(`server start on port ${PORT}`));

