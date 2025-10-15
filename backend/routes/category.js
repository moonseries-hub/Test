// routes/categories.js
import express from "express";
import Category from "../models/category.js";

const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new category
router.post("/", async (req, res) => {
  try {
    const { name, subCategories } = req.body;
    const newCategory = new Category({ name, subCategories });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add subcategory to existing category
router.post("/:id/sub", async (req, res) => {
  try {
    const { subName } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.subCategories.push({ name: subName });
    const saved = await category.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete subcategory
router.delete("/:id/sub", async (req, res) => {
  try {
    const { subName } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.subCategories = category.subCategories.filter((sub) => sub.name !== subName);
    const saved = await category.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
