import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { IntroVideo } from "@/components/IntroVideo";
import { YouTubeSection } from "@/components/YouTubeSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-blue-500/10">
      <IntroVideo />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <YouTubeSection />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
