const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const secret = require('../config').secret;

require('../models/user')
const mongoose = require('mongoose')
User = mongoose.model('User')
const bcrypt = require('bcryptjs');

function getTokenFromHeader(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

module.exports = {
  hashPassword(password) {
    return bcrypt.hashSync(password, 12);
  },
  validPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  },
  required(req) {
    return expressJwt({
      secret: secret,
      requestProperty: 'payload',
      getToken: getTokenFromHeader(req)
    })
  },
  optional() { 
    return expressJwt({
      secret: secret,
      requestProperty: 'payload',
      credentialsRequired: false,
      getToken: getTokenFromHeader
    })
  },
  /**
  * @description - Generates token for user authentication
  * @param {object} user - object containing user details
  * @returns {object} token - jwt token
  */
  generateToken(user) {
    return jwt.sign({
      userId: user.id
    }, secret, { expiresIn: '1 day' });
  },
  /**
   * @description - Validates registered users' token
   * @param {object} request - request object received from the client
   * @param {object} response - response object served to the client
   * @param {function} next - express callback function which invokes the next
   * middleware or route-handler
   * @returns {object} message - error response
   */
  verifyToken(request, response, next) {
    const token = process.env.authorization || request.headers.authorization ||
    request.headers['x-access-token'];
    request.decoded = {};
    if (token) {
      jwt.verify(token, secret, (error, decoded) => {
        if (error) {
          return response.status(401).json({
            message: 'Session expired. Please login to continue',
          });
        }
        User.findById(decoded.userId).then((user) => {
          if (!user) { return response.sendStatus(401).send({message: 'Unauthorized'}); }
          request.user = user;
          next();
        });
      });
    } else {
      return response.status(401).json({
        message: 'Token required for access',
      });
    }
  },
};

// 403 Forbidden(authorization) vs 401 Unauthorized authentication