const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  basePrice: { type: Number, required: true },
  photo: { type: String, default: null },
  status: { 
    type: String, 
    enum: ['Not Started', 'Active', 'Sold', 'Unsold'],
    default: 'Not Started'
  },
  soldTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', default: null },
  soldPrice: { type: Number, default: null }
});

module.exports = mongoose.model('Player', playerSchema);
