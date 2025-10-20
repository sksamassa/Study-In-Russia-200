
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { CheckCircle } from "lucide-react";
import { getDictionary } from "@/i18n/get-dictionary";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";


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
      className="sticky top-1/2 flex items-center justify-center"
      style={{
        top: `calc(50% - ${(i * 20 + 250) / 2}px)`,
      }}
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

  const projects = Object.values(dictionary?.steps || {});
  const lang = usePathname().split('/')[1];

  return (
      <section
        ref={container}
        className="relative w-full py-20 bg-background mb-[50vh]"
      >
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="lg:sticky top-1/4 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">{dictionary?.title || ''}</h2>
                <p className="text-muted-foreground text-lg">{dictionary?.leftColumn.description || ''}</p>
                <Button asChild size="lg">
                    <Link href={`/${lang}/application`}>{dictionary?.leftColumn.cta || ''}</Link>
                </Button>
            </div>
            <div className="relative h-[250vh]">
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
            </div>
        </div>
      </section>
  );
};
