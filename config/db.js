require('dotenv').config()

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbURI = (process.env.NODE_ENV === 'test') ? process.env.MONGOLAB_TEST : process.env.MONGODB_URI;

const connect = () => mongoose.connect(
  dbURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
)
.then(() => {
  console.log("Successfully connected to the db");    
})
.catch(error =>  { 
  console.log('error reconnecting to the db', error)
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
  

module.exports = connect();
