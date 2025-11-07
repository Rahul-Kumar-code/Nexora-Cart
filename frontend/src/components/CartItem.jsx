import { useEffect, useState } from "react";
import { formatCurrency } from "../utils/currency";

export default function CartItem({ item, onRemove, onUpdate }) {
  const [localQty, setLocalQty] = useState(String(item.quantity));

  useEffect(() => {
    setLocalQty(String(item.quantity));
  }, [item.quantity]);

  const handleBlur = async () => {
    if (localQty.trim() === "") {
      setLocalQty(String(item.quantity));
      return;
    }

    const safeQty = Number(localQty);
    if (Number.isNaN(safeQty) || safeQty < 0) {
      setLocalQty(String(item.quantity));
      return;
    }

    if (safeQty === item.quantity) {
      return;
    }

    const success = await onUpdate(item.id, safeQty);
    if (!success) {
      setLocalQty(String(item.quantity));
    } else if (safeQty > 0) {
      setLocalQty(String(safeQty));
    }
  };

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <img
        src={`${item.image}?auto=format&fit=crop&w=120&q=80`}
        alt={item.name}
        className="h-20 w-20 rounded-xl object-cover"
      />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-slate-900">{item.name}</h4>
            <p className="text-sm text-slate-500">{formatCurrency(item.price)} each</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              const success = await onRemove(item.id);
              if (!success) {
                setLocalQty(String(item.quantity));
              }
            }}
            className="text-sm font-medium text-rose-500 transition hover:text-rose-600"
          >
            Remove
          </button>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm text-slate-600">
            Qty:
            <input
              type="number"
              min="0"
              step="1"
              value={localQty}
              onChange={(event) => setLocalQty(event.target.value)}
              onBlur={handleBlur}
              className="ml-2 w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <span className="text-base font-semibold text-slate-900">
            {formatCurrency(item.lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
