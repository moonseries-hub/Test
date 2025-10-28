import express from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const router = express.Router();

/* -------------------- GET ALL CATEGORIES -------------------- */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Server error while fetching categories" });
  }
});

/* -------------------- CREATE CATEGORY -------------------- */
router.post("/", async (req, res) => {
  try {
    const { name, makes = [], models = [], minStock = 0 } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = new Category({
      name: name.trim(),
      makes,
      models,
      minStock,
    });

    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Server error while creating category" });
  }
});

/* -------------------- UPDATE MIN STOCK -------------------- */
router.patch("/:id/updateMinStock", async (req, res) => {
  try {
    const { minStock } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { minStock },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    console.error("Error updating min stock:", err);
    res.status(500).json({ error: "Server error while updating min stock" });
  }
});

/* -------------------- ADD/REMOVE MAKES -------------------- */
router.patch("/:id/add-make", async (req, res) => {
  try {
    const { make } = req.body;
    if (!make || !make.trim()) return res.status(400).json({ error: "Make name is required" });

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const trimmedMake = make.trim();
    if (!category.makes.includes(trimmedMake)) {
      category.makes.push(trimmedMake);
      await category.save();
    }

    res.json({ message: "Make added successfully", makes: category.makes });
  } catch (err) {
    console.error("Error adding make:", err);
    res.status(500).json({ error: "Server error while adding make" });
  }
});

router.patch("/:id/remove-make", async (req, res) => {
  try {
    const { make } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    category.makes = category.makes.filter((m) => m !== make);
    await category.save();

    res.json({ message: "Make removed successfully", makes: category.makes });
  } catch (err) {
    console.error("Error removing make:", err);
    res.status(500).json({ error: "Server error while removing make" });
  }
});

/* -------------------- ADD/REMOVE MODELS -------------------- */
router.patch("/:id/add-model", async (req, res) => {
  try {
    const { model } = req.body;
    if (!model || !model.trim()) return res.status(400).json({ error: "Model name is required" });

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const trimmedModel = model.trim();
    if (!category.models.includes(trimmedModel)) {
      category.models.push(trimmedModel);
      await category.save();
    }

    res.json({ message: "Model added successfully", models: category.models });
  } catch (err) {
    console.error("Error adding model:", err);
    res.status(500).json({ error: "Server error while adding model" });
  }
});

router.patch("/:id/remove-model", async (req, res) => {
  try {
    const { model } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    category.models = category.models.filter((m) => m !== model);
    await category.save();

    res.json({ message: "Model removed successfully", models: category.models });
  } catch (err) {
    console.error("Error removing model:", err);
    res.status(500).json({ error: "Server error while removing model" });
  }
});

/* -------------------- DELETE CATEGORY + PRODUCTS -------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const deletedProducts = await Product.deleteMany({ category: id });
    await Category.findByIdAndDelete(id);

    res.json({
      message: "Category and its products deleted successfully",
      deletedProducts: deletedProducts.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting category and products:", err);
    res.status(500).json({ error: "Server error while deleting category" });
  }
});

export default router;
