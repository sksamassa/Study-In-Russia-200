
'use client';

import { ReactLenis } from 'lenis/react';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.075, duration: 0.5 }}> {/* Reduced duration from 1.5 to 0.5 */}
      {children}
    </ReactLenis>
  );
}
