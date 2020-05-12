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
  
AnswerSchema.index({'answer': 'text'});

/**
 * Question Schema
 */
let QuestionSchema = new Schema({
    query: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    answers: [AnswerSchema],
    voteCount:  { type: Number, default: 0 },
    tag: { type: String, required: true }, 
},
{ timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
module.exports = mongoose.model('Answer', AnswerSchema);