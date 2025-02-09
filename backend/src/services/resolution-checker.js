// Backend: src/services/resolution-checker.js
const Card = require('../models/card');
const Leaderboard = require('../models/leaderboard');
const manifoldService = require('./manifold');

class ResolutionChecker {
  async checkAllCards() {
    try {
      const cards = await Card.find({});
      console.log(`Checking ${cards.length} cards for resolved predictions...`);

      for (const card of cards) {
        await this.checkCard(card);
      }
    } catch (error) {
      console.error('Error in checkAllCards:', error);
    }
  }

  async checkCard(card) {
    let updated = false;
    let newlyResolved = 0;

    for (let i = 0; i < card.card.length; i++) {
      const prediction = card.card[i];
      if (!prediction || !prediction.id || card.completed[i]) continue;

      const { resolved, outcome } = await manifoldService.checkResolution(prediction.id);
      
      if (resolved && outcome === 'YES') {
        card.completed[i] = true;
        newlyResolved++;
        updated = true;
      }
    }

    if (updated) {
      card.lastChecked = new Date();
      await card.save();
      await this.updateLeaderboard(card.email, newlyResolved);
    }
  }

  async updateLeaderboard(email, newlyResolved) {
    const card = await Card.findOne({ email });
    const wins = this.checkWinConditions(card.completed);
    
    // Calculate score: 10 points per completed prediction, 50 points per win
    const score = (card.completed.filter(Boolean).length * 10) + (wins.length * 50);

    await Leaderboard.findOneAndUpdate(
      { email },
      {
        score,
        completedPredictions: card.completed.filter(Boolean).length,
        wins,
        lastUpdated: new Date()
      },
      { upsert: true }
    );
  }

  checkWinConditions(completed) {
    const wins = [];
    const size = 5;

    // Check rows
    for (let i = 0; i < size; i++) {
      if (completed.slice(i * size, (i + 1) * size).every(cell => cell)) {
        wins.push(`Row ${i + 1}`);
      }
    }

    // Check columns
    for (let i = 0; i < size; i++) {
      if (completed.filter((_, index) => index % size === i).every(cell => cell)) {
        wins.push(`Column ${i + 1}`);
      }
    }

    // Check diagonals
    if (completed.filter((_, index) => index % (size + 1) === 0).every(cell => cell)) {
      wins.push('Diagonal (top-left to bottom-right)');
    }
    if (completed.filter((_, index) => index > 0 && index < size * size - 1 && index % (size - 1) === 0).every(cell => cell)) {
      wins.push('Diagonal (top-right to bottom-left)');
    }

    return wins;
  }
}

module.exports = new ResolutionChecker(); 
