const questionController = require('../controllers/question');
const auth = require('../middleware/auth');


module.exports = (app) =>  {
    app.route('/api/v1/questions')
        .post(auth.verifyToken, questionController.create)
        .get(questionController.getAll);
    app.route('/api/v1/questions/:questionId') 
        .get(auth.verifyToken,questionController.get)
    app.route('/api/v1/questions/:questionId/upvote') 
        .put(auth.verifyToken, questionController.upvote)
    app.route('/api/v1/questions/:questionId/downvote') 
        .put(auth.verifyToken, questionController.downvote)
    app.route('/api/v1/questions/:questionId/answer') 
        .post(auth.verifyToken, questionController.addAnswer);
    app.route('/api/v1/questions/filter')
        .get(questionController.search);
    // app.route('/api/v1/answers/filter')
    //     .get(questionController.searchAnswers);
    app.param('questionId', questionController.questionByID);
}