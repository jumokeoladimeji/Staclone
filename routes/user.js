const userController = require('../controllers/user');
const { userSignUpValidation, userSignInValidation, validate } = require('../middleware/validator')

module.exports = (app) => {
  app.route('/api/v1/user/signup')
    .post(userSignUpValidation(), validate, userController.signup);
  app.route('/api/v1/user/signin')
    .post(userSignInValidation(), validate, userController.signin);
  app.route('/api/v1/users')
    .get(auth.verifyToken, userController.search);
}