"use client";

import { useState } from "react";
import Image from "next/image";

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  if (!images.length) {
    return (
      <div className="ph" style={{ aspectRatio: "1/1" }}>
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="ph" style={{ aspectRatio: "1/1", position: "relative", overflow: "hidden" }}>
        <Image
          src={images[i]}
          alt={i === 0 ? alt : `${alt} — 商品圖 ${i + 1}`}
          fill
          priority={i === 0}
          sizes="(max-width: 680px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      {images.length > 1 && (
        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))",
            gap: 8,
          }}
        >
          {images.map((src, n) => (
            <button
              key={src}
              type="button"
              onClick={() => setI(n)}
              aria-label={`檢視商品圖 ${n + 1}`}
              aria-current={n === i}
              style={{
                position: "relative",
                aspectRatio: "1/1",
                border: n === i ? "1px solid var(--ink)" : "1px solid var(--line)",
                background: "var(--paper2)",
                padding: 0,
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <Image src={src} alt="" fill sizes="80px" style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
