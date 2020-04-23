const express = require('express');
const morgan = require('morgan');
const app = express();

require('./database');

//middleware
app.use(morgan('dev'));
app.use(express.json());

//routes
app.use(require('./routes/index'));



app.listen(3000, ()=>{
    console.log("servidor conectado en el puerto 3000")
});