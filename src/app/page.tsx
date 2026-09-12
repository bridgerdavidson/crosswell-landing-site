import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProductRun from "@/components/product/ProductRun";
import BrainSection from "@/components/brain/BrainSection";
import WhoItsFor from "@/components/WhoItsFor";
import Stats from "@/components/Stats";
import Edge from "@/components/Edge";
import TimeBack from "@/components/TimeBack";
import HowWeStart from "@/components/HowWeStart";
import BeyondCore from "@/components/BeyondCore";
import Values from "@/components/Values";
import Team from "@/components/Team";
import Insights from "@/components/Insights";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ProductRun />
      <BrainSection />
      <WhoItsFor />
      <Stats />
      <Edge />
      <TimeBack />
      <HowWeStart />
      <BeyondCore />
      <Values />
      <Team />
      <Insights />
      <FinalCta />
      <Footer />
    </main>
  );
}
