import Link from "next/link";
import Image from "next/image";
import type { Product } from "../lib/catalog";
import { heroImage } from "../lib/catalog";

export default function ProductCard({ product }: { product: Product }) {
  const img = heroImage(product);
  return (
    <Link href={`/products/${product.slug}`} className="rv group block">
      <div className="ph" style={{ aspectRatio: "4/5", position: "relative", overflow: "hidden" }}>
        {img ? (
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(max-width: 680px) 100vw, (max-width: 1120px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span>{product.en.toUpperCase()}</span>
        )}
      </div>
      <h3
        style={{ fontSize: "1.16rem", marginTop: 16, fontWeight: 700, lineHeight: 1.5 }}
        className="group-hover:text-[var(--accent)] transition-colors"
      >
        {product.name}
      </h3>
      <p className="en" style={{ marginTop: 6 }}>{product.en}</p>
      <p style={{ marginTop: 10, color: "var(--soft)", fontSize: "1rem" }}>
        NT$ {product.price.toLocaleString()}
        {product.listPrice && product.listPrice > product.price && (
          <span style={{ marginLeft: 10, color: "var(--mute)", textDecoration: "line-through", fontSize: ".88rem" }}>
            NT$ {product.listPrice.toLocaleString()}
          </span>
        )}
      </p>
    </Link>
  );
}
