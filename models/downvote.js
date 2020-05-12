const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Downvote Schema
 */

let DownVoteSchema = new Schema({
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    voters: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  },
  { timestamps: true 
});
  
module.exports = mongoose.model('Downvote', DownVoteSchema);
  