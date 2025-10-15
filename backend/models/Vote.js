const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voter',
    required: true
  },
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  contestant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contestant',
    required: false // Can be null if voter chose not to vote for this position
  },
  category: {
    type: String,
    required: true,
    enum: ['National', 'State']
  },
  state: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Ensure a voter can only vote once per position
voteSchema.index({ voter: 1, position: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);

