import Link from "next/link";
import type { Product } from "../lib/catalog";

export default function ProductCard({
  product,
  collectionSlug
}: {
  product: Product;
  collectionSlug: string;
}) {
  return (
    <Link
      href={`/collections/${collectionSlug}`}
      className="group block"
    >
      <div
        className={`relative aspect-[4/5] overflow-hidden ${
          product.tone === "deep" ? "tile-gold-deep" : "tile-gold"
        }`}
      >
        {/* placeholder mark — small bunny logo, low presence */}
        <img
          src="/images/maporoo-logo.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 m-auto h-16 w-auto opacity-25 transition-transform duration-700 ease-soft group-hover:scale-105"
          draggable={false}
        />
        <span className="absolute inset-0 ring-1 ring-gold/15" />
      </div>
      <div className="pt-4 space-y-1">
        <h3 className="font-serif-mix text-lg text-ink leading-snug group-hover:text-gold-deep transition-colors">
          {product.name}
        </h3>
        <p className="text-[0.7rem] uppercase tracking-widest2 text-gold-deep">{product.en}</p>
        <p className="text-sm text-ink-mute pt-1.5 leading-relaxed line-clamp-2">{product.blurb}</p>
        <p className="text-sm text-ink-soft pt-1.5">NT$ {product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
