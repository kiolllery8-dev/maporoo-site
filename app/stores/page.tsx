import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "../components/FadeIn";

export const metadata: Metadata = {
  title: "門市據點｜MAPOROO",
  description: "歡迎來 MAPOROO 的門市，親手抱抱袋鼠 ROO。"
};

const stores = [
  {
    city: "台北",
    name: "MAPOROO 信義概念店",
    addr: "台北市信義區松高路 1 號 2F",
    hours: "每日 11:00 – 21:30",
    note: "旗艦店・可體驗全系列・禮物包裝服務"
  },
  {
    city: "台中",
    name: "MAPOROO 審計新村店",
    addr: "台中市西區民生路 368 巷內",
    hours: "週二至週日 12:00 – 20:00",
    note: "選物・期間限定小展"
  },
  {
    city: "高雄",
    name: "MAPOROO 駁二店",
    addr: "高雄市鹽埕區大勇路 1 號",
    hours: "每日 11:00 – 20:00",
    note: "海港店・限定明信片"
  }
];

export default function StoresPage() {
  return (
    <>
      <section className="tile-gold-deep paper-grain border-b border-gold/15">
        <div className="max-w-8xl mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
          <FadeIn>
            <p className="eyebrow">門市據點</p>
            <h1 className="mt-5 font-serif-mix text-4xl md:text-6xl text-ink leading-tight">來找袋鼠 ROO</h1>
            <p className="mt-6 max-w-xl mx-auto text-ink-soft leading-loose tracking-wider">
              有些溫度，要親手抱過才知道。歡迎來 MAPOROO 的門市坐坐。
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-8xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {stores.map((s, i) => (
            <FadeIn key={s.name} delay={i * 0.1}>
              <article className="group">
                <div className="relative aspect-[4/3] tile-gold ring-1 ring-gold/15 mb-6 flex items-center justify-center">
                  <span className="font-serif-mix text-3xl text-ink">{s.city}</span>
                </div>
                <p className="eyebrow">{s.city}</p>
                <h2 className="mt-3 font-serif-mix text-2xl text-ink">{s.name}</h2>
                <div className="mt-4 space-y-1.5 text-sm text-ink-soft leading-relaxed tracking-wider">
                  <p>{s.addr}</p>
                  <p>{s.hours}</p>
                  <p className="text-gold-deep">{s.note}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-24 text-center border-t border-gold/15 pt-16">
            <p className="text-ink-soft leading-loose tracking-wider max-w-lg mx-auto">
              想合作開設 MAPOROO 角落、或洽詢企業禮贈？
            </p>
            <div className="mt-7">
              <a href="mailto:hello@maporoo.com" className="inline-flex items-center px-7 py-3 bg-ink text-champagne-100 text-sm tracking-widest2 uppercase hover:bg-gold-deep transition-colors">
                與我們聯繫
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
