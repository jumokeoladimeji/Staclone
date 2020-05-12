const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Upvote Schema
*/

let UpvoteSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
  voters: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  },
  { timestamps: true 
});

module.exports = mongoose.model('Upvote', UpvoteSchema);
