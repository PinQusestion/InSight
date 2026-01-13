"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import { checkAuth } from '../../lib/api.js';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const userData = await checkAuth();
        if (userData?.user) {
          // User is already logged in, redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Failed to check auth:", error);
      }
    };

    checkUserAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[#08080c] flex relative overflow-hidden">
      {/* Left Side - Tagline & Features */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-col justify-between w-1/2 px-12 py-16 relative"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <motion.div 
            className="w-12 h-12 bg-linear-to-brrom-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all"
            whileHover={{ scale: 1.1 }}
          >
            <Mail className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-2xl font-bold text-white">inSight</span>
        </Link>

        {/* Main Content */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-6xl font-bold text-white mb-4"
          >
            Your inbox, <span className="text-cyan-400">understood</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-gray-400 mb-12 leading-relaxed"
          >
            Join thousands of professionals who have transformed their email workflow with AI-powered synthesis.
          </motion.p>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            {[
              "Get daily AI-synthesized briefings",
              "Smart categorization of all emails",
              "Privacy-first – no email storage"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-gray-300 text-lg">{feature}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 text-sm"
        >
          © 2024 inSight. All rights reserved.
        </motion.p>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:py-16"
      >
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-3">Welcome back</h2>
            <p className="text-gray-400 text-lg">Sign in to access your email briefings</p>
          </motion.div>

          {/* Google Sign In */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:border-white/20 transition-all duration-200 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </motion.button>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative flex items-center justify-center mb-8"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative bg-[#08080c] px-4 text-sm text-gray-500">or continue with</span>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors duration-200" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <Link href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors duration-200" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 mt-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign in"
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-gray-400 mt-6"
          >
            Don't have an account?{' '}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign up
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
