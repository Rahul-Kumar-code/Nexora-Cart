require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const seedProducts = require("../db/seedData");
const { connectToDatabase } = require("../db/connection");

async function seed() {
  const connected = await connectToDatabase(process.env.MONGO_URI, { requireDatabase: true });
  if (!connected) {
    console.error("Unable to connect to MongoDB. Aborting seed operation.");
    process.exit(1);
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const withoutLegacyId = seedProducts.map(({ id, ...rest }) => rest);
    await Product.insertMany(withoutLegacyId);
    console.info(`Inserted ${seedProducts.length} products.`);
  } else {
    console.info(`Products already present (${productCount}). Skipping product seed.`);
  }

  const cartCount = await Cart.countDocuments();
  if (cartCount === 0) {
    await Cart.create({ items: [] });
    console.info("Initialized default cart document.");
  } else {
    console.info(`Existing carts detected (${cartCount}). Skipping cart seed.`);
  }

  await mongoose.connection.close();
  console.info("Seeding complete. Mongo connection closed.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed script failed", error);
  process.exit(1);
});
