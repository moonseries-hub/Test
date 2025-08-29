const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  quantity: { type: Number, default: 0 },
  cost: Number,
  warranty: String,
  damaged: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
