import { formatCurrency } from "../utils/currency";

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="flex h-[480px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={`${product.image}?auto=format&fit=crop&w=640&q=80`}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <header className="flex flex-col gap-2">
          {product.tags?.length ? (
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary/70">
              {product.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <h3 className="text-2xl font-semibold text-slate-900">{product.name}</h3>
          <p className="text-sm leading-relaxed text-slate-500">{product.description}</p>
        </header>
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Starting at</p>
            <span className="text-2xl font-bold text-slate-900">{formatCurrency(product.price)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onAdd(product.id)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <span>Add to Cart</span>
          <span aria-hidden className="text-lg font-bold">+</span>
        </button>
      </div>
    </article>
  );
}
