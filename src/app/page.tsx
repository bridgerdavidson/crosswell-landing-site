import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProductRun from "@/components/product/ProductRun";
import ProblemBand from "@/components/ProblemBand";
import HowWeStart from "@/components/HowWeStart";
import BrainSection from "@/components/brain/BrainSection";
import Edge from "@/components/Edge";
import BeyondCore from "@/components/BeyondCore";
import WhoItsFor from "@/components/WhoItsFor";
import TimeBack from "@/components/TimeBack";
import Team from "@/components/Team";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ProductRun />
      <ProblemBand />
      <BrainSection />
      <Edge />
      <TimeBack />
      <HowWeStart />
      <BeyondCore />
      <WhoItsFor />
      <Team />
      <FinalCta />
      <Footer />
    </main>
  );
}
