
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  isAdmin: {
    type: Boolean,
    default: false
  },

  problemsSolved: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
