import express from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const router = express.Router();

/* ------------------------------- GET ALL ------------------------------- */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error("❌ Error fetching categories:", err);
    res.status(500).json({ message: "Server error fetching categories" });
  }
});

/* ------------------------------- ADD NEW ------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { name, makes, models, minStock } = req.body;

    if (!name || !makes?.length || !models?.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      name: name.trim(),
      makes,
      models,
      minStock: Number(minStock) || 0,
    });

    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error adding category:", err);
    res.status(500).json({ message: "Server error adding category" });
  }
});

/* ----------------------------- DELETE CATEGORY ----------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting category:", err);
    res.status(500).json({ message: "Server error deleting category" });
  }
});

/* ----------------------------- ADD MAKE ----------------------------- */
router.patch("/:id/add-make", async (req, res) => {
  try {
    const { make } = req.body;
    if (!make?.trim()) {
      return res.status(400).json({ message: "Make name is required" });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.makes.includes(make.trim())) {
      return res.status(400).json({ message: "Make already exists" });
    }

    category.makes.push(make.trim());
    const updated = await category.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ Error adding make:", err);
    res.status(500).json({ message: "Server error adding make" });
  }
});

/* ----------------------------- REMOVE MAKE ----------------------------- */
router.patch("/:id/remove-make", async (req, res) => {
  try {
    const { make } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.makes = category.makes.filter((m) => m !== make);
    const updated = await category.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ Error removing make:", err);
    res.status(500).json({ message: "Server error removing make" });
  }
});

/* ----------------------------- ADD MODEL ----------------------------- */
router.patch("/:id/add-model", async (req, res) => {
  try {
    const { model } = req.body;
    if (!model?.trim()) {
      return res.status(400).json({ message: "Model name is required" });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.models.includes(model.trim())) {
      return res.status(400).json({ message: "Model already exists" });
    }

    category.models.push(model.trim());
    const updated = await category.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ Error adding model:", err);
    res.status(500).json({ message: "Server error adding model" });
  }
});

/* ----------------------------- REMOVE MODEL ----------------------------- */
router.patch("/:id/remove-model", async (req, res) => {
  try {
    const { model } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.models = category.models.filter((m) => m !== model);
    const updated = await category.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ Error removing model:", err);
    res.status(500).json({ message: "Server error removing model" });
  }
});

/* ----------------------------- UPDATE MIN STOCK ----------------------------- */
router.patch("/:id/updateMinStock", async (req, res) => {
  try {
    const { minStock } = req.body;
    const categoryId = req.params.id;

    if (minStock < 0 || isNaN(minStock)) {
      return res.status(400).json({ message: "Invalid minStock value" });
    }

    // ✅ Update the category first
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { minStock },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // ✅ Ensure ALL products under this category get updated — even old ones
    const updateResult = await Product.updateMany(
      { "category._id": categoryId },
      { $set: { minstock: Number(minStock) } },
      { multi: true }
    );

    console.log(
      `✅ Updated ${updateResult.modifiedCount} products' minstock for category ${updatedCategory.name}`
    );

    res.json(updatedCategory);
  } catch (err) {
    console.error("❌ Error updating minStock:", err);
    res.status(500).json({ message: "Server error updating minStock" });
  }
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
