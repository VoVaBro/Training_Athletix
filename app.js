require('dotenv').config();
const express = require ('express');
const {PORT, MONGO_URI} = require ('./settings/config');
const { secret } = require ('./settings/config').session;
const path = require('path');
const bodyParser = require ('body-parser');
const exphbs  = require('express-handlebars');
const mongoose = require ('mongoose');
const flash = require ('connect-flash');
const session = require ('express-session');
const isAuth = require ('./middleware/isAuth');
const cookieParser = require ('cookie-parser');
const MongoSessionStore = require ('connect-mongo')(session);
const randomString = require ('randomstring');
const app = express();




//DB
mongoose.connect(process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('DB connected');
        app.listen(process.env.PORT, () => console.log(`server start on port ${process.env.PORT}. ${process.env.GRIT}`));
    }).catch(err => console.log('Error:', err ));

//body/cookie parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

// Handlebars Middleware
app.engine('hbs', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

//Static folders
app.use(express.static(path.join(__dirname,'public')));

//Sessions
const sess = {
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MongoSessionStore ({ mongooseConnection: mongoose.connection }),
    cookie: {
        secret: true,
        maxAge:  180 * 60 * 100
    }
};

app.use(session(sess));
app.use(flash());

//Routes
app.use('/', require('./routes/routes'));
app.use('/record', isAuth, require("./routes/_del"));


