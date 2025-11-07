import Home from "./pages/Home";
import { CartProvider } from "./hooks/useCart";

export default function App() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Nexora</p>
              <h1 className="text-lg font-semibold text-slate-900">Shopping Cart Experience</h1>
            </div>
            <a
              href=""
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary sm:inline-flex"
            >
              View
            </a>
          </div>
        </header>
        <Home />
        <footer className="mt-auto bg-white/90">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Nexora Assignment. For internship screening only.</p>
            <p>Tech stack: React · Tailwind CSS · Express · MongoDB</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
