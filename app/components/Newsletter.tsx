"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section id="newsletter" className="bg-champagne-300 border-y border-gold/15">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
        <p className="eyebrow">保持聯繫</p>
        <h2 className="mt-5 font-serif-mix text-2xl md:text-4xl text-ink leading-snug">
          訂閱電子報，收到新系列<br className="hidden md:block" />與溫柔的小提醒
        </h2>
        {done ? (
          <p className="mt-8 text-ink-soft tracking-wider">謝謝你 — 我們會把溫柔，慢慢寄到你的信箱。</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setDone(true);
            }}
            className="mt-9 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="你的 Email"
              className="flex-1 bg-transparent border-b border-gold/40 px-1 py-3 text-ink placeholder:text-ink-mute focus:outline-none focus:border-gold-deep transition-colors text-center sm:text-left"
            />
            <button
              type="submit"
              className="px-7 py-3 bg-ink text-champagne-100 text-sm tracking-widest2 uppercase hover:bg-gold-deep transition-colors"
            >
              訂閱
            </button>
          </form>
        )}
        <p className="mt-5 text-xs text-ink-mute tracking-wider">我們珍惜你的信箱，絕不轉寄第三方。</p>
      </div>
    </section>
  );
}
