const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    tags: { type: [String], default: [] }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
