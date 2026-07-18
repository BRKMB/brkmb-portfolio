"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  HiBolt,
  HiEnvelope,
  HiGift,
  HiLockClosed,
  HiShieldCheck,
  HiSparkles,
  HiUserGroup,
  HiDevicePhoneMobile,
} from "react-icons/hi2";
import type { Project, ProjectFeature, ProjectShot } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const featureIcons: IconType[] = [
  HiBolt,
  HiEnvelope,
  HiUserGroup,
  HiSparkles,
  HiShieldCheck,
  HiDevicePhoneMobile,
  HiLockClosed,
  HiGift,
];

type Props = {
  project: Project;
  features: ProjectFeature[];
  shots: ProjectShot[];
  howItWorks: string[];
  trustBadges: string[];
  storeUrl: string;
};

export function ProductShowcase({
  project,
  features,
  shots,
  howItWorks,
  trustBadges,
  storeUrl,
}: Props) {
  return (
    <div className="product-showcase mt-12 space-y-16 md:space-y-20">
      <section>
        <div className="product-section-head">
          <p className="text-caption tracking-[0.22em] uppercase text-accent">Product visuals</p>
          <h2 className="font-display text-title-1 mt-2 v-primary">See it in action</h2>
        </div>
        <div className="product-zigzag mt-10">
          {shots.map((shot, i) => {
            const imageRight = i % 2 === 0;
            return (
              <motion.article
                key={shot.src}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, ease }}
                className={cn(
                  "product-zigzag__row",
                  imageRight ? "product-zigzag__row--image-right" : "product-zigzag__row--image-left"
                )}
              >
                <div className="product-zigzag__copy">
                  <p className="text-caption tracking-[0.2em] uppercase text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  {shot.title ? (
                    <h3 className="font-display text-title-1 mt-3 v-primary leading-tight">
                      {shot.title}
                    </h3>
                  ) : null}
                  {shot.caption ? (
                    <p className="text-body mt-4 v-secondary leading-relaxed">{shot.caption}</p>
                  ) : null}
                </div>
                <div className="product-zigzag__media">
                  <div className="product-shot__frame">
                    <Image
                      src={shot.src}
                      alt={shot.alt ?? `${project.title} screenshot ${i + 1}`}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 768px) 100vw, 55vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section>
        <div className="product-section-head">
          <p className="text-caption tracking-[0.22em] uppercase text-accent">Features</p>
          <h2 className="font-display text-title-1 mt-2 v-primary">Built for speed and privacy</h2>
          <p className="text-body mt-3 max-w-2xl v-secondary leading-relaxed">
            Everything from the Chrome Web Store listing — automatic detection, one-click fill, and
            local-only processing.
          </p>
        </div>
        <ul className="product-feature-grid mt-8">
          {features.map((feature, i) => {
            const Icon = featureIcons[i % featureIcons.length];
            return (
              <motion.li
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.5, delay: i * 0.04, ease }}
                className="product-feature"
              >
                <span className="product-feature__icon" aria-hidden>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-title-3 mt-4 v-primary">{feature.title}</h3>
                <p className="text-subheadline mt-2 v-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </section>

      <section>
        <div className="product-section-head">
          <p className="text-caption tracking-[0.22em] uppercase text-accent">How it works</p>
          <h2 className="font-display text-title-1 mt-2 v-primary">Four steps. Zero friction.</h2>
        </div>
        <ol className="product-steps mt-8">
          {howItWorks.map((step, i) => (
            <li key={step} className="product-step">
              <span className="product-step__num font-display tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-body v-secondary leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {trustBadges.length > 0 ? (
        <section className="product-trust" aria-label="Privacy and trust">
          <ul className="product-trust__list">
            {trustBadges.map((badge) => (
              <li key={badge} className="product-trust__item">
                <HiShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                <span>{badge}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="product-cta">
        <div>
          <h2 className="font-display text-title-1 v-primary">Ready in one click</h2>
          <p className="text-body mt-3 max-w-xl v-secondary leading-relaxed">
            Works on Chrome, Brave, Edge, Arc, and other Chromium browsers via the Chrome Web Store.
          </p>
        </div>
        <Button href={storeUrl} external className="shrink-0">
          Add to your browser →
        </Button>
      </section>
    </div>
  );
}
