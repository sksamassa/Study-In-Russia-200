"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { default as Lenis } from "lenis/react";
import React, { useRef } from "react";
import { CheckCircle } from "lucide-react";
import { getDictionary } from "@/i18n/get-dictionary";


const StickyCard = ({
  i,
  title,
  steps,
  stepNumber,
  progress,
  range,
  targetScale,
}: {
  i: number;
  title: string;
  steps: string[];
  stepNumber: number;
  progress: any;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);

  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 20 + 250}px)`,
        }}
        className="relative -top-1/4 flex h-auto max-h-[500px] w-[550px] origin-top flex-col overflow-hidden rounded-2xl bg-card p-8 shadow-2xl bg-card"
      >
        <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                {stepNumber}
            </div>
            <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <ul className="space-y-4">
            {steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{step}</span>
                </li>
            ))}
        </ul>

      </motion.div>
    </div>
  );
};

export const StickyScroll = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['stickyScroll']}) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const projects = Object.values(dictionary.steps);

  return (
    <Lenis root>
      <main
        ref={container}
        className="relative flex w-full flex-col items-center justify-center pb-[100vh] pt-[50vh] bg-background"
      >
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">{dictionary.title}</h2>
          <span className="after:from-background after:to-foreground/60 relative max-w-[20ch] text-xs uppercase leading-tight opacity-60 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            {dictionary.subtitle}
          </span>
        </div>
        {projects.map((project, i) => {
          const targetScale = Math.max(
            0.5,
            1 - (projects.length - i - 1) * 0.1,
          );
          return (
            <StickyCard
              key={`p_${i}`}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </Lenis>
  );
};
