import { useState } from "react";
import { formatCurrency } from "../utils/currency";

export default function CheckoutModal({ isOpen, onClose, onSubmit, cart }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError(null);

    if (!name.trim() || !email.trim()) {
      setLocalError("Please fill out all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ name, email });
      setName("");
      setEmail("");
    } catch (error) {
      setLocalError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 transition hover:text-slate-600"
        >
          <span className="text-xl" aria-hidden>
            ×
          </span>
          <span className="sr-only">Close</span>
        </button>
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">Checkout</h2>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Full Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Doe"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email Address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jane@example.com"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
              Order Summary
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span>
                    {item.name}
                    <span className="text-slate-400"> × {item.quantity}</span>
                  </span>
                  <span>{formatCurrency(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {localError ? <p className="text-sm text-rose-500">{localError}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "Processing..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
