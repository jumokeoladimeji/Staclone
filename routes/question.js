const questionController = require('../controllers/question');


module.exports = (app) =>  {
    app.route('/api/vi/questions')
        .post(auth.verifyToken, questionController.create)
        .get(questionController.getAll);
    app.route('/api/v1/users/:userId([0-9]+)/questions/:ticketId([0-9]+)') 
        .get(questionController.getAll)
        .put(auth.verifyToken, questionController.tuggleVote)
        .put(auth.verifyToken, questionController.addAnswer);
}
// ● Search (Questions, Answers and Users) 