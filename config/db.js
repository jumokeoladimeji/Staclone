require('dotenv').config()

const mongoose = require('mongoose');

const db = process.env === 'test' ? process.env.MONGOLAB_AQUA_URI : process.env.MONGODB_URI
const connect = () => mongoose.connect(
  process.env.MONGODB_URI,
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

mongoose.connection
  .on('error', err => {
    console.log('error reconnecting to the db', err);
  })
  .on('disconnected', () => connect());
  

module.exports = connect();