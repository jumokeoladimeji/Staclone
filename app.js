const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
// const db = require('./config/database');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());


const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, err => {
    if (err){
        console.error(err);
    }
    console.info('successfully listening on port ' + PORT)
});