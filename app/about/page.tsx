import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "../components/FadeIn";

export const metadata: Metadata = {
  title: "關於 MAPOROO｜把擁抱的溫度，包成一份禮物",
  description:
    "MAPOROO 的品牌故事——從一份對童心的固執守候開始，把溫柔做進日常的小角落。"
};

const chapters = [
  {
    no: "Ch.01",
    kicker: "起源",
    title: "從一份對童心的固執守候開始",
    body: [
      "MAPOROO 的起點，是一份不想長大的小固執——我們相信，每個大人心裡都還住著一個小孩，等著被一個溫暖的小角落接住。",
      "從第一個小物件、第一張插畫、第一次包裝開始，我們花了很長的時間，去摸索那種「拿在手上就會笑出來」的溫度。"
    ]
  },
  {
    no: "Ch.02",
    kicker: "走出小屋",
    title: "為每一份心意精緻把關",
    body: [
      "我們把小屋裡的故事，慢慢帶到更遠的地方——市集、選物店、海外的小角落，遇見越來越多願意陪 MAPOROO 一起長大的朋友。",
      "從可愛的長相，到摸起來的觸感，再到能不能陪小主人用上很久——Made with Care 不只是一句口號。"
    ]
  },
  {
    no: "Ch.03",
    kicker: "品牌誕生",
    title: "MAPOROO 於是誕生",
    body: [
      "當我們意識到——我們做的不是商品，而是把擁抱的溫度，包成一份禮物的時候，品牌真正誕生了。",
      "從一隻金色方塊裡探出頭來的小袋鼠，成了陪伴的標記。我們替它取名 MAPOROO。"
    ]
  }
];

export default function AboutPage() {
  return (
    <>
      {/* hero */}
      <section className="tile-gold-deep paper-grain">
        <div className="max-w-3xl mx-auto px-6 py-28 md:py-40 text-center">
          <FadeIn>
            <p className="eyebrow">關於 MAPOROO</p>
            <h1 className="mt-6 font-serif-mix text-4xl md:text-6xl text-ink leading-[1.2]">
              把擁抱的溫度，<br />包成一份禮物
            </h1>
            <p className="mt-7 text-ink-soft leading-loose tracking-wider">
              這是 MAPOROO 一路走過的溫柔小路。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* the name */}
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
        <FadeIn>
          <p className="font-en italic text-gold-deep text-5xl md:text-7xl tracking-wider">MAPOROO</p>
          <div className="mt-8 flex justify-center"><span className="w-16 rule-h" /></div>
          <h2 className="mt-8 font-serif-mix text-xl md:text-2xl text-ink leading-loose">由三個音節組成 — Ma · Po · Roo</h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mt-12 grid sm:grid-cols-3 gap-8 sm:gap-10 text-ink-soft">
            {[
              ["Ma", "最初的聲音、最初的擁抱。"],
              ["Po", "把心意輕輕「抱」起的動作。"],
              ["Roo", "袋鼠袋裡，最安心的小角落。"]
            ].map(([k, v]) => (
              <div key={k} className="space-y-2">
                <p className="font-en italic text-gold-deep text-2xl tracking-wider">{k}</p>
                <p className="text-sm leading-loose tracking-wider">{v}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* chapters */}
      <div className="bg-champagne-300/60 border-y border-gold/15">
        <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 space-y-20 md:space-y-28">
          {chapters.map((ch) => (
            <FadeIn key={ch.no}>
              <article>
                <p className="font-en text-gold-deep text-3xl md:text-5xl tracking-wider leading-none">{ch.no}</p>
                <p className="mt-4 eyebrow">{ch.kicker}</p>
                <h2 className="mt-4 font-serif-mix text-2xl md:text-4xl text-ink leading-snug">{ch.title}</h2>
                <span className="block w-12 h-px bg-gold/50 my-6" />
                <div className="space-y-5 text-ink-soft leading-loose tracking-wider">
                  {ch.body.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* belief / closing */}
      <section className="max-w-3xl mx-auto px-6 py-28 md:py-40 text-center">
        <FadeIn>
          <p className="eyebrow">我們的信念</p>
          <blockquote className="mt-8 font-serif-mix text-2xl md:text-4xl text-ink leading-[1.7]">
            「只想做最有溫度的小事」
          </blockquote>
          <p className="mt-10 max-w-xl mx-auto text-ink-soft leading-loose tracking-wider">
            一路走來，堅持把每一件作品做成能被珍惜、能被收藏、能被傳下去的樣子。這些固執的堅持，就是 MAPOROO 一直走下去的初衷。
          </p>
          <div className="mt-12">
            <Link href="/collections" className="inline-flex items-center px-7 py-3 bg-ink text-champagne-100 text-sm tracking-widest2 uppercase hover:bg-gold-deep transition-colors">
              探索全系列
            </Link>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
