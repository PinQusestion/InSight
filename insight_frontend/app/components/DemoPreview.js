"use client";
import { motion } from 'framer-motion';
import { Zap, AlertCircle, FileText, Mail } from 'lucide-react';

export default function DemoPreview() {
  const categories = [
    {
      icon: AlertCircle,
      title: "Urgent Actions",
      items: "3 items",
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      badgeColor: "bg-red-500/20 text-red-400",
      description: "Contract renewal from Acme Corp requires signature by Friday. Q4 budget approval pending your review. Team standup rescheduled to 2PM today."
    },
    {
      icon: FileText,
      title: "Newsletters",
      items: "12 items",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      badgeColor: "bg-cyan-500/20 text-cyan-400",
      description: "TechCrunch: OpenAI announces new model. Morning Brew: Markets rally on Fed news. Product Hunt: Top 5 launches this week."
    },
    {
      icon: Mail,
      title: "Personal",
      items: "8 items",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      badgeColor: "bg-emerald-500/20 text-emerald-400",
      description: "Dinner plans confirmed for Saturday 7PM. Flight itinerary for next week's trip attached. Package delivered to front door."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Browser Mockup */}
        <div className="browser-mockup rounded-2xl overflow-hidden shadow-2xl shadow-black/50 float-animation">
          {/* Browser Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a2e] border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-sm text-gray-500 font-mono">inbox.insight.app</span>
            </div>
          </div>

          {/* Browser Content */}
          <div className="p-6 bg-[#0d0d14]">
            {/* Daily Briefing Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Daily Briefing</h3>
                <p className="text-sm text-gray-500">Today at 9:00 AM • 47 emails synthesized</p>
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="p-4 rounded-xl bg-white/2 border border-white/5 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                        <category.icon className={`w-4 h-4 ${category.color}`} />
                      </div>
                      <span className="text-white font-medium">{category.title}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.badgeColor}`}>
                      {category.items}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed pl-11">
                    {category.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
