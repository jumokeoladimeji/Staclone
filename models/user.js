let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    default: '',
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  hashedPassword: {
    type: String,
    trim: true,
    default: ''
  },
  fullName: {
    type: String,
    lowercase: true,
    unique: true,
    required: 'Please fill in your full name',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
},
{ timestamps: true });


module.exports = mongoose.model('User', UserSchema);