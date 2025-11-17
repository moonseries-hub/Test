import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/category.js";
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
    res.status(500).json({ error: err.message });
  }
});

// ADD/UPDATE product
router.post("/", async (req, res) => {
  try {
    const { productName, category: categoryId, location, make, model, quantity } = req.body;

    const cat = await Category.findById(categoryId);
    const loc = await Location.findById(location);
    if (!cat) return res.status(404).json({ error: "Category not found" });
    if (!loc) return res.status(404).json({ error: "Location not found" });

    const existingProduct = await Product.findOne({ productName, make, model, category: categoryId });

    if (existingProduct) {
      existingProduct.instock += Number(quantity);
      const locIndex = existingProduct.locations.findIndex(l => l.location.toString() === location);
      if (locIndex >= 0) {
        existingProduct.locations[locIndex].quantity += Number(quantity);
      } else {
        existingProduct.locations.push({ location: loc, quantity: Number(quantity) });
      }
      await existingProduct.save();
      return res.json(existingProduct);
    }

    const product = await Product.create({
      productName,
      category: categoryId,
      make,
      model,
      instock: quantity,
      openingStock: quantity,
      minstock: cat.minStock,
      locations: [{ location: loc._id, quantity }],
      consumptionRecords: [],
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CONSUME product
router.patch("/:id/consume", async (req, res) => {
  try {
    const { quantity, fromLocationId, toLocationId, remarks, consumedByName } = req.body;
    const qty = Number(quantity);

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const currentStock = product.availableStock;
    if (qty > currentStock) return res.status(400).json({ error: `Exceeds available stock (${currentStock})` });

    product.consumptionRecords.push({
      quantity: qty,
      fromLocation: fromLocationId || null,
      toLocation: toLocationId || null,
      usedAtLocation: fromLocationId || null,
      consumedByName,
      remarks,
      date: new Date(),
    });

    await product.save();
    const updatedProduct = await Product.findById(product._id)
      .populate("category", "name minStock")
      .populate("consumptionRecords.fromLocation", "name")
      .populate("consumptionRecords.toLocation", "name")
      .populate("consumptionRecords.usedAtLocation", "name");

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
