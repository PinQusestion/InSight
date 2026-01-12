import NavBar from '../components/navbar.js';
import Hero from '../components/Hero.js';
import DemoPreview from '../components/DemoPreview.js';
import Features from '../components/Features.js';
import CTASection from '../components/CTASection.js';
import Footer from '../components/Footer.js';

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <DemoPreview />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
