const mongoose = require('mongoose');

const predictionPoolSchema = new mongoose.Schema({
  predictions: [{
    id: String,
    question: String,
    probability: Number,
    closeTime: Date,
    url: String,
    category: String,
    added: { type: Date, default: Date.now }
  }],
  year: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('PredictionPool', predictionPoolSchema);