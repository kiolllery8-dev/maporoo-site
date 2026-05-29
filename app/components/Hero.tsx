"use client";

import { useRef, useState } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true); // muted start = required for autoplay

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (!next && v.paused) { v.play(); setPlaying(true); }
  };

  return (
    <section id="top" className="film">
      <video
        ref={videoRef}
        className="film-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="film-scrim" />

      <div className="film-inner">
        <div className="wrap">
          <p className="eyebrow" style={{ color: "rgba(245,241,232,.78)" }}>MAPOROO ─ Skin Care</p>
          <h1 style={{ marginTop: 22, maxWidth: 780 }}>肌膚的照顧，<br />可以同時有效，且從容。</h1>
          <p className="lead" style={{ marginTop: 26 }}>以醫學實證的成分，配製美白、保濕與修復的日常保養。</p>
          <div style={{ marginTop: 32 }}><a className="lnk" href="#collections">探索配方</a></div>
        </div>
      </div>

      <p className="film-cap">形象影片 ─ Brand Film</p>

      <div className="ctrls">
        <button type="button" className="ctrl" onClick={togglePlay} aria-label={playing ? "暫停影片" : "播放影片"}>
          {playing ? (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden><rect x="3.5" y="2.5" width="3" height="11" rx="1" /><rect x="9.5" y="2.5" width="3" height="11" rx="1" /></svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M4 2.5l9 5.5-9 5.5z" /></svg>
          )}
        </button>
        <button type="button" className="ctrl" onClick={toggleMute} aria-label={muted ? "開啟聲音" : "關閉聲音"}>
          {muted ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" /><line x1="16" y1="9" x2="22" y2="15" /><line x1="22" y1="9" x2="16" y2="15" /></svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" /><path d="M15.5 8.5a5 5 0 010 7" /><path d="M18 6a8 8 0 010 12" /></svg>
          )}
        </button>
      </div>
    </section>
  );
}
