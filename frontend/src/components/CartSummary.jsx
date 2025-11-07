import { formatCurrency } from "../utils/currency";

export default function CartSummary({ total, itemsCount, onCheckout, disabled }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Cart Summary</h3>
        <span className="text-sm text-slate-500">{itemsCount} items</span>
      </div>
      <div className="flex items-center justify-between text-lg font-semibold">
        <span>Total</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>
      <button
        type="button"
        onClick={onCheckout}
        disabled={disabled}
        className="inline-flex w-full items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Proceed to Checkout
      </button>
      <p className="text-xs text-slate-500">
        Secure mock checkout. No payment details required.
      </p>
    </section>
  );
}
