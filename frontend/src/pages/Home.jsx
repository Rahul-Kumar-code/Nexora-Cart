import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import CheckoutModal from "../components/CheckoutModal";
import Notification from "../components/Notification";
import ReceiptModal from "../components/ReceiptModal";
import { useCart } from "../hooks/useCart";
import useProducts from "../hooks/useProducts";

function HomeContent() {
  const { products, loading: productsLoading, error: productError } = useProducts();
  const {
    cart,
    status: cartStatus,
    error: cartError,
    addItem,
    removeItem,
    updateQuantity,
    checkout,
    clearError
  } = useCart();

  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (cartError) {
      setToast({ message: cartError, type: "error" });
      clearError();
    }
  }, [cartError, clearError]);

  useEffect(() => {
    if (productError) {
      setToast({ message: productError, type: "error" });
    }
  }, [productError]);

  const cartCount = useMemo(
    () => cart.items.reduce((total, item) => total + item.quantity, 0),
    [cart.items]
  );

  const statusLabel = useMemo(() => {
    switch (cartStatus) {
      case "loading":
        return "Updating";
      case "error":
        return "Attention";
      default:
        return "Ready";
    }
  }, [cartStatus]);

  const handleAddToCart = async (productId) => {
    const success = await addItem(productId, 1);
    if (success) {
      setToast({ message: "Item added to cart", type: "success" });
    }
  };

  const handleCheckout = async (details) => {
    try {
      const receiptData = await checkout(details);
      setReceipt(receiptData);
      setCheckoutOpen(false);
      setToast({ message: "Checkout completed", type: "success" });
    } catch (error) {
      setToast({ message: error.message, type: "error" });
      throw error;
    }
  };

  const handleRemove = async (productId) => {
    const success = await removeItem(productId);
    if (success) {
      setToast({ message: "Item removed", type: "info" });
    }
    return success;
  };

  const isPending = cartStatus === "loading";

  return (
  <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-12 px-6 pb-20 pt-12 lg:flex-row lg:pt-20">
      <section className="flex-1 space-y-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
            Nexora Storefront
          </p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Curated picks for your everyday essentials
          </h1>
          <p className="text-base text-slate-500">
            Browse our selection of lifestyle staples. Add items to your cart and explore the mock checkout flow.
          </p>
        </header>
        {productsLoading ? (
          <div className="grid gap-8 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-80 animate-pulse rounded-3xl bg-slate-100"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            {productError ? productError : "No products available right now. Please try again shortly."}
          </div>
        )}
      </section>
      <aside className="w-full max-w-md space-y-6">
        <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/60">Your cart</p>
              <h2 className="mt-1 text-2xl font-semibold">{cartCount} items</h2>
            </div>
            <span className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">{statusLabel}</span>
          </div>
          <p className="mt-4 text-sm text-white/70">
            Items in your cart stay saved locally. Complete the mock checkout to generate a receipt.
          </p>
        </section>
  <div className="space-y-5">
          {cart.items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              Your cart is empty. Add something from the catalog to get started.
            </p>
          ) : (
            cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onUpdate={updateQuantity}
              />
            ))
          )}
        </div>
        <CartSummary
          total={cart.total}
          itemsCount={cartCount}
          onCheckout={() => setCheckoutOpen(true)}
          disabled={cart.items.length === 0 || isPending}
        />
      </aside>
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSubmit={handleCheckout}
        cart={cart}
      />
      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      <Notification
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </main>
  );
}

export default function Home() {
  return <HomeContent />;
}
