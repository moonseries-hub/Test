import mongoose from "mongoose";

const consumptionSchema = new mongoose.Schema({
  quantity: Number,
  usedAtLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  date: Date,
  remarks: String,
});

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    make: String,
    model: String,
    serialNumber: String,
    quantity: { type: Number, required: true }, // total quantity ever added
    instock: { type: Number }, // current stock
    dateOfReceipt: Date,
    cost: Number,
    po: String,
    productUpdatingDate: Date,
    mirvDate: Date,
    consumptionRecords: [consumptionSchema],
    sold: { type: Number, default: 0 }, // consumed/used
  },
  { timestamps: true }
);

// Initialize instock = quantity when new product is added
productSchema.pre("save", function (next) {
  if (this.isNew && (this.instock === undefined || this.instock === null)) {
    this.instock = this.quantity;
  }
  next();
});

export default mongoose.model("Product", productSchema);
