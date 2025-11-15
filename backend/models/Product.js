import mongoose from "mongoose";

const consumptionSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  fromLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  toLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  date: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  make: { type: String },
  model: { type: String },
  instock: { type: Number, default: 0 }, // initial stock
  minstock: { type: Number, default: 0 },
  locations: [
    {
      location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
      quantity: { type: Number, default: 0 },
    },
  ],
  consumptionRecords: [consumptionSchema],
});

// Virtual for total consumed
productSchema.virtual("sold").get(function () {
  return this.consumptionRecords.reduce((sum, rec) => sum + (rec.quantity || 0), 0);
});

// Virtual for current stock
productSchema.virtual("currentStock").get(function () {
  return (this.instock || 0) - this.sold;
});

// Ensure virtuals show up in JSON
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default mongoose.model("Product", productSchema);
