/* eslint-disable no-undef */
const chai = require('chai');
const { assert } = chai;
const bcrypt = require('bcryptjs');
chai.use(require('chai-http'));
const index = require('../../app');
const auth = require('../../middleware/auth');

describe('Authentication', () => {
    describe('Hash Password', () => {
        it('should hash the new user\'s password', () => {
            const hashedPassword = auth.hashPassword('weeeer34234$$')
            assert.equal(true, bcrypt.compareSync('weeeer34234$$', hashedPassword));
        });
    });
});