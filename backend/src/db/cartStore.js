const Cart = require("../models/Cart");
const { isDatabaseEnabled } = require("./connection");
const productStore = require("./productStore");

class CartStore {
  constructor() {
    this.memoryCart = { items: [] };
    this.cartId = null;
  }

  async init() {
    if (!isDatabaseEnabled()) {
      return;
    }

    const existing = await Cart.findOne({});
    if (existing) {
      this.cartId = existing._id.toString();
      return;
    }

    const created = await Cart.create({ items: [] });
    this.cartId = created._id.toString();
  }

  async getCart() {
    if (!isDatabaseEnabled()) {
      const detailedItems = [];
      for (const item of this.memoryCart.items) {
        const product = await productStore.findById(item.productId);
        if (!product) {
          continue;
        }

        const lineTotal = Number((product.price * item.quantity).toFixed(2));
        detailedItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          lineTotal,
          image: product.image,
          description: product.description
        });
      }

      const total = Number(
        detailedItems.reduce((acc, item) => acc + item.lineTotal, 0).toFixed(2)
      );

      return { items: detailedItems, total };
    }

    const cartDoc = await Cart.findById(this.cartId)
      .populate("items.product")
      .exec();

    if (!cartDoc) {
      return { items: [], total: 0 };
    }

    const detailedItems = cartDoc.items
      .filter((item) => item.product)
      .map((item) => {
        const product = item.product;
        const lineTotal = Number((product.price * item.quantity).toFixed(2));
        return {
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          lineTotal,
          image: product.image,
          description: product.description
        };
      });

    const total = Number(
      detailedItems.reduce((acc, item) => acc + item.lineTotal, 0).toFixed(2)
    );

    return { items: detailedItems, total };
  }

  async addItem(productId, quantity) {
    if (!isDatabaseEnabled()) {
      const existing = this.memoryCart.items.find((item) => item.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.memoryCart.items.push({ productId, quantity });
      }
      return this.getCart();
    }

    const cart = await Cart.findById(this.cartId);
    if (!cart) {
      throw new Error("Cart not initialized");
    }

    const existing = cart.items.find((item) => item.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return this.getCart();
  }

  async removeItem(productId) {
    if (!isDatabaseEnabled()) {
      this.memoryCart.items = this.memoryCart.items.filter(
        (item) => item.productId !== productId
      );
      return this.getCart();
    }

    const cart = await Cart.findById(this.cartId);
    if (!cart) {
      throw new Error("Cart not initialized");
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    return this.getCart();
  }

  async setItemQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }

    if (!isDatabaseEnabled()) {
      const existing = this.memoryCart.items.find((item) => item.productId === productId);
      if (existing) {
        existing.quantity = quantity;
      } else {
        this.memoryCart.items.push({ productId, quantity });
      }
      return this.getCart();
    }

    const cart = await Cart.findById(this.cartId);
    if (!cart) {
      throw new Error("Cart not initialized");
    }

    const existing = cart.items.find((item) => item.product.toString() === productId);
    if (existing) {
      existing.quantity = quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return this.getCart();
  }

  async clearCart() {
    if (!isDatabaseEnabled()) {
      this.memoryCart.items = [];
      return;
    }

    const cart = await Cart.findById(this.cartId);
    if (!cart) {
      throw new Error("Cart not initialized");
    }

    cart.items = [];
    await cart.save();
  }
}

module.exports = new CartStore();
