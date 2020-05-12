require('dotenv').config()
process.env.NODE_ENV = 'test';

require('../../models/user')
const mongoose = require('mongoose')
User = mongoose.model('User')

const chai = require('chai');
const { expect } = chai;
const bcrypt = require('bcryptjs');
chai.use(require('chai-http'));
const faker = require('faker');

const index = require('../../app');
const auth = require('../../middleware/auth');
const userController = require('../../controllers/user')


const userData = { 
    fullName: faker.internet.userName(), 
    password: faker.internet.password(), 
    email: faker.internet.email()
};


describe('User Controller',  () => {
    
    describe('Sign Up Function', () => {
        it('should create users', (done) => {
            chai.request(index)
                .post('/api/v1/user/signup')
                .send(userData)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

    });
    
    describe('Sign In Function', () => {
        it('should sign in users', (done) => {
            chai.request(index)
            .post('/api/v1/user/signin')
            .send({ password: userData.password,
                email: userData.email })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object')
                done();
            })
        });
    });

    describe('User Search Function', () => {
        it('should return an error when the user token is invalid', (done) => {
            chai.request(index)
            .get('/api/v1/users/search')
            .set('authorization', `token`)
            .then((res) => {
                expect(res).to.have.status(401);
                expect(res).to.be.json;
                done();
            })
        });
    });

    // after((done) => {
	// 	User.deleteMany().exec();
	// 	done();
	// });
});