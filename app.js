const express = require ('express');
const {PORT} = require ('./sittings/config');

const app = express();


app.get('/', (req, res) => res.send('hello'));


app.listen(PORT, () => console.log(`server start on port ${PORT}`));

