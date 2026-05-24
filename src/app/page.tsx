import { Hero } from "@/components/sections/Hero";
import { Brands } from "@/components/sections/Brands";
import { Projects } from "@/components/sections/Projects";
import { Building } from "@/components/sections/Building";
import { PortfolioGallery } from "@/components/sections/PortfolioGallery";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Brands />
      <Projects />
      <Building />
      <PortfolioGallery />
      <About />
      <Contact />
    </>
  );
}
