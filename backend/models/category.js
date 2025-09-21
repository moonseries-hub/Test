const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subCategories: [{ name: String }],
});

// Check if model already exists to avoid OverwriteModelError
module.exports = mongoose.models.Category || mongoose.model("Category", categorySchema);
