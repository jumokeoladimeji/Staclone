/* eslint-disable max-lines-per-function */
/* eslint-disable no-ternary */
require('../models/user')
const mongoose = require('mongoose')
User = mongoose.model('User')
const auth = require('../middleware/auth');

module.exports = {
    /**
     * @description - Creates a new user
     * @param {object} request - request object containing the user's email, fullName, password
     received from the client
    * @param {object} response - response object served to the client
    * @returns {json} user - new user created
    */
    signup(req, res) {
        const userDetails = req.body;
        const userToCreate = {
            fullName: userDetails.fullName,
            email: userDetails.email,
            password: userDetails.password,
        };
        User
        create(userToCreate, (err, createdUser) => {
            if (err) {
                return res.status(500).json({ data: 'error signing up user:' + err })
            }
              else {
                return res.status(200).json({
                    message: "User successfully signed up",
                    data: createdUser, 
                    token: auth.generateToken(createdUser)
                })
            }
        })
    },
    /**
     * @description - signs in a new user
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} user - user details
     */
    signin(req, res) {
        // const userDetails = req.body;
        const { email, password } = req.body;
        // if (!userDetails.email) {
        //     return res.status(422).send({ message: 'You must enter an email address.' });
        // }
        // if (!userDetails.password) {
        //     return res.status(422).send({ message: 'You must enter a password.' });
        // }
        User.findOne({email}, (err, user) => {
            if (err) {
                return res.status(500).json({ data: 'error signing in:' + err })
            }
            const validPassword = auth.validPassword(password, user.hashedPassword)
            if(!validPassword) {
                return res.status(400).json({
                    data: "Incorrect Password !"
                });
            }
            if (user) {
                return res.status(200).json({
                    data: user,
                    token: auth.generateToken(user),
                });
            }
        });
    },
};