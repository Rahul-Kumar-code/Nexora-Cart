import { useEffect } from "react";

export default function Notification({ message, type = "info", onClose }) {
  useEffect(() => {
    if (!message) {
      return undefined;
    }
    const timeout = setTimeout(onClose, 4000);
    return () => clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const styles = {
    info: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-700",
    error: "bg-rose-100 text-rose-600"
  };

  return (
    <div className="fixed right-6 top-6 z-50">
      <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-lg ${
        styles[type] || styles.info
      }`}
      >
        <span>{message}</span>
        <button type="button" onClick={onClose} className="text-xs uppercase tracking-wide text-slate-500">
          Close
        </button>
      </div>
    </div>
  );
}
