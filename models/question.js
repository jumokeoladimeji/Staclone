const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Question Schema
 */
let QuestionSchema = new Schema({
    query: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    voteCount:  { type: Number, default: 0 },
    tag: { type: String, required: true }, 
},
{ timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
