const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  maidenName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  votedCategories: {
    national: { type: Boolean, default: false },
    state: { type: Boolean, default: false }
  },
  lastLogin: {
    type: Date
  },
  activeSession: {
    token: { type: String },
    deviceInfo: { type: String },
    ipAddress: { type: String },
    loginTime: { type: Date },
    lastActivity: { type: Date }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Voter', voterSchema);

