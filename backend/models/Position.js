const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['National', 'State']
  },
  state: {
    type: String,
    // Required only if category is 'State'
    required: function() {
      return this.category === 'State';
    }
  },
  order: {
    type: Number,
    default: 0
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
positionSchema.index({ category: 1, state: 1 });

module.exports = mongoose.model('Position', positionSchema);

