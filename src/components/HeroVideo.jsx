"use client";

import { useEffect, useState } from "react";

export default function HeroVideo() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => setShowVideo(desktop.matches);
    update();
    desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, []);

  return showVideo ? (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/images/hero-bg.webp"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src="/images/hero-video.mp4" type="video/mp4" />
    </video>
  ) : null;
}
