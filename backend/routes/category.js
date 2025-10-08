const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  subCategories: [{ name: { type: String, required: true, trim: true } }],
});

const Category = mongoose.model("Category", categorySchema);

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
    const { name, role, subCategories } = req.body;
    if (role !== "admin")
      return res.status(403).json({ error: "Only admin can add categories" });

    const category = new Category({
      name,
      subCategories: subCategories || [],
    });
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add subcategory
router.post("/:id/sub", async (req, res) => {
  try {
    const { role, subName } = req.body;
    if (role !== "admin")
      return res.status(403).json({ error: "Only admin can add subcategories" });

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

// DELETE category
router.delete("/:id", async (req, res) => {
  try {
    const { role } = req.body;
    if (role !== "admin")
      return res.status(403).json({ error: "Only admin can delete categories" });

    const deleted = await Category.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE subcategory
router.delete("/:id/sub", async (req, res) => {
  try {
    const { role, subName } = req.body;
    if (role !== "admin")
      return res.status(403).json({ error: "Only admin can delete subcategories" });

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

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
