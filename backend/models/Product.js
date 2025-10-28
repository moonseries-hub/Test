import mongoose from "mongoose";

const consumptionRecordSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  usedAtLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  date: { type: Date, default: Date.now },
  remarks: { type: String, default: "" },
});

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },

    // Store both references and readable names
    category: { type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,},
    categoryName: { type: String },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    locationName: { type: String },

    make: String,
    model: String,
    serialNumber: String,

    quantity: { type: Number, default: 0, min: [0, "Quantity cannot be negative"] },
    instock: { type: Number, default: 0, min: [0, "Stock cannot be negative"] },
    sold: { type: Number, default: 0, min: [0, "Sold cannot be negative"] },
    minstock: { type: Number, default: 0, min: [0, "Min stock cannot be negative"] },

    dateOfReceipt: Date,
    cost: Number,
    po: String,
    productUpdatingDate: Date,
    mirvDate: Date,
    consumptionRecords: [consumptionRecordSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
