
'use client';

import { animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface CountUpProps {
  from?: number;
  to: string | number;
  duration?: number;
  suffix?: string;
}

export function CountUp({ from = 0, to, duration = 2, suffix = '' }: CountUpProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const endValue = typeof to === 'string' ? parseInt(to, 10) : to;


  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    // Set initial text content
    node.textContent = `${from}${suffix}`;

    const controls = animate(from, endValue, {
      duration,
      onUpdate(value) {
        node.textContent = Math.round(value).toString() + suffix;
      },
    });

    return () => controls.stop();
  }, [from, endValue, duration, suffix]);

  return <span ref={nodeRef} />;
}
