const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  name: {
    type: String,
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

// Virtual to ensure either title or name is present
positionSchema.pre('validate', function(next) {
  if (!this.title && !this.name) {
    return next(new Error('Either title or name is required'));
  }
  // Always sync name to match title (title is the primary field)
  if (this.title) {
    this.name = this.title;
  } else if (this.name && !this.title) {
    this.title = this.name;
  }
  next();
});

// Index for faster queries
positionSchema.index({ category: 1, state: 1 });

module.exports = mongoose.model('Position', positionSchema);

