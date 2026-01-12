"use client";
import { motion } from 'framer-motion';
import { Link2, Brain, FileCheck } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Link2,
      title: "Connect Your Mailbox",
      description: "Securely link your email account with OAuth. We support Gmail, Outlook, and more."
    },
    {
      icon: Brain,
      title: "AI Analyzes & Categorizes",
      description: "Our LLM reads, categorizes, and summarizes your emails in real-time."
    },
    {
      icon: FileCheck,
      title: "Review Your Briefing",
      description: "Get a structured daily briefing with all the insights you need to act fast."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="card-hover relative p-8 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 group"
            >
              {/* Step Number */}
              <div className="absolute top-4 right-4 text-5xl font-bold text-white/5 group-hover:text-cyan-500/10 transition-colors duration-300">
                {index + 1}
              </div>

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="w-14 h-14 bg-linear-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-6 border border-cyan-500/20"
              >
                <feature.icon className="w-7 h-7 text-cyan-400" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
