const express = require ('express');
const {PORT, MONGO_URI} = require ('./settings/config');
const path = require('path');
const bodyParser = require ('body-parser');
const exphbs  = require('express-handlebars');
const mongoose = require ('mongoose');
const flash = require ('connect-flash');
const session = require ('express-session');
const varMid = require ('./middleware/variables');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(flash());

const routes = require ('./routes/routes');
const recordRouter = require("./routes/_del");

// Handlebars Middleware
app.engine('hbs', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname,'public')));
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    cookie: { secret: true }
}));

app.use(varMid);

app.use('/', routes);
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




