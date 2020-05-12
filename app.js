const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
// const openApiDocumentation = require('./openApiDocumentation');

require('./config/db');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
  
app.use((req, res, next)  => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
require('./routes/question')(app);
require('./routes/user')(app);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to staclone." });
});



app.use('*', (req, res) => {
    res.status(404).json({ data: 'Unknown URL' });
});

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error starting the app:${err}`)
  }
  console.info(`The server is running on localhost PORT: ${PORT}`);
});

module.exports = app;