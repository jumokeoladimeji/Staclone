require('dotenv').config()
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');

chai.use(require('chai-http'));
const dbHandler = require('../test-db-config');
const index = require('../../app');
const auth = require('../../middleware/auth');
const questionController = require('../../controllers/question')
require('../../models/question');
require('../../models/upvote');
require('../../models/downvote');
require('../../models/answer');


const Question = mongoose.model('Question')
const Upvote = mongoose.model('Upvote');
const Downvote = mongoose.model('Downvote');
const Answer = mongoose.model('Answer');

const userArray = require('../mock-data/mock-users')
let userData = {};
const questionsArr = require('../mock-data/mock-questions');
let questionData = {}



describe('Question Controller',  () => {

    before((done) => {
        const newUser = new User(userArray[0])
        newUser
        .save((err, createdUser) => {
            if (err) {
            console.log('error creating user', err);
            }
            else { 
                userData = createdUser;
                userData.token = auth.generateToken(userData);
                const question = new Question(questionsArr[0]);
            
                question.user = createdUser._id;

                question
                .save((err, createdQuestion) => {
                    if (err) {
                        console.log('error creating question', err);
                    }
                    else { 
                        questionData = createdQuestion;
                    }
                    done();
                });
            }
        });
    });


    describe('Get Function', () => {
        it('should find a single Question', (done) => {
            chai.request(index)
            .get(`/api/v1/questions/${questionData._id}`)
            .set('authorization', `${userData.token}`)
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.data).to.be.an('object')
                done();
            });
    
        });

    });
    
    describe('Get All Function', () => {
        it('should find all Questions', (done) => {
            chai.request(index)
                .get('/api/v1/questions')
                .set('authorization', `${userData.token}`)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.data).to.be.an('array')
                    done();
            });
        });
    });

    describe('Create Function', () => {
        it('should create a new question', (done) => {
            chai.request(index)
            .post('/api/v1/questions')
            .set('authorization', `${userData.token}`)
            .send(questionsArr[1])
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                done();
            });
        });
    });

    // after((done) => {
    //     User.deleteMany().exec();
    //     Question.deleteMany().exec();
	// 	done();
	// });
});
