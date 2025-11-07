import { formatCurrency } from "../utils/currency";

export default function ReceiptModal({ receipt, onClose }) {
  if (!receipt) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
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
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-primary">Receipt</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Thank you, {receipt.customer.name}!</h2>
          <p className="text-sm text-slate-500">Order confirmation #{receipt.confirmation}</p>
        </div>
        <div className="space-y-4 text-sm text-slate-600">
          <div className="rounded-2xl bg-slate-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Summary
            </h3>
            <ul className="mt-2 space-y-1">
              {receipt.items.map((item) => (
                <li key={item.id} className="flex justify-between">
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
              <span>{formatCurrency(receipt.total)}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            A confirmation has been sent to <span className="font-medium">{receipt.customer.email}</span>.
          </p>
          <p className="text-xs text-slate-400">Processed at {new Date(receipt.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
