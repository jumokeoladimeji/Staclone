require('../models/question')
const mongoose = require('mongoose')
Question = mongoose.model('Question')

module.exports = {
    /**
     * @description - Fetches a question
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} question - fetched question
     */
    get(req, res) {
        Question.findById(req.params.questionId).populate('user').populate({path: 'answers'}).populate({path: 'votes'}).exec((err, question) => {
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
        Question.find({}, (err, questions) => {
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
    addAnswer (req, res) {
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
                if (req.user.id === question.answers[i].user.toString()) {
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
                  
                    question.answers.push(savedAnswer);
                    
                    question.save((err) => {
                        if (err) {
                            return res.status(500).json({ data: 'error saving answer to question' })
                        } else {
                            return res.status(200).json({ data: question })
                        }
                    });
                });
            } 
        }
    },


}
