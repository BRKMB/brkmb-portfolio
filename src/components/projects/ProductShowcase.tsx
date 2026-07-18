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

function ShotCopy({
  index,
  shot,
}: {
  index: number;
  shot: ProjectShot;
}) {
  return (
    <div className="product-split__copy">
      <p className="text-caption tracking-[0.22em] uppercase text-accent">
        {String(index + 1).padStart(2, "0")}
      </p>
      {shot.title ? (
        <h3 className="font-display product-split__title mt-4 v-primary">{shot.title}</h3>
      ) : null}
      {shot.caption ? (
        <p className="text-body md:text-lg mt-5 v-secondary leading-relaxed">{shot.caption}</p>
      ) : null}
    </div>
  );
}

function ShotMedia({
  projectTitle,
  shot,
  index,
}: {
  projectTitle: string;
  shot: ProjectShot;
  index: number;
}) {
  return (
    <div className="product-split__media">
      <Image
        src={shot.src}
        alt={shot.alt ?? `${projectTitle} screenshot ${index + 1}`}
        fill
        priority={index === 0}
        sizes="(max-width: 900px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}

export function ProductShowcase({
  project,
  features,
  shots,
  howItWorks,
  trustBadges,
  storeUrl,
}: Props) {
  return (
    <div className="product-showcase mt-14 space-y-16 md:space-y-24">
      <section aria-label={`${project.title} visuals`}>
        <div className="product-split">
          {shots.map((shot, i) => {
            const imageOnRight = i % 2 === 0;
            return (
              <motion.div
                key={shot.src}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease }}
                className={cn(
                  "product-split__row",
                  imageOnRight ? "product-split__row--ltr" : "product-split__row--rtl"
                )}
              >
                {imageOnRight ? (
                  <>
                    <ShotCopy index={i} shot={shot} />
                    <ShotMedia projectTitle={project.title} shot={shot} index={i} />
                  </>
                ) : (
                  <>
                    <ShotMedia projectTitle={project.title} shot={shot} index={i} />
                    <ShotCopy index={i} shot={shot} />
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="product-section-head">
          <p className="text-caption tracking-[0.22em] uppercase text-accent">Features</p>
          <h2 className="font-display text-title-1 mt-2 v-primary">Built for speed and privacy</h2>
        </div>
        <ul className="product-feature-grid mt-12 md:mt-14">
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
        <ol className="product-steps mt-12 md:mt-14">
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
