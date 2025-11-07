const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:id", removeFromCart);
router.put("/:id", updateQuantity);

module.exports = router;
