const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  specifications: { type: String },
  serialNumber: { type: String },
  quantity: { type: Number, required: true },
  dateOfReceipt: { type: Date, required: true },
  cost: { type: Number, required: true },
  po: { type: String },
  mirvDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
