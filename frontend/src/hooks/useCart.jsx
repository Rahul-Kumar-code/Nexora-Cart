import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import client from "../api/client";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const loadCart = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await client.get("/cart");
      setCart(response.data.data);
      setStatus("idle");
      setError(null);
      return true;
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.error || "Unable to load cart");
      return false;
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = useCallback(
    async (productId, qty = 1) => {
      setStatus("loading");
      try {
        const response = await client.post("/cart", { productId, qty });
        setCart(response.data.data);
        setStatus("idle");
        setError(null);
        return true;
      } catch (err) {
        setStatus("error");
        setError(err.response?.data?.error || "Unable to add item");
        return false;
      }
    },
    []
  );

  const removeItem = useCallback(async (productId) => {
    setStatus("loading");
    try {
      const response = await client.delete(`/cart/${productId}`);
      setCart(response.data.data);
      setStatus("idle");
      setError(null);
      return true;
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.error || "Unable to remove item");
      return false;
    }
  }, []);

  const checkout = useCallback(
    async ({ name, email }) => {
      setStatus("loading");
      try {
        const cartItems = cart.items.map((item) => ({
          id: item.id,
          quantity: item.quantity
        }));
        const response = await client.post("/checkout", { name, email, cartItems });
        setCart({ items: [], total: 0 });
        setStatus("idle");
        setError(null);
        return response.data.data;
      } catch (err) {
        setStatus("error");
        const message = err.response?.data?.error || "Checkout failed";
        setError(message);
        throw new Error(message);
      }
    },
    [cart.items]
  );

  const updateQuantity = useCallback(async (productId, qty) => {
    setStatus("loading");
    try {
      const response = await client.put(`/cart/${productId}`, { qty });
      setCart(response.data.data);
      setStatus("idle");
      setError(null);
      return true;
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.error || "Unable to update quantity");
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      cart,
      status,
      error,
      addItem,
      removeItem,
      updateQuantity,
      refresh: loadCart,
      checkout,
      clearError: () => setError(null)
    }),
    [cart, status, error, addItem, removeItem, updateQuantity, loadCart, checkout]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
