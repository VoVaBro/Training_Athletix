const express = require ('express');
const {PORT} = require ('./settings/config');
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname,"public")));

app.get('/', (req, res) =>{
        res.send('hello');
    });


app.listen(PORT, () => console.log(`server start on port ${PORT}`));

