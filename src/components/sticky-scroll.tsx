
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { CheckCircle, File, Mail, Plane } from "lucide-react";
import { getDictionary } from "@/i18n/get-dictionary";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";


const StickyCard = ({
  i,
  title,
  description,
  icon,
  progress,
  range,
  targetScale,
}: {
  i: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: any;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-1/2  flex items-center justify-center"
      style={{
        top: `calc(20% + ${i * 70}px)`,
      }}
    >
      <motion.div
        style={{
          scale,
        }}
        className="relative flex flex-col w-[550px] min-h-[300px] origin-center rounded-3xl bg-card p-8 shadow-xl"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="text-primary">{icon}</div>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <div className="text-5xl font-bold text-primary opacity-80">
            0{i + 1}
          </div>
        </div>
        <div className="text-muted-foreground">
            {description}
        </div>
      </motion.div>
    </div>
  );
};

export const StickyScroll = ({ content = [], dictionary }: { content?: { title: string; description: React.ReactNode; icon: React.ReactNode; }[], dictionary: Awaited<ReturnType<typeof getDictionary>>['stickyScroll'] }) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const lang = usePathname().split('/')[1];

  return (
      <section
        ref={container}
        className="relative px-4 md:px-16 w-full bg-background my-20"
      >
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 py-16 items-start">
            <div className="lg:sticky top-32 mb-10 space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">{dictionary.leftColumn.title}</h2>
                <p className="text-muted-foreground text-lg">{dictionary.leftColumn.description}</p>
                <Button asChild size="lg" className="text-lg px-10 py-7">
                    <Link href={`/${lang}/application`}>{dictionary.leftColumn.cta}</Link>
                </Button>
            </div>
            <div className="relative h-[200vh] space-y-6 border-6">
                {content.map((project, i) => {
                    const targetScale = 1 - (content.length - 1 - i) * 0.05;
                    return (
                        <StickyCard
                        key={`p_${i}`}
                        i={i}
                        {...project}
                        progress={scrollYProgress}
                        range={[i * (1 / content.length), 1]}
                        targetScale={targetScale}
                        />
                    );
                })}
            </div>
        </div>
      </section>
  );
};
