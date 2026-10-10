import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <FinalCTA />
      </main>
      <footer className="border-t border-white/5 py-8 text-center text-sm text-muted">
        © 2026 BarathIQ. All rights reserved.
      </footer>
    </div>
  );
}