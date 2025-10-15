// models/category.js
import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subCategories: [SubCategorySchema], // embedded subcategories
});

export default mongoose.model("Category", CategorySchema);
