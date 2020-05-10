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
  password: {
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

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.hashedPassword === this.hashPassword(password);
};

module.exports = mongoose.model('User', UserSchema);