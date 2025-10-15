const mongoose = require('mongoose');

const electionSettingsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['National', 'State'],
    unique: true
  },
  state: {
    type: String,
    // Required only if category is 'State'
    required: function() {
      return this.category === 'State';
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'ended'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
electionSettingsSchema.index({ category: 1, state: 1 });

module.exports = mongoose.model('ElectionSettings', electionSettingsSchema);

