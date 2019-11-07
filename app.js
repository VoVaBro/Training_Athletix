const express = require ('express');
const {PORT, MONGO_URI} = require ('./settings/config');
const path = require('path');
const bodyParser = require ('body-parser');
const exphbs  = require('express-handlebars');
const mongoose = require ('mongoose');

const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



const routes = require ('./routes/routes');


const recordRouter = require("./routes/_del");






// Static folder
app.use(express.static(path.join(__dirname,'public')));

// Handlebars Middleware
app.engine('hbs', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');





// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder -> ХУЯТИК
app.use(express.static(path.join(__dirname,"public")));




app.use('/', routes);

// Не успел создать роутер -> МНЕ ЖЕСТКО ПОХУЙ
// app.get('/record', (req, res) =>{
//     res.render("record",{layout: false});
// });
app.use('/record',recordRouter);



mongoose.connect(MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('DB connected');
        app.listen(PORT, () => console.log(`server start on port ${PORT}`));
    }).catch(err => console.log('Error:', err ));




