import Link from "next/link";
import type { Product } from "../lib/catalog";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="rv group block">
      <div className="ph" style={{ aspectRatio: "4/5" }}>
        <span>{product.en.toUpperCase()}</span>
      </div>
      <h3 style={{ fontSize: "1.25rem", marginTop: 16, fontWeight: 700 }} className="group-hover:text-[var(--accent)] transition-colors">
        {product.name}
      </h3>
      <p className="en" style={{ marginTop: 6 }}>{product.en} ─ {product.size}</p>
      <p style={{ marginTop: 10, color: "var(--soft)", fontSize: "1rem" }}>NT$ {product.price.toLocaleString()}</p>
    </Link>
  );
}
