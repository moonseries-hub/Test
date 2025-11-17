import mongoose from "mongoose";

const consumptionSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  fromLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  toLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  usedAtLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  consumedByName: { type: String, required: true },
  remarks: { type: String, default: "" },
  date: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  productName: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  make: String,
  model: String,
  instock: { type: Number, default: 0 },
  openingStock: { type: Number, default: 0 },
  minstock: { type: Number, default: 0 },
  locations: [
    {
      location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
      quantity: Number,
    },
  ],
  consumptionRecords: [consumptionSchema],
});

// === Virtuals ===
productSchema.virtual("consumed").get(function () {
  return this.consumptionRecords.reduce((sum, rec) => sum + (rec.quantity || 0), 0);
});

productSchema.virtual("newStock").get(function () {
  return (this.instock || 0) - (this.openingStock || 0);
});

productSchema.virtual("availableStock").get(function () {
  return (this.openingStock || 0) + this.newStock - this.consumed;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default mongoose.model("Product", productSchema);
