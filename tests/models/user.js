require('dotenv').config()
process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const User = mongoose.model('User');
const chai = require('chai');
const { expect } = chai;
const should = chai.should();
/**
 * Globals
 */
let user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', () => {
	before((done) => {
		user = new User({
			fullName: 'Full',
			email: 'test@test.com',
			password: 'password',
		});
		user2 = new User({
			fullName: 'Full',
			email: 'test@test.com',
			password: 'password',
		});

		done();
	});

	describe('Method Save', () => {
		it('should fail to save an existing user again', (done) => {
			user.save();
			return user.save((err) => {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without full name', (done) => {
			user.fullName = '';
			return user.save((err) => {
				should.exist(err);
				done();
			});
		});
	});

	// after((done) => {
	// 	User.deleteMany().exec();
	// 	done();
	// });
});