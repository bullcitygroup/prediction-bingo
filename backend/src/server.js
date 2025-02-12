const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const manifoldService = require('./services/manifold');
const gameService = require('./services/game-service');
const Card = require('./models/card');
const Leaderboard = require('./models/leaderboard');

const app = express();
app.use(cors());
app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: ['https://bullcitygroup.github.io', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.get('/api/predictions', async (req, res) => {
  try {
    const predictions = await manifoldService.getMarkets();
    console.log('Sending predictions:', predictions); // Adding a log to help debug
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save card
app.post('/api/cards', async (req, res) => {
  try {
    const { email, card, completed } = req.body;
    
    // Save the card
    await Card.findOneAndUpdate(
      { email },
      { 
        email, 
        card, 
        completed,
        lastUpdated: new Date()
      },
      { upsert: true }
    );

    // Calculate wins and update leaderboard
    const wins = gameService.checkWinConditions(completed);
    const completedCount = completed.filter(Boolean).length;
    const score = gameService.calculateScore(wins, completedCount);

    await Leaderboard.findOneAndUpdate(
      { email },
      {
        email,
        score,
        completedPredictions: completedCount,
        wins,
        lastUpdated: new Date(),
        cardCreated: new Date()
      },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Load card
app.get('/api/cards/:email', async (req, res) => {
  try {
    const card = await Card.findOne({ email: req.params.email });
    res.json(card || { 
      card: Array(25).fill(null), 
      completed: Array(25).fill(false) 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check wins
app.get('/api/check-wins/:email', async (req, res) => {
  try {
    const card = await Card.findOne({ email: req.params.email });
    if (!card) {
      return res.json({ wins: [] });
    }

    const wins = gameService.checkWinConditions(card.completed);
    res.json({ wins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .sort({ score: -1 })
      .limit(100);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's rank
app.get('/api/leaderboard/:email', async (req, res) => {
  try {
    const userScore = await Leaderboard.findOne({ email: req.params.email });
    if (!userScore) {
      return res.json({ rank: null, score: 0 });
    }

    const rank = await Leaderboard.countDocuments({ 
      score: { $gt: userScore.score } 
    }) + 1;

    res.json({ 
      rank,
      ...userScore.toObject()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Setup automatic market resolution checking
setInterval(async () => {
  try {
    const cards = await Card.find({});
    for (const card of cards) {
      let updated = false;
      for (let i = 0; i < card.card.length; i++) {
        const prediction = card.card[i];
        if (!prediction || !prediction.id || card.completed[i]) continue;

        const { resolved, outcome } = await manifoldService.checkResolution(prediction.id);
        if (resolved && outcome === 'YES') {
          card.completed[i] = true;
          updated = true;
        }
      }
      if (updated) {
        await card.save();
      }
    }
  } catch (error) {
    console.error('Error in automatic resolution checking:', error);
  }
}, 60 * 60 * 1000); // Check every hour



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});