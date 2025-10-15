import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  specifications: { type: String },
  serialNumber: { type: String },
  quantity: { type: Number, required: true },
  dateOfReceipt: { type: Date, required: true },
  cost: { type: Number, required: true },
  po: { type: String },
  mirvDate: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
