
'use client';

import { animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
}

export function CountUp({ from = 0, to, duration = 2, suffix = '' }: CountUpProps) {
  const nodeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration,
      onUpdate(value) {
        node.textContent = Math.round(value).toString() + suffix;
      },
    });

    return () => controls.stop();
  }, [from, to, duration, suffix]);

  return <span ref={nodeRef} />;
}

    