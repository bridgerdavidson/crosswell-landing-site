import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
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
