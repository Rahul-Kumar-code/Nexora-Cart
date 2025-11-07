const { z } = require("zod");
const cartStore = require("../db/cartStore");
const productStore = require("../db/productStore");

const addToCartSchema = z.object({
  productId: z.string(),
  qty: z.number().int().positive()
});

const updateQuantitySchema = z.object({
  qty: z.number().int().nonnegative()
});

const checkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
  cartItems: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().int().positive()
      })
    )
    .optional()
});

async function getCart(req, res, next) {
  try {
    const snapshot = await cartStore.getCart();
    res.json({ data: snapshot });
  } catch (error) {
    next(error);
  }
}

async function addToCart(req, res, next) {
  try {
    const payload = addToCartSchema.parse(req.body);
    const product = await productStore.findById(payload.productId);

    if (!product) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    await cartStore.addItem(product.id, payload.qty);
    const snapshot = await cartStore.getCart();

    res.status(201).json({
      message: `${product.name} added to cart`,
      data: snapshot
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid payload",
        details: error.errors
      });
    }
    next(error);
  }
}

async function removeFromCart(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productStore.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await cartStore.removeItem(id);
    const snapshot = await cartStore.getCart();

    res.json({
      message: `${product.name} removed from cart`,
      data: snapshot
    });
  } catch (error) {
    next(error);
  }
}

async function updateQuantity(req, res, next) {
  try {
    const { id } = req.params;
    const payload = updateQuantitySchema.parse(req.body);

    const product = await productStore.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const snapshot = await cartStore.setItemQuantity(id, payload.qty);

    res.json({
      message:
        payload.qty === 0
          ? `${product.name} removed from cart`
          : `${product.name} quantity updated`,
      data: snapshot
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid payload",
        details: error.errors
      });
    }
    next(error);
  }
}

async function checkout(req, res, next) {
  try {
    const payload = checkoutSchema.parse(req.body);
    const snapshot = await cartStore.getCart();

    if (snapshot.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    await cartStore.clearCart();

    const receipt = {
      customer: {
        name: payload.name,
        email: payload.email
      },
      total: snapshot.total,
      items: snapshot.items,
      timestamp: new Date().toISOString(),
      confirmation: `ORDER-${Date.now()}`
    };

    res.status(201).json({
      message: "Checkout successful",
      data: receipt
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid payload",
        details: error.errors
      });
    }
    next(error);
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  checkout
};
