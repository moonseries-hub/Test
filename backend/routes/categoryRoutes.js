import express from "express";
import Category from "../models/Category.js";
import mongoose from "mongoose";

const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new category
router.post("/", async (req, res) => {
  try {
    const { name, makes, models, minStock } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ error: "Category name is required" });

    const newCategory = new Category({
      name: name.trim(),
      makes,
      models,
      minStock: minStock || 0,
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ error: "Category already exists" });
    res.status(500).json({ error: err.message });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: "Invalid category ID" });

  try {
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted successfully", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add make/model
router.patch("/:id/addMake", async (req, res) => {
  const { make } = req.body;
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  if (!cat.makes.includes(make)) cat.makes.push(make);
  await cat.save();
  res.json(cat);
});

router.patch("/:id/addModel", async (req, res) => {
  const { model } = req.body;
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  if (!cat.models.includes(model)) cat.models.push(model);
  await cat.save();
  res.json(cat);
});

// Remove make/model
router.patch("/:id/removeMake", async (req, res) => {
  const { make } = req.body;
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  cat.makes = cat.makes.filter((m) => m !== make);
  await cat.save();
  res.json(cat);
});

router.patch("/:id/removeModel", async (req, res) => {
  const { model } = req.body;
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  cat.models = cat.models.filter((m) => m !== model);
  await cat.save();
  res.json(cat);
});

// ✅ Update minStock for category
router.patch("/:id/minStock", async (req, res) => {
  const { minStock } = req.body;
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: "Category not found" });
    cat.minStock = minStock;
    await cat.save();
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
