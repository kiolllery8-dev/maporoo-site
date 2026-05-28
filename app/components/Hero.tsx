"use client";

import { useRef, useState } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true); // must start muted for autoplay (Chrome policy)

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (!next && v.paused) {
      v.play();
      setPlaying(true);
    }
  };

  return (
    <section id="top" className="relative w-full aspect-[7/3] bg-champagne-500">
      {/* Background video (muted autoplay, loops). Solid champagne-gold
          section colour shows underneath while the video loads. */}
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 w-full h-full object-contain"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* subtle scrim — keeps nav & controls legible over any frame */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />

      {/* video controls — bottom-left, circular */}
      <div className="absolute bottom-7 left-5 md:left-8 z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "暫停影片" : "播放影片"}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-black/35 hover:bg-black/55 text-white backdrop-blur-sm border border-white/25 transition-colors"
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
              <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M4 2.5l9 5.5-9 5.5z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "開啟聲音" : "關閉聲音"}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-black/35 hover:bg-black/55 text-white backdrop-blur-sm border border-white/25 transition-colors"
        >
          {muted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
              <line x1="16" y1="9" x2="22" y2="15" />
              <line x1="22" y1="9" x2="16" y2="15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
              <path d="M15.5 8.5a5 5 0 010 7" />
              <path d="M18 6a8 8 0 010 12" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
