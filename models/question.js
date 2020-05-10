const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer'}],
    voteCount:  { type: Number, default: 0 },
    tag: { type: String, required: true }, 
},
{ timestamps: true });


const UpvoteSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
  voters: [{ type: Schema.Types.ObjectId, ref: 'User'}],
},
{ timestamps: true });

// one question belongs to one upvote
// downvtes has many questions
const DownVoteSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
  voters: [{ type: Schema.Types.ObjectId, ref: 'User'}],
},
{ timestamps: true });


module.exports = mongoose.model('Downvote', DownVoteSchema);
module.exports = mongoose.model('Upvote', UpvoteSchema);
module.exports = mongoose.model('Question', QuestionSchema);
module.exports = mongoose.model('Answer', AnswerSchema);
