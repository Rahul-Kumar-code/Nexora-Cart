const Product = require("../models/Product");
const seedProducts = require("./seedData");
const { isDatabaseEnabled } = require("./connection");

class ProductStore {
  constructor() {
    this.cache = [...seedProducts];
  }

  async init() {
    if (!isDatabaseEnabled()) {
      return;
    }

    const count = await Product.countDocuments();
    if (count === 0) {
      const withoutId = seedProducts.map(({ id, ...doc }) => doc);
      await Product.insertMany(withoutId);
    }
  }

  async findAll() {
    if (!isDatabaseEnabled()) {
      return this.cache;
    }

    const docs = await Product.find({}).lean();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      price: doc.price,
      image: doc.image,
      rating: doc.rating,
      tags: doc.tags || []
    }));
  }

  async findById(productId) {
    if (!isDatabaseEnabled()) {
      return this.cache.find((item) => item.id === productId) || null;
    }

    const doc = await Product.findById(productId).lean();
    if (!doc) {
      return null;
    }

    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      price: doc.price,
      image: doc.image,
      rating: doc.rating,
      tags: doc.tags || []
    };
  }
}

module.exports = new ProductStore();
