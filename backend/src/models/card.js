const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  email: { type: String, required: true },
  card: [{
    id: String,
    question: String,
    embedUrl: String,
    category: String
  }],
  completed: [Boolean],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Card', cardSchema);