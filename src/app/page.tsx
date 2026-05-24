import { Hero } from "@/components/sections/Hero";
import { Brands } from "@/components/sections/Brands";
import { PortfolioGallery } from "@/components/sections/PortfolioGallery";
import { Projects } from "@/components/sections/Projects";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Brands />
      <PortfolioGallery />
      <Projects homepage />
      <About />
      <Contact />
    </>
  );
}
