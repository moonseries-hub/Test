import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products with nested populate
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("location", "name")
      .populate({
        path: "consumptionRecords.usedAtLocation",
        model: "Location",
        select: "name",
      })
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// POST add new product
router.post("/", async (req, res) => {
  try {
    const {
      productName,
      category,
      location,
      make,
      model,
      serialNumber,
      quantity,
      dateOfReceipt,
      cost,
      po,
      productUpdatingDate,
      mirvDate,
    } = req.body;

    const product = await Product.create({
      productName,
      category,
      location,
      make,
      model,
      serialNumber,
      quantity,
      instock: quantity,
      sold: 0,
      dateOfReceipt,
      cost,
      po,
      productUpdatingDate,
      mirvDate,
      consumptionRecords: [],
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding product" });
  }
});

// PATCH consume product
router.patch("/:id/consume", async (req, res) => {
  const { quantity, usedAtLocationId, date, remarks } = req.body;

  if (!quantity || quantity <= 0)
    return res.status(400).json({ error: "Invalid quantity" });

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (quantity > product.instock)
      return res.status(400).json({
        error: `Not enough stock. Available: ${product.instock}`,
      });

    product.instock -= quantity;
    product.sold = (product.sold || 0) + quantity;

    product.consumptionRecords.push({
      quantity,
      usedAtLocation: usedAtLocationId || null,
      date: date || new Date(),
      remarks: remarks || "",
    });

    await product.save();
    res.json({ message: "Product consumed successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
