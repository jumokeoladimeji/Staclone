require('../models/question')
const mongoose = require('mongoose')
Question = mongoose.model('Question')
Upvote = mongoose.model('Upvote');
Downvote = mongoose.model('Downvote');
Answer = mongoose.model('Answer');
const sendEmail = require('../helpers/send-email');

const removeUpvoteFromQuestionAndVote = (user, question, res, incrBy) => {
    Question.updateOne({_id: question._id},{ $inc: { voteCount: incrBy } }, (err) => {
        if (err) {
            return res.status(500).json({ 
                data: `error upvoting question: ${err}` 
            })
        } else {
             // delete voter document from upvote
             Upvote.updateOne({
                questionId: question._id,
            },
                {
                    $pull: {
                        voters: mongoose.Types.ObjectId(user._id) 
                    }
                }, (err) => {
                    question.voteCount += incrBy;
                    return res.status(200).json({ 
                        message: 'Question successfully negated upvote',
                        data: question 
                    });
                });
        };
    });
}

const removeDownvoteAndIncrementCount = (user, question, res, incrBy) => {
    Question.updateOne({_id: question._id},{ $inc: { voteCount: incrBy } }, (err) => {
        if (err) {
            return res.status(500).json({ 
                data: `error upvoting question: ${err}` 
            })
        } else {
             // delete voter document from upvote
             Downvote.updateOne({
                questionId: question._id,
            },
                {
                    $pull: {
                        voters: mongoose.Types.ObjectId(user._id)
                    }
                }, (err, retvalue) => {
                    question.voteCount += incrBy;
                    return res.status(200).json({ 
                        message: 'Question successfully negated downvote',
                        data: question 
                    });
                });
        };
    });
}

