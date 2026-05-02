export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-ink text-cream/70 py-16 px-6 border-t border-cream/10"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 items-start">
        <div className="space-y-3">
          <p className="font-serif-mix text-2xl tracking-wider2 text-cream">
            BrezNu
          </p>
          <p className="font-serif text-sm tracking-widest2 text-tea-light">
            碧森妮
          </p>
          <p className="text-xs leading-loose tracking-wider text-cream/50 pt-2">
            鴻元生技&ensp;Hong Yuan Biotech<br />
            Since 1960s · Made in Taiwan
          </p>
        </div>

        <div className="space-y-3 text-xs tracking-wider leading-loose">
          <p className="text-cream/50 uppercase tracking-widest2 mb-2">Story</p>
          <p>六十年的天然之路</p>
          <p>從工業到品牌</p>
          <p>對天然植物偏執的熱愛</p>
        </div>

        <div className="space-y-3 text-xs tracking-wider leading-loose">
          <p className="text-cream/50 uppercase tracking-widest2 mb-2">Contact</p>
          <p>更多資訊請見&nbsp;
            <a
              href="https://breznu.com"
              className="text-tea-light hover:text-cream transition underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              breznu.com
            </a>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-12 mt-12 border-t border-cream/10 text-[10px] tracking-widest2 uppercase text-cream/40 flex flex-col md:flex-row justify-between gap-3">
        <p>© 2026 BrezNu · Hong Yuan Biotech. All rights reserved.</p>
        <p>呼吸清新的空氣，是生命的泉源</p>
      </div>
    </footer>
  );
}
