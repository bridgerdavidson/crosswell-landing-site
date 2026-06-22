import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Tools } from "@/components/sections/tools";
import { Flagship } from "@/components/sections/flagship";
import { WhyUs } from "@/components/sections/why-us";
import { Value } from "@/components/sections/value";
import { HowWeWork } from "@/components/sections/how-we-work";
import { Team } from "@/components/sections/team";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Tools />
        <Flagship />
        <WhyUs />
        <Value />
        <HowWeWork />
        <Team />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
