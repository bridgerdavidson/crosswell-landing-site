import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import BrainStill from "@/components/brain/BrainStill";
import Edge from "@/components/Edge";
import Trust from "@/components/Trust";
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
      <HowItWorks />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 40 }}><BrainStill /></div>
      <Edge />
      <TimeBack />
      <Trust />
      <BeyondCore />
      <WhoItsFor />
      <Team />
      <FinalCta />
      <Footer />
    </main>
  );
}
