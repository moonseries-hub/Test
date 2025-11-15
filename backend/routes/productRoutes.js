  import express from "express";
  import mongoose from "mongoose";
  import Product from "../models/Product.js";
  import Category from "../models/Category.js";
  import Location from "../models/Location.js";

  const router = express.Router();

  // GET all products
  router.get("/", async (req, res) => {
    try {
      const products = await Product.find()
        .populate("category", "name minStock")
        .populate("locations.location", "name")
        .populate("consumptionRecords.fromLocation", "name")
        .populate("consumptionRecords.toLocation", "name")
        .populate("consumptionRecords.usedAtLocation", "name")
        .sort({ createdAt: -1 });

      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching products" });
    }
  });

/* -------------------- ADD PRODUCT -------------------- */
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
      minstock,
      dateOfReceipt,
      cost,
      po,
      productUpdatingDate,
      mirvDate,
    } = req.body;

      const cat = await Category.findById(categoryId);
      const loc = await Location.findById(location);

    if (!cat) return res.status(404).json({ error: "Category not found" });
    if (!loc) return res.status(404).json({ error: "Location not found" });

    const initialQty = Number(quantity) || 0;

    const product = await Product.create({
      productName,
      category,
      categoryName: cat.name,
      location,
      locationName: loc.name,
      make,
      model,
      serialNumber,
      quantity: initialQty,
      instock: initialQty,
      sold: 0,
      minstock: Number(minstock) || 0,
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

/* -------------------- UPDATE PRODUCT -------------------- */
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

      res.json(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating product" });
    }
  });

/* -------------------- DELETE PRODUCT -------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Error deleting product" });
  }
});

/* -------------------- CONSUME PRODUCT -------------------- */
router.patch("/:id/consume", async (req, res) => {
  try {
    const { quantity, fromLocationId, toLocationId, remarks } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (quantity > product.instock) {
      return res
        .status(400)
        .json({ error: `Quantity exceeds available stock (${product.instock})` });
    }

    product.instock -= Number(quantity);

    product.consumptionRecords.push({
      quantity,
      fromLocation: fromLocationId,
      toLocation: toLocationId,
      remarks,
      date: new Date(),
    });

    await product.save();

    res.json({ message: "Product consumed successfully", product });
  } catch (err) {
    console.error("Error consuming product:", err);
    res.status(500).json({ error: "Error consuming product" });
  }
});

export default router;
