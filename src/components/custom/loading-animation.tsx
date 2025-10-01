"use client";

import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';

export default function LoadingAnimation() {
  const containerRef = useRef(null);
  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/Book loading.json',
    });

    return () => anim.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: 450, height: 360 }} />;
}