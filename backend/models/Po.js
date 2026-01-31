import mongoose from "mongoose";

const poSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: String, required: true },
  make: String,
  model: String,
  expectedDate: Date,
  quantity: Number,
  cost: Number,
  poNumber: String,
  productUpdatingDate: {
    type: Date,
    default: () => new Date()
  },
  isConsumed: { type: Boolean, default: false },
});

const PO = mongoose.model("PO", poSchema);

export default PO;
