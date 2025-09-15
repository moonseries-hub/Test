const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Category Schema with subcategories
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  subCategories: [
    { name: { type: String, required: true, trim: true } }
  ],
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

// POST add category (admin only)
router.post("/", async (req, res) => {
  try {
    const { name, role } = req.body;
    if (role !== "admin") return res.status(403).json({ error: "Only admin can add categories" });

    const category = new Category({ name, subCategories: [] });
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add subcategory (admin only)
router.post("/:id/sub", async (req, res) => {
  try {
    const { role, subName } = req.body;
    if (role !== "admin") return res.status(403).json({ error: "Only admin can add subcategories" });
    if (!subName || !subName.trim()) return res.status(400).json({ error: "Subcategory name is required" });

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    // Prevent duplicates
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

// DELETE category (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const { role } = req.body;
    if (role !== "admin") return res.status(403).json({ error: "Only admin can delete categories" });

    const deleted = await Category.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
