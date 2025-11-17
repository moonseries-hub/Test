import express from "express";
import Category from "../models/category.js";
import Product from "../models/Product.js";

const router = express.Router();

/* -------------------- GET ALL CATEGORIES -------------------- */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

/* -------------------- ADD CATEGORY -------------------- */
router.post("/", async (req, res) => {
  try {
    const { name, makes, models, minStock } = req.body;
    const category = await Category.create({ name, makes, models, minStock });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding category" });
  }
});

/* -------------------- DELETE CATEGORY -------------------- */
/* -------------------- DELETE CATEGORY -------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Delete the category
    await Category.findByIdAndDelete(categoryId);

    // Delete products currently under this category
    await Product.deleteMany({ category: categoryId });

    res.json({ message: "Category and associated products deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting category" });
  }
});


/* -------------------- UPDATE MIN STOCK -------------------- */
router.patch("/:id/updateMinStock", async (req, res) => {
  try {
    const { minStock } = req.body;
    if (minStock === undefined || minStock < 0) {
      return res.status(400).json({ error: "Invalid minStock value" });
    }

    // Update category
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { minStock },
      { new: true }
    );

    if (!category) return res.status(404).json({ error: "Category not found" });

    // Update all products under this category
    await Product.updateMany(
      { category: category._id },
      { minstock: minStock }
    );

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update min stock" });
  }
});

/* -------------------- ADD MAKE -------------------- */
router.patch("/:id/add-make", async (req, res) => {
  try {
    const { make } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category.makes.includes(make)) category.makes.push(make);
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding make" });
  }
});

/* -------------------- REMOVE MAKE -------------------- */
router.patch("/:id/remove-make", async (req, res) => {
  try {
    const { make } = req.body;
    const category = await Category.findById(req.params.id);
    category.makes = category.makes.filter(m => m !== make);
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error removing make" });
  }
});

/* -------------------- ADD MODEL -------------------- */
router.patch("/:id/add-model", async (req, res) => {
  try {
    const { model } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category.models.includes(model)) category.models.push(model);
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding model" });
  }
});

/* -------------------- REMOVE MODEL -------------------- */
router.patch("/:id/remove-model", async (req, res) => {
  try {
    const { model } = req.body;
    const category = await Category.findById(req.params.id);
    category.models = category.models.filter(m => m !== model);
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error removing model" });
  }
});

export default router;
