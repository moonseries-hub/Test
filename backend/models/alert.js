const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  type: { type: String, enum: ['low-stock', 'damaged'], required: true },
  message: String,
  date: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
});

module.exports = mongoose.model('Alert', AlertSchema);
