"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#08080c]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">inSight</span>
        </motion.div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <motion.a
            href="#features"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            whileHover={{ y: -2 }}
          >
            Features
          </motion.a>
          <motion.a
            href="#how-it-works"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            whileHover={{ y: -2 }}
          >
            How it works
          </motion.a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 hidden sm:block"
          >
            Sign in
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-400/50 rounded-lg hover:bg-cyan-400/10 transition-all duration-200"
          >
            Get Early Access
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}