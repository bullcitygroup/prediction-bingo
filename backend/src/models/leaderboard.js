const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  email: { type: String, required: true },
  score: { type: Number, default: 0 },
  completedPredictions: { type: Number, default: 0 },
  wins: [String],
  lastUpdated: { type: Date, default: Date.now },
  cardCreated: { type: Date, default: Date.now }
});

leaderboardSchema.index({ score: -1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);