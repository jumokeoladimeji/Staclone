let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const secret = require('../config').secret;
const bcrypt = require('bcryptjs');

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

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', (next) => {
	if (this.password) {
		this.hashedPassword = this.hashPassword(this.password);
	}
	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = (password) => {
	if (this.salt && password) {
		return bcrypt.hashSync(password, 12);
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.hashedPassword === this.hashPassword(password);
};

module.exports = mongoose.model('User', UserSchema);