const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalBudget: { type: Number, required: true },
  remainingBudget: { type: Number, required: true },
  photo: { type: String, default: null },
});

module.exports = mongoose.model('Owner', ownerSchema);
