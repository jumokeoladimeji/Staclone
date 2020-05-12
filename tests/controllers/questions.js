const chai = require('chai');
const { expect } = chai;
const index = require('../../index');
const db = require('../../database/models/index')

chai.use(require('chai-http'));
const faker = require('faker');