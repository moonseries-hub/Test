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

  // ADD product
  router.post("/", async (req, res) => {
    try {
      const { productName, category: categoryId, location, make, model, quantity, dateOfReceipt, cost, po } = req.body;

      const cat = await Category.findById(categoryId);
      const loc = await Location.findById(location);

      if (!cat) return res.status(404).json({ error: "Category not found" });
      if (!loc) return res.status(404).json({ error: "Location not found" });

      const product = await Product.create({
        productName,
        category: categoryId,
        make,
        model,
        instock: quantity,
        sold: 0,
        minstock: cat.minStock,
        locations: [{ location: loc._id, quantity }],
        consumptionRecords: [],
        dateOfReceipt,
        cost,
        po,
      });

      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error adding product" });
    }
  });

  // UPDATE product
  router.put("/:id", async (req, res) => {
    try {
      const updateData = req.body;

      if (updateData.category) {
        const cat = await Category.findById(updateData.category);
        if (cat) updateData.minstock = cat.minStock;
      }

      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

      res.json(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating product" });
    }
  });

  // DELETE product
  router.delete("/:id", async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting product" });
    }
  });router.patch("/:id/consume", async (req, res) => {
    try {
      const { quantity, fromLocationId, toLocationId, remarks } = req.body;
      const qty = Number(quantity);

      if (!qty || qty <= 0)
        return res.status(400).json({ error: "Quantity must be > 0" });

      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });

      // Check if enough stock
      const currentStock = (product.instock || 0) - product.consumptionRecords.reduce((sum, rec) => sum + (rec.quantity || 0), 0);
      if (qty > currentStock)
        return res.status(400).json({ error: `Quantity exceeds available stock (${currentStock})` });

      product.consumptionRecords.push({
        quantity: qty,
        fromLocation: fromLocationId && mongoose.Types.ObjectId.isValid(fromLocationId) ? fromLocationId : null,
        toLocation: toLocationId && mongoose.Types.ObjectId.isValid(toLocationId) ? toLocationId : null,
        usedAtLocation: fromLocationId && mongoose.Types.ObjectId.isValid(fromLocationId) ? fromLocationId : null,
        remarks: remarks || "",
        date: new Date(),
      });

      await product.save();

      const updatedProduct = await Product.findById(product._id)
        .populate("category", "name")
        .populate("consumptionRecords.fromLocation", "name")
        .populate("consumptionRecords.toLocation", "name")
        .populate("consumptionRecords.usedAtLocation", "name")

      res.json(updatedProduct);

    } catch (err) {
      console.error("Consume Product Error:", err);
      res.status(500).json({ error: "Error consuming product", details: err.message });
    }
  });
  export default router;