const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    subCategories: [{ name: { type: String, required: true, trim: true } }],
  })
);

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: mongoose.Schema.Types.ObjectId },
    make: String,
    model: String,
    specifications: String,
    serialNumber: String,
    quantity: Number,
    dateOfReceipt: Date,
    cost: Number,
    po: String,
    mirvDate: Date,
  })
);

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add category
router.post("/", async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add subcategory
router.post("/:id/sub", async (req, res) => {
  try {
    const { subName } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const exists = category.subCategories.some(
      (sub) => sub.name.toLowerCase() === subName.trim().toLowerCase()
    );
    if (exists) return res.status(400).json({ error: "Subcategory already exists" });

    category.subCategories.push({ name: subName.trim() });
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE category & its products
router.delete("/:id", async (req, res) => {
  try {
    // Delete all products under this category
    await Product.deleteMany({ category: req.params.id });

    // Delete the category itself
    const deleted = await Category.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE subcategory & its products
router.delete("/:id/sub", async (req, res) => {
  try {
    const { subName } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const subToDelete = category.subCategories.find(
      (sub) => sub.name.toLowerCase() === subName.trim().toLowerCase()
    );
    if (!subToDelete) return res.status(404).json({ error: "Subcategory not found" });

    // Delete products under this subcategory
    await Product.deleteMany({ subCategory: subToDelete._id });

    // Remove subcategory from category
    category.subCategories = category.subCategories.filter(
      (sub) => sub.name.toLowerCase() !== subName.trim().toLowerCase()
    );

    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
