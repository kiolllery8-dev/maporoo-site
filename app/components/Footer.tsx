import Link from "next/link";
import { collections } from "../lib/catalog";

export default function Footer() {
  return (
    <footer className="bg-champagne-400/60 paper-grain border-t border-gold/20 mt-px">
      <div className="max-w-8xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <img src="/images/maporoo-logo.webp" alt="MAPOROO" className="h-12 w-auto" draggable={false} />
            <p className="text-sm text-ink-soft leading-loose max-w-xs tracking-wider">
              把擁抱的溫度，包成一份禮物。<br />
              ma · po · roo — 最初的聲音、擁抱的動作、最安心的小角落。
            </p>
          </div>

          {/* Collections */}
          <div className="md:col-span-2">
            <p className="eyebrow mb-5">系列</p>
            <ul className="space-y-3 text-sm text-ink-soft">
              {collections.map((c) => (
                <li key={c.slug}>
                  <Link href={`/collections/${c.slug}`} className="hover:text-gold-deep transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <p className="eyebrow mb-5">探索</p>
            <ul className="space-y-3 text-sm text-ink-soft">
              <li><Link href="/gift-finder" className="hover:text-gold-deep transition-colors">找一份剛好的禮物</Link></li>
              <li><Link href="/journal" className="hover:text-gold-deep transition-colors">MAPOROO 誌</Link></li>
              <li><Link href="/about" className="hover:text-gold-deep transition-colors">品牌故事</Link></li>
              <li><Link href="/stores" className="hover:text-gold-deep transition-colors">門市據點</Link></li>
            </ul>
          </div>

          {/* Service */}
          <div className="md:col-span-2">
            <p className="eyebrow mb-5">服務</p>
            <ul className="space-y-3 text-sm text-ink-soft">
              <li><Link href="/about" className="hover:text-gold-deep transition-colors">配送與退換</Link></li>
              <li><Link href="/about" className="hover:text-gold-deep transition-colors">常見問題</Link></li>
              <li><Link href="/about" className="hover:text-gold-deep transition-colors">企業禮贈</Link></li>
              <li><a href="mailto:hello@maporoo.com" className="hover:text-gold-deep transition-colors">hello@maporoo.com</a></li>
            </ul>
          </div>

          {/* Newsletter mini */}
          <div className="col-span-2 md:col-span-2">
            <p className="eyebrow mb-5">電子報</p>
            <p className="text-sm text-ink-soft leading-loose mb-3">收到新系列與溫柔的小提醒。</p>
            <Link href="/#newsletter" className="text-sm text-gold-deep link-underline">前往訂閱</Link>
          </div>
        </div>

        <div className="rule-h mt-14 mb-8" />

        <div className="flex flex-col md:flex-row justify-between gap-4 text-[0.7rem] tracking-widest2 uppercase text-ink-mute">
          <p>© 2026 MAPOROO. All rights reserved.</p>
          <p>願你永遠記得，最初擁抱的溫度</p>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-gold-deep transition-colors">隱私權</Link>
            <Link href="/about" className="hover:text-gold-deep transition-colors">使用條款</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
