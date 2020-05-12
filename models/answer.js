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

  module.exports = mongoose.model('Answer', AnswerSchema);