const questionController = require('../controllers/question');
const auth = require('../middleware/auth');


module.exports = (app) =>  {
    app.route('/api/v1/questions')
        .post(auth.verifyToken, questionController.create)
        .get(questionController.getAll);
    app.route('/api/v1/questions/:questionId') 
        .get(auth.verifyToken, questionController.questionByID, questionController.get)
    app.route('/api/v1/questions/:questionId/upvote') 
        .put(auth.verifyToken, questionController.questionByID, questionController.upvote)
    app.route('/api/v1/questions/:questionId/downvote') 
        .put(auth.verifyToken, questionController.questionByID, questionController.downvote)
    app.route('/api/v1/questions/:questionId/answer') 
        .post(auth.verifyToken, questionController.questionByID, questionController.addAnswer);
    app.route('/api/v1/questions')
        .get(questionController.search);
    // app.route('/api/v1/answers/filter')
    //     .get(questionController.searchAnswers);
}