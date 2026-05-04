"use client";

import FadeIn from "./FadeIn";

export default function ChapterMission() {
  return (
    <section className="relative py-32 md:py-48 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <FadeIn>
          <p className="text-xs tracking-widest2 uppercase text-tea-deep">
            Chapter Four · 時代的回應
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 className="font-serif font-medium text-3xl md:text-4xl leading-[1.7] text-ink">
            在這個紛擾不休的世代，<br />
            每個人都在為自己的<span className="text-tea-deep">情緒與壓力</span>
            <br />
            找一個出口。
          </h2>
        </FadeIn>

        <FadeIn delay={0.4}>
          <span className="block w-16 h-px bg-tea/60" />
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="space-y-6 text-ink-soft leading-loose tracking-wider">
            <p>
              有鑑於芳療產業日漸蓬勃，我們也深信&nbsp;天然植物所蘊含的能量，能帶來無限希望。
            </p>
            <p>
              為幫助消費者認識精油，我們培訓內部專業芳療師，提供精油相關諮詢，並推出&nbsp;心靈療癒課程，結合專業與實務——
            </p>
            <p className="font-serif text-ink">
              讓消費者能確實將精油運用在日常生活，<br />
              幫助人們的生活，過得更好。
            </p>
            <p className="text-ink-soft/80 italic">
              這是我們推廣芳香療法&nbsp;最大的用意與宗旨。
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
