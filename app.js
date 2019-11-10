const express = require ('express');
const {PORT, MONGO_URI} = require ('./settings/config');
const { secret } = require ('./settings/config').session;
const path = require('path');
const bodyParser = require ('body-parser');
const exphbs  = require('express-handlebars');
const mongoose = require ('mongoose');
const flash = require ('connect-flash');
const session = require ('express-session');
const varMid = require ('./middleware/variables');
const cookieParser = require ('cookie-parser');
const MongoSessionStore = require ('connect-mongo')(session);

const app = express();

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

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());



const routes = require ('./routes/routes');
const recordRouter = require("./routes/_del");

// Handlebars Middleware
app.engine('hbs', exphbs({
    defaultLayout: 'main'
}));



app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname,'public')));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoSessionStore ({ mongooseConnection: mongoose.connection }),
    cookie: {
        secret: true,
        maxAge:  180 * 60 * 100
    }
}));

app.use(flash());
app.use(varMid);

app.use('/', routes);
app.use('/record',recordRouter);









