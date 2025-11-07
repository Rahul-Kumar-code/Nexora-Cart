const productStore = require("../db/productStore");

async function getProducts(req, res, next) {
  try {
    const products = await productStore.findAll();
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts
};
