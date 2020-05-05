const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Vote Schema
 */
let VoteSchema = new Schema({
  voter: { type: Schema.Types.ObjectId, ref: 'User'},
  // created: {
	// 	type: Date,
	// 	default: Date.now
	// }
},
{ timestamps: true });


/**
 * Answer Schema
 */
let AnswerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  answer: { type: String, required: true },
},
{ timestamps: true });


/**
 * Question Schema
 */
let QuestionSchema = new Schema({
    query: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    answers: [AnswerSchema],
    votes: [VoteSchema],
    // fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
},
{ timestamps: true });

// Export the model
module.exports = mongoose.model('Question', QuestionSchema);