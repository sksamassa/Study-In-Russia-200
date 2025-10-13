"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { default as Lenis } from "lenis/react";
import React, { useRef } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const projects = [
  {
    title: "Navigating the Visa Process",
    src: PlaceHolderImages[0].imageUrl,
    hint: PlaceHolderImages[0].imageHint,
  },
  {
    title: "Choosing Your University",
    src: PlaceHolderImages[1].imageUrl,
    hint: PlaceHolderImages[1].imageHint,
  },
  {
    title: "Life in a Russian City",
    src: PlaceHolderImages[2].imageUrl,
    hint: PlaceHolderImages[2].imageHint,
  },
  {
    title: "Preparing Your Documents",
    src: PlaceHolderImages[3].imageUrl,
    hint: PlaceHolderImages[3].imageHint,
  },
  {
    title: "Making New Friends",
    src: PlaceHolderImages[4].imageUrl,
    hint: PlaceHolderImages[4].imageHint,
  },
];

const StickyCard = ({
  i,
  title,
  src,
  hint,
  progress,
  range,
  targetScale,
}: {
  i: number;
  title: string;
  src: string;
  hint: string;
  progress: any;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex h-screen items-center justify-center"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 20}px)`,
        }}
        className="relative -top-1/4 flex h-[300px] w-[500px] origin-top flex-col overflow-hidden rounded-2xl shadow-2xl"
      >
        <div className="absolute bottom-0 left-0 w-full p-4 bg-black/50 text-white">
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <Image src={src} alt={title} fill style={{objectFit: "cover"}} data-ai-hint={hint}/>
      </motion.div>
    </div>
  );
};

export const StickyScroll = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <Lenis root>
      <main
        ref={container}
        className="relative flex w-full flex-col items-center justify-center pb-[100vh] pt-[50vh]"
      >
        <div className="absolute left-1/2 top-[10%] z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="after:from-background after:to-foreground/60 relative max-w-[20ch] text-xs uppercase leading-tight opacity-60 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            A Glimpse into Your Future
          </span>
        </div>
        {projects.map((project, i) => {
          const targetScale = Math.max(
            0.5,
            1 - (projects.length - i - 1) * 0.05,
          );
          return (
            <StickyCard
              key={`p_${i}`}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.2, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </Lenis>
  );
};
