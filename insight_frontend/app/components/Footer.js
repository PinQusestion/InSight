"use client";
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  // Use a state-like approach to get year safely
  const currentYear = typeof window !== 'undefined' ? new Date().getFullYear() : 2026;

  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-[#08080c]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-linear-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">inSight</span>
          </motion.div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-gray-400">
            <motion.a
              href="#"
              whileHover={{ color: "#fff" }}
              className="transition-colors duration-200"
            >
              Privacy
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ color: "#fff" }}
              className="transition-colors duration-200"
            >
              Terms
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ color: "#fff" }}
              className="transition-colors duration-200"
            >
              Contact
            </motion.a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © {currentYear} inSight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
