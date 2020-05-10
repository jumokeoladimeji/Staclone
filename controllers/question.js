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
            console.log('question', question)
             // delete voter document from upvote
             Downvote.updateOne({
                questionId: question._id,
            },
                {
                    $pull: {
                        voters: mongoose.Types.ObjectId(user._id)
                    }
                }, (err, retvalue) => {
                    console.log('retvalue:::', retvalue);

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
        Question.findById(req.params.questionId).populate('user').populate({path: 'answers'}).populate({path: 'upvotes'}).populate({path: 'upvotes'}).exec((err, question) => {
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
        Question.find({}).populate('user').populate({path: 'answers'}).populate({path: 'upvotes'}).populate({path: 'upvotes'}).exec((err, questions) => {
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
                        
                // const newUpvote = {};
                // newQuestion.voters = [];
                // newUpvote.voters.push(req.user._id);
                // newUpvote.questionId = req.question._id;
                // console.log('newUpvote', newUpvote)
                // const updatedUpvote = new Upvote(newUpvote)
                // console.log('updatedUpvote', updatedUpvote)

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
        let newAnswer = {
            answer: req.body,
            user: req.user
        };
        let hasAnsweredBefore = false;

        if (req.user.id === question.user._id.toString()) {
            return res.status(400).send({
                message: 'You cannot answer your own question'
            });
        } else {
            for (let i = 0; i < question.answers.length; i++) {
                if (req.user.id === question.answers[i].user) {
                    hasAnsweredBefore = true;
                    return  res.status(500).json({ data: 'you have already answerred this question' })
                }
            }
            if (!hasAnsweredBefore) {
                const answer = new Answer(newAnswer)

                answer.save((err) => {
                    if (err) {
                        return res.status(500).json({ data: 'error saving answer' })
                    }
                  
                    question.answers.push(answer);
                    
                    question.save((err) => {
                        if (err) {
                            return res.status(500).json({ data: 'error saving answer to question' })
                        } else {
                            const questionLink = `/api/v1/users/${req.params.id}/questions/${req.params.questionId}`
                            sendEmail.notify(req, res, questionLink, req.user);
                    
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
        const questionId = req.params.questionId

        Upvote.findOne({ questionId: questionId }).populate({path: 'voters'}).exec((error, upvote) => {
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
                const downVoteToCreate = {
                    voters: [],
                    questionId: req.question._id,
                };
                newDownvote = new Downvote(downVoteToCreate)
            }  
    
            if (!hasupvoted) {
                const upvoteToUpdate = upvote || newUpvote;
                upvoteToUpdate.voters.push(req.user._id);

                upvoteToUpdate.save((err) => {
                    if (err) {
                        return res.status(500).json({ data: 'error saving new upvote' + err })
                    } 
                });    
            // check if has downvoted
                Downvote.findOne({ questionId: questionId }).populate({path: 'voters'}).exec((err, downvote) => {
                    if (err) {
                        return res.status(500).json({ data: `error upvoting question: ${err}` }) 
                    }

                    if(downvote) {
                        for (let i = 0; i < downvote.voters.length; i++) {
                            if (req.user._id.toString() === downvote.voters[i]._id.toString()) {

                                Question.updateOne({_id: questionId},{ $inc: { voteCount: 1 }}).then(() => {

                                    Downvote.updateOne({
                                        questionId: questionId,
                                    },{
                                        $pull: {
                                            voters: mongoose.Types.ObjectId(req.user._id)
                                        }
                                    }, (err) => {
                                        return res.status(200).json({ 
                                            message: 'Question successfully upvoted',
                                            data: votedQuestion })
                                    })
                                }).catch(err => {
                                    return res.status(500).json({ data: `error upvoting question: ${err}` }) 
                                });
                                break;
                            }
                        }
                    } else {
                        votedQuestion.voteCount++;
                        votedQuestion.save((err) => {
                            if (err) {
                                return res.status(500).json({ data: `error upvoting question: ${err}` })
                            } 
                        });
                    }
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
        // let hasupvoted = false;
        let hasdownvoted = false;

        Downvote.findOne({ questionId: req.params.questionId }).populate({path: 'voters'}).exec((error, downvote) => {
            console.log('upvote gotten', downvote)
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
            }  
            if (!hasdownvoted) {
                if(!downvote) {
                    const downVoteToCreate = {
                        voters: [],
                        questionId: req.question._id,
                    };
                    newDownvote = new Downvote(downVoteToCreate)
                }
                const downToUpdate = downvote || newDownvote;
                downToUpdate.voters.push(req.user._id);

                downToUpdate.save().then(() => {

   
                     // check if has upvoted
                Upvote.findOne({ questionId: req.params.questionId }).populate({path: 'voters'}).exec((err, upvote) => {
                    if (err) {
                        return res.status(500).json({ data: `error downvoting question: ${err}` }) 
                    }
                    if(upvote) {
                        for (let i = 0; i < upvote.voters.length; i++) {
                            if (req.user._id.toString() === upvote.voters[i]._id.toString()) {
                                console.log('user already upvoted')
                                hasupvoted = true;
                                // delete upvote
                                Question.updateOne({_id: req.params.questionId,},{ $inc: { voteCount: -2 }}).then(() => {
                                         // delete voter document from upvote
                                         Upvote.updateOne({
                                            questionId: req.params.questionId,
                                        },
                                            {
                                                $pull: {
                                                    voters: mongoose.Types.ObjectId(req.user._id) 
                                                }
                                            }, (err) => {
                                                // question.voteCount += incrBy;
                                                return res.status(200).json({ 
                                                    message: 'Question successfully negated upvote',
                                                    data: votedQuestion 
                                                });
                                            });
                                    }).catch(err => {
                                        return res.status(500).json({ data: `error upvoting question: ${err}` }) 
                                    });
                                    break;
                            }
                        }
                    } else {
                        console.log('it fotr to push')
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
                });  
            }
        })
        
    },

    search (req, res) {
        // db.inventory.find( { "instock": { warehouse: "A", qty: 5 } } )
        console.log('req.query', req.query)

        // const filter = { answers: { answer: req.query.search } };
        // {
        //     query: { $regex : `.*${req.query.search}.*` },
        //     tag: { $regex : `.*${req.query.tag}.*` },
        //     answers: { answer: `.*${req.query.answer}.*` } 
        // }
        const filter = 
                        {   
                                query: { $regex : `.*${req.query.search}.*` } || '',
                                tag: { $regex : `.*${req.query.tag}.*` } || '',
                                answers: { answer: `.*${req.query.answer}.*` } || '', 
                     };
    
        Question.find(filter, (err, questions) => {
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
        Question.findById(req.params.questionId).populate('user').populate({path: 'answers'}).populate({path: 'upvotes'}).populate({path: 'upvotes'}).exec((err, question) => {
            if (err) return next(err);
            if (!question) return next(new Error('Failed to load question ' + id));
            req.question = question;
            next();
        });
    }

}