module.exports = {
    /**
     * @description - Fetches a question
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} question - fetched question
     */
    get(req, res) {
        Question.findById(req.params.questionId).populate('user').populate('answers').exec((err, question) => {
            if (err) {
                return res.status(500).json({ data: 'error saving question:' + err })
            }
            return res.status(200).json(question)
        });
    },
      /**
     * @description - Fetches all questions
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} questions - questions fetched
     */
    getAll: function(req, res) {
        Question.find({}).populate('user').populate('answers').exec((err, questions) => {
            if (err) {
                return res.status(500).json({ data: 'error getting questions:' + err })
            } else {
                return res.status(200).json({ data: questions })
            }
        })
    },
      /**
     * @description - Creates a new question
     * @param {object} request - request object containing the question request
     * description received from the client
     * @param {object} response - response object served to the client
     * @returns {json} question - new question created
     */
    create(req, res) {
        // Validate request
        if(!req.body) {
            return res.status(400).json({
                data: "need to ask a question"
            });
        }
        const newQuestion = req.body;
        newQuestion.user = req.user._id;

        Question.create(newQuestion, (err, createdQuestion) => {
            if (err) {
                return res.status(500).json({ data: 'error saving question:' + err })
            }
              else {
                return res.status(200).json({
                    message: "Question successfully created",
                    data: createdQuestion
                })
            }
        })
    },
    update(req, res) {
        Question.findById(req.params.id, (err, question) => {
            if (err) {
                return res.status(500).json({ data: 'error updating question:' + err })
            }
            question.query = req.body.query || question.query
            // question.updatedDate = Date.now()
            question.save(function(err, updatedQuestion){
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json({ data: updatedQuestion })
            })
        })
    },
      /**
     * @description - Deletes a question
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} message, response or error
     */
    delete(req, res) {
        Question.findByIdAndRemove(req.params.id, (err, question) =>
            {
                if (err) {
                    return res.status(500).json({ data: 'error deleting question:' + err })
                } else {
                    return res.status(200).json({ data: 'Question deleted successfully' })
                }
            })
            
    },
    /**
    * @description - Adds answer to a question
    * @param {object} request - request object received from the client
    * @param {object} response - response object served to the client
    * @returns {json} message, response or error
    */
    async addAnswer (req, res) {
        const question = req.question;     
        if (!req.body) {
            return res.status(422).send({
                message: 'question needs an answer'
            }); 
        }
        let newAnswer = {
            answer: req.body.answer,
            user: req.user._id
        };
        let hasAnsweredBefore = false;

        if (req.user._id.toString() === question.user._id.toString()) {
            return res.status(400).send({
                message: 'You cannot answer your own question'
            });
        } else {
            for (let i = 0; i < question.answers.length; i++) {
                if (req.user._id.toString() === question.answers[i].user._id.toString()) {
                    hasAnsweredBefore = true;
                    return  res.status(500).json({ data: 'you have already answerred this question' })
                }
            }
            if (!hasAnsweredBefore) {
                const answer = new Answer(newAnswer)

                answer.save((err) => {
                    if (err) {
                        return res.status(500).json({ data: 'error saving answer: ' + err })
                    }
                  
                    question.answers.push(answer._id);
                    
                    question.save((err) => {
                        if (err) {
                            return res.status(500).json({ data: 'error saving answer to question' })
                        } else {
                            const questionLink = `http://${req.headers.host}/api/v1/questions/${req.params.questionId}`;
                            sendEmail.notify(res, req.user, questionLink, question);
                        }
                    });
                });
            } 
        }
    },
     /**
     * @description - Upvotes a question
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} message, response or error
     */
    upvote (req, res) {
        const votedQuestion = req.question;
        let newUpvote = {};
        let hasupvoted = false;
        let hasdownvoted = false;
        const questionId = req.params.questionId

        Upvote.findOne({ questionId: questionId }).populate('voters').exec((error, upvote) => {
            if (error) {
                return res.status(500).json({ data: `error upvoting question: ${error}` })
            }
            // check if has upvoted
            if (upvote) {
                for (let i = 0; i < upvote.voters.length; i++) {
                    if (req.user._id.toString() === upvote.voters[i]._id.toString()) {
                        hasupvoted = true;
                        removeUpvoteFromQuestionAndVote(req.user, votedQuestion, res, -1);   
                        break;
                    }
                }
            }  else {
                const upVoteToCreate = {
                    voters: [],
                    questionId: req.question._id,
                };
                newUpvote = new Upvote(upVoteToCreate)
            }  
    
            if (!hasupvoted) {
                const upvoteToUpdate = upvote || newUpvote;
                upvoteToUpdate.voters.push(req.user._id);

                upvoteToUpdate.save((err) => {
                    if (err) {
                        return res.status(500).json({ data: 'error saving new upvote' + err })
                    } 
                    // check if has downvoted
                    Downvote.findOne({ questionId: questionId }).populate('voters').exec((err, downvote) => {
                        if (err) {
                            return res.status(500).json({ data: `error while returning question downvote: ${err}` }) 
                        }

                        if(downvote) {
                            for (let i = 0; i < downvote.voters.length; i++) {

                                if (req.user._id.toString() === downvote.voters[i]._id.toString()) {
                                    hasdownvoted = true;

                                    Downvote.updateOne({
                                        questionId: questionId,
                                    },{
                                        $pull: {
                                            voters: mongoose.Types.ObjectId(req.user._id)
                                        }
                                    }, (err) => {
                                        Question.updateOne({_id: questionId},{ $inc: { voteCount: 2 }}).then(() => {

                                            return res.status(200).json({ 
                                                message: 'Question successfully upvoted',
                                                data: votedQuestion })
                                        }).catch(err => {
                                            return res.status(500).json({ data: `error upvoting question: ${err}` }) 
                                        });
                                    });

                                    break;
                                }
                            }
                        }  

                        if(!hasdownvoted) {

                            votedQuestion.voteCount++;
                            votedQuestion.save((err) => {
                                if (err) {
                                    return res.status(500).json({ data: `error upvoting question: ${err}` })
                                } 
                                return res.status(200).json({ 
                                    message: 'Question successfully upvoted',
                                    data: votedQuestion 
                                })
                            });
                        }
                    });
                });
            }
        })
    },
    /**
     * @description -  Downvotes a question
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} message, response or error
     */
    downvote (req, res) {
        const votedQuestion = req.question;
        let newDownvote = {};
        let hasupvoted = false;
        let hasdownvoted = false;

        Downvote.findOne({ questionId: req.params.questionId }).populate('voters').exec((error, downvote) => {
            if (error) {
                return res.status(500).json({ data: `error downvoting question: ${error}` })
            }
            // check if has downvoted
            if (downvote) {
                for (let i = 0; i < downvote.voters.length; i++) {
                    if (req.user._id.toString() === downvote.voters[i]._id.toString()) {
                        hasdownvoted = true;
                        // delete downvote
                        removeDownvoteAndIncrementCount(req.user, votedQuestion, res, +1)
                        break;
                    }
                }
            } else {
                const downVoteToCreate = {
                    voters: [],
                    questionId: req.question._id,
                };
                newDownvote = new Downvote(downVoteToCreate)

            }
            if (!hasdownvoted) {
                const downToUpdate = downvote || newDownvote;
                downToUpdate.voters.push(req.user._id);

                downToUpdate.save((err) => {
                    if (err) {
                        return res.status(500).json({ data: 'error saving new upvote' + err })
                    } 
                    Upvote.findOne({ questionId: req.params.questionId }).populate('voters').exec((err, upvote) => {
                        if (err) {
                            return res.status(500).json({ data: `error while returning upvote: ${err}` }) 
                        }
                        if(upvote) {
                            for (let i = 0; i < upvote.voters.length; i++) {
                                if (req.user._id.toString() === upvote.voters[i]._id.toString()) {
                                    hasupvoted = true;
                                    // delete voter document from upvote
                                    Upvote.updateOne({
                                        questionId: req.params.questionId,
                                    },
                                        {
                                            $pull: {
                                                voters: mongoose.Types.ObjectId(req.user._id) 
                                            }
                                        }, (err) => {

                                            Question.updateOne({_id: req.params.questionId},{ $inc: { voteCount: -2 }}).then(() => {
                                                            return res.status(200).json({ 
                                                                message: 'Question successfully negated upvote',
                                                                data: votedQuestion 
                                                            });
                                            }).catch(err => {
                                                return res.status(500).json({ data: `error upvoting question: ${err}` }) 
                                            });
                                        });
                                    break;
                                }
                            }
                        } 
                        if (!hasupvoted) {
                            votedQuestion.voteCount -= 1;
                            votedQuestion.save((err) => {
                                if (err) {
                                    return res.status(500).json({ data: `error downvoting question: ${err}` })
                                } else {
                                    return res.status(200).json({ message: 'Question successfully downvoted',
                                    data: votedQuestion })
                                }
                            });
                        }
                    })  
                })
            }
        })
        
    },

    search (req, res) {
        console.log('req.query', req.query)

        const filter = {   
            $text: { $search: `.*${req.query.search}.*` } 
        };

    
        Question.find(filter).populate('answers').exec((err, questions) => {
            if (err) {
                return res.status(500).json({ data: 'error getting questions:' + err })
            } else {
                return res.status(200).json({ data: questions })
            }
        })
    },
    /**
     * Question middleware
    */
    questionByID (req, res, next, id) {
        Question.findById(req.params.questionId).populate('user').populate('answers').exec((err, question) => {
            if (err) return next(err);
            if (!question) return next(new Error('Failed to load question ' + id));
            req.question = question;
            next();
        });
    }

}