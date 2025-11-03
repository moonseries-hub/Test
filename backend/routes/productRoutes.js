import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ✅ GET all products (with nested populate)
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
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// ✅ POST add new product
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
      minStock, // ✅ include minStock
      dateOfReceipt,
      cost,
      po,
      productUpdatingDate,
      mirvDate,
    } = req.body;

    const initialQty = Math.max(0, Number(quantity) || 0); // prevent negative

    const product = await Product.create({
      productName,
      category,
      location,
      make,
      model,
      serialNumber,
      quantity: initialQty,
      instock: initialQty,
      sold: 0,
      minStock: Math.max(0, Number(minStock) || 0), // ✅ ensure non-negative
      dateOfReceipt,
      cost,
      po,
      productUpdatingDate,
      mirvDate,
      consumptionRecords: [],
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ error: "Error adding product" });
  }
});

// ✅ PATCH consume product (prevent going below zero)
router.patch("/:id/consume", async (req, res) => {
  const { quantity, usedAtLocationId, date, remarks } = req.body;

  const consumeQty = Math.max(0, Number(quantity) || 0);
  if (!consumeQty)
    return res.status(400).json({ error: "Invalid consumption quantity" });

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (consumeQty > product.instock)
      return res.status(400).json({
        error: `Not enough stock. Available: ${product.instock}`,
      });

    product.instock -= consumeQty;
    product.sold = (product.sold || 0) + consumeQty;

    product.consumptionRecords.push({
      quantity: consumeQty,
      usedAtLocation: usedAtLocationId || null,
      date: date || new Date(),
      remarks: remarks || "",
    });

    await product.save();
    res.json({ message: "Product consumed successfully", product });
  } catch (err) {
    console.error("❌ Error consuming product:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ PATCH update product (including minStock)
router.patch("/:id", async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.quantity !== undefined)
      updates.quantity = Math.max(0, Number(updates.quantity) || 0);

    if (updates.instock !== undefined)
      updates.instock = Math.max(0, Number(updates.instock) || 0);

    if (updates.minStock !== undefined)
      updates.minStock = Math.max(0, Number(updates.minStock) || 0);

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
      .populate("category", "name")
      .populate("location", "name");

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully", product: updated });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
