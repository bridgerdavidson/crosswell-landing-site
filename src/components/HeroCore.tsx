"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The rotating woven-core background. Isolated as a client island so the
 * heavy JPEG can cross-fade in only once it has actually decoded, instead of
 * popping in mid-draw. Everything else in the hero stays server-rendered.
 */
export default function HeroCore() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    // if the image was already cached and decoded before hydration, onLoad
    // may have fired before this island mounted; catch that here.
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div
      aria-hidden
      className="hero-core-mask pointer-events-none absolute inset-0"
    >
      <div className="hero-core">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="/hero-core.jpg"
          alt=""
          fetchPriority="high"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={loaded ? "is-loaded" : undefined}
        />
      </div>
    </div>
  );
}
