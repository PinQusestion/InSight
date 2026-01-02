import NavBar from './components/navbar';
import Hero from './components/Hero';
import DemoPreview from './components/DemoPreview';
import Features from './components/Features';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#08080c]">
      <NavBar />
      <main>
        <Hero />
        <DemoPreview />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
