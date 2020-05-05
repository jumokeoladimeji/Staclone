const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
// const db = require('./config/database');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to staclone." });
});
  

app.use((req, res, next)  => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});


const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error starting the app:${err}`)
  }
  console.info(`The server is running on localhost PORT: ${PORT}`);
});

module.exports = app;