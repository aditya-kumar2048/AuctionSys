require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auction';
mongoose.connect(mongoURI).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const Owner = require('./models/Owner');
const Player = require('./models/Player');
const Bid = require('./models/Bid');

// -----------------------------------------
// Owner Routes
// -----------------------------------------
app.get('/api/owners', async (req, res) => {
  const owners = await Owner.find();
  res.json(owners);
});

app.post('/api/owners', async (req, res) => {
  const { name, totalBudget, photo } = req.body;
  const owner = new Owner({ name, totalBudget, remainingBudget: totalBudget, photo });
  await owner.save();
  res.json(owner);
});

app.delete('/api/owners/:id', async (req, res) => {
  const owner = await Owner.findByIdAndDelete(req.params.id);
  if (!owner) return res.status(404).json({ error: 'Owner not found' });
  res.json(owner);
})



// -----------------------------------------
// Player Routes
// -----------------------------------------
app.get('/api/players', async (req, res) => {
  const players = await Player.find();
  res.json(players);
});

app.post('/api/players', async (req, res) => {
  const { name, basePrice, photo } = req.body;
  const player = new Player({ name, basePrice, photo, status: 'Not Started' });
  await player.save();
  res.json(player);
});
app.delete('/api/players/:id', async (req, res) => {
  const player = await Player.findByIdAndDelete(req.params.id);
  if (!player) return res.status(404).json({ error: 'player not found' });
  res.json(player);
})

// -----------------------------------------
// Auction Routes
// -----------------------------------------

// Start auction for a player
app.post('/api/auction/start/:id', async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: 'Player not found' });

  player.status = 'Active';
  await player.save();
  res.json(player);
});

// Place a bid
app.post('/api/auction/bid', async (req, res) => {
  const { playerId, ownerId, amount } = req.body;

  try {
    const player = await Player.findById(playerId);
    if (!player || player.status !== 'Active') {
      return res.status(400).json({ error: 'Player is not active for bidding' });
    }

    const owner = await Owner.findById(ownerId);
    if (!owner) return res.status(404).json({ error: 'Owner not found' });

    if (amount > owner.remainingBudget) {
      return res.status(400).json({ error: 'Bid amount exceeds remaining budget' });
    }

    const highestBid = await Bid.findOne({ player: playerId }).sort({ amount: -1 });
    if (highestBid && amount <= highestBid.amount) {
      return res.status(400).json({ error: 'Bid must be higher than the current highest bid' });
    }

    const newBid = new Bid({ player: playerId, owner: ownerId, amount });
    await newBid.save();

    res.json(newBid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Finalize auction
app.post('/api/auction/finalize/:id', async (req, res) => {
  const { status } = req.body; // 'Sold' or 'Unsold'
  const playerId = req.params.id;

  try {
    const player = await Player.findById(playerId);
    if (!player || player.status !== 'Active') {
      return res.status(400).json({ error: 'Player is not active' });
    }

    if (status === 'Unsold') {
      player.status = 'Unsold';
      await player.save();
      return res.json({ player });
    }

    if (status === 'Sold') {
      // Find highest bid
      const highestBid = await Bid.findOne({ player: playerId }).sort({ amount: -1 }).populate('owner');

      if (!highestBid) {
        return res.status(400).json({ error: 'Cannot sell a player with no bids. Mark as Unsold.' });
      }

      const owner = await Owner.findById(highestBid.owner._id);

      // Deduct budget
      owner.remainingBudget -= highestBid.amount;
      await owner.save();

      player.status = 'Sold';
      player.soldTo = owner._id;
      player.soldPrice = highestBid.amount;
      await player.save();

      return res.json({ player, owner });
    }

    return res.status(400).json({ error: 'Invalid status' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bids for grid view (latest per owner per player)
app.get('/api/auction/grid', async (req, res) => {
  try {
    const latestBids = await Bid.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: { player: "$player", owner: "$owner" },
          amount: { $first: "$amount" },
          timestamp: { $first: "$timestamp" }
        }
      },
      {
        $project: {
          _id: 0,
          playerId: "$_id.player",
          ownerId: "$_id.owner",
          amount: 1,
          timestamp: 1
        }
      }
    ]);
    res.json(latestBids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bid history for a specific player
app.get('/api/auction/history/:playerId', async (req, res) => {
  try {
    const bids = await Bid.find({ player: req.params.playerId })
      .sort({ timestamp: -1 })
      .populate('owner', 'name');
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
