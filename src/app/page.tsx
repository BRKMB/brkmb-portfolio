import { Hero } from "@/components/sections/Hero";
import { Brands } from "@/components/sections/Brands";
import { PortfolioGallery } from "@/components/sections/PortfolioGallery";
import { Projects } from "@/components/sections/Projects";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollReveal variant="up">
        <Brands />
      </ScrollReveal>
      <ScrollReveal variant="scale" delay={0.05}>
        <PortfolioGallery />
      </ScrollReveal>
      <ScrollReveal variant="up" delay={0.08}>
        <Projects homepage />
      </ScrollReveal>
      <ScrollReveal variant="left" delay={0.05}>
        <About />
      </ScrollReveal>
      <ScrollReveal variant="up" delay={0.1}>
        <Contact />
      </ScrollReveal>
    </>
  );
}
