"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../components/navbar.js';
import Hero from '../components/Hero.js';
import DemoPreview from '../components/DemoPreview.js';
import Features from '../components/Features.js';
import CTASection from '../components/CTASection.js';
import Footer from '../components/Footer.js';
import { checkAuth } from '../lib/api.js';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const userData = await checkAuth();
        if (userData?.user) {
          // User is already logged in, optionally redirect to dashboard
          // Uncomment the line below to auto-redirect logged-in users to dashboard
          // router.push('/dashboard');
        }
      } catch (error) {
        console.error("Failed to check auth:", error);
      }
    };

    checkUserAuth();
  }, [router]);

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
