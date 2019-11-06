const express = require ('express');
const {PORT} = require ('./sittings/config');

const app = express();





app.listen(PORT, () => console.log(`server start on portn ${PORT}`));