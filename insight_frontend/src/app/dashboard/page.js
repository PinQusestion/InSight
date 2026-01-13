"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  FileText,
  Zap,
  TrendingUp,
  AlertCircle,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Trash2,
  Loader,
} from "lucide-react";
import Link from "next/link";
import Footer from "../../components/Footer.js";
import {
  fetchEmailSummary,
  fetchSubscriptions,
  syncEmails,
  unsubscribeFromSender,
} from "../../lib/api.js";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unsubscribingEmail, setUnsubscribingEmail] = useState(null);
  const [unsubscribeSuccess, setUnsubscribeSuccess] = useState(null);

  // Fetch emails on component mount
//   useEffect(() => {
//     const loadEmails = async () => {
//       try {
//         setLoading(true);
//         const emailData = await fetchEmailSummary();
//         if (emailData.error) {
//           setError(emailData.error);
//         } else {
//           setEmails(emailData);
//         }
//       } catch (err) {
//         setError("Failed to load emails");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadEmails();
//   }, []);

  // Fetch subscriptions
  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const subData = await fetchSubscriptions();
        if (subData.error) {
          console.error(subData.error);
        } else {
          setSubscriptions(subData);
        }
      } catch (err) {
        console.error("Failed to load subscriptions", err);
      }
    };

    loadSubscriptions();
  }, []);

  // Handle sync button
  const handleSync = async () => {
    try {
      setLoading(true);
      const emailData = await syncEmails();
      if (emailData.error) {
        setError(emailData.error);
      } else {
        setEmails(emailData);
        setError(null);
      }
    } catch (err) {
      setError("Failed to sync emails");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle unsubscribe
  const handleUnsubscribe = async (senderEmail) => {
    try {
      setUnsubscribingEmail(senderEmail);
      const result = await unsubscribeFromSender(senderEmail);
      if (result.error) {
        setError(result.error);
      } else {
        // Remove from subscriptions list
        setSubscriptions(
          subscriptions.filter((sub) => sub.email !== senderEmail)
        );
        setUnsubscribeSuccess(senderEmail);
        setTimeout(() => setUnsubscribeSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to unsubscribe");
      console.error(err);
    } finally {
      setUnsubscribingEmail(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#08080c]/95 backdrop-blur-md border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-9 h-9 bg-linear-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">inSight</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/">
              <motion.div
                className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                whileHover={{ y: -2 }}
              >
                Home
              </motion.div>
            </Link>
            <motion.div
              className="text-cyan-400 font-medium cursor-pointer"
              whileHover={{ y: -2 }}
            >
              Dashboard
            </motion.div>
            <Link href="/#features">
              <motion.div
                className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                whileHover={{ y: -2 }}
              >
                Features
              </motion.div>
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/profile">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200"
              >
                <User className="w-4 h-4 inline mr-2" />
                Profile
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200"
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Settings
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 inline mr-2" />
              Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={
            mobileMenuOpen
              ? { opacity: 1, height: "auto" }
              : { opacity: 0, height: 0 }
          }
          transition={{ duration: 0.3 }}
          className="md:hidden border-t border-white/5 overflow-hidden"
        >
          <div className="px-6 py-4 space-y-3">
            <Link href="/">
              <motion.div className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">
                Home
              </motion.div>
            </Link>
            <motion.div className="px-4 py-2 rounded-lg text-cyan-400 font-medium">
              Dashboard
            </motion.div>
            <Link href="/#features">
              <motion.div className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">
                Features
              </motion.div>
            </Link>
            <hr className="border-white/10 my-3" />
            <Link href="/profile">
              <motion.div className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">
                <User className="w-4 h-4 inline mr-2" />
                Profile
              </motion.div>
            </Link>
            <motion.div className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">
              <Settings className="w-4 h-4 inline mr-2" />
              Settings
            </motion.div>
            <motion.div className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
              <LogOut className="w-4 h-4 inline mr-2" />
              Logout
            </motion.div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Main Dashboard Content */}
      <main className="min-h-screen bg-[#08080c] text-white overflow-x-hidden">
        {/* Dashboard Header */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-24 pb-8 px-6 border-b border-white/5"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Dashboard
                </h1>
                <p className="text-gray-400">
                  Overview of your email insights and analytics
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-linear-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200"
              >
                Export Report
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-8 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              {/* Emails Analyzed */}
              <motion.div variants={itemVariants} className="group">
                <div className="relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-400">
                        Emails Analyzed
                      </span>
                      <Mail className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {emails.length}
                    </div>
                    <div className="text-sm text-cyan-400">
                      ✓ Recently synced
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Subscriptions Found */}
              <motion.div variants={itemVariants} className="group">
                <div className="relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-400">
                        Subscriptions
                      </span>
                      <Zap className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {subscriptions.length}
                    </div>
                    <div className="text-sm text-cyan-400">✓ Detected</div>
                  </div>
                </div>
              </motion.div>

              {/* Inbox Health */}
              <motion.div variants={itemVariants} className="group">
                <div className="relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-400">Status</span>
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {loading ? "Loading..." : "Ready"}
                    </div>
                    <div className="text-sm text-cyan-400">
                      {error ? "⚠ Error loading" : "✓ Connected"}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3 mb-8">
              {/* Recent Emails */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 group"
              >
                <div className="relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Recent Email Summaries
                    </h2>
                    {/* AI Email Summary Feature - Coming Soon
                                        {loading ? (
                                            <div className="text-center py-8 text-gray-400">Loading emails...</div>
                                        ) : error ? (
                                            <div className="text-center py-8 text-red-400">Error: {error}</div>
                                        ) : emails.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">No emails found. Sync to load emails.</div>
                                        ) : (
                                            <div className="space-y-4">
                                                {emails.slice(0, 3).map((email, idx) => (
                                                    <div key={idx} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 border border-white/5 cursor-pointer group">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">{email.from || email.snippet?.substring(0, 30) || "Email"}</p>
                                                                <p className="text-sm text-gray-300 mt-1">{email.aiSummary || email.snippet || "No content"}</p>
                                                                <p className="text-xs text-gray-500 mt-2">Email ID: {email.id?.substring(0, 12)}...</p>
                                                            </div>
                                                            <span className="px-3 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full whitespace-nowrap">
                                                                {email.aiSummary ? "Summary" : "New"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        */}

                    {/* Coming Soon */}
                    <div className="flex flex-col items-center justify-center py-12">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mb-4"
                      >
                        <Mail className="w-12 h-12 text-cyan-400" />
                      </motion.div>
                      <p className="text-center text-gray-300 text-lg font-medium mb-2">
                        AI Email Summaries
                      </p>
                      <p className="text-center text-gray-400 text-sm">
                        Coming soon... Our AI will intelligently summarize your
                        emails for you
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-6 w-full py-2 text-sm text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-all duration-200 cursor-pointer"
                    >
                      View all emails
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Sidebar Tabs */}
              <motion.div variants={itemVariants} className="group">
                <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Tab Buttons */}
                  <div className="relative flex border-b border-white/10">
                    <button
                      onClick={() => setActiveTab("actions")}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === "actions"
                          ? "text-cyan-400 border-b-2 border-cyan-400"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Actions
                    </button>
                    <button
                      onClick={() => setActiveTab("subscriptions")}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-l border-white/10 ${
                        activeTab === "subscriptions"
                          ? "text-cyan-400 border-b-2 border-cyan-400"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Subscriptions
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="relative p-6">
                    {/* Actions Tab */}
                    {activeTab === "actions" && (
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSync}
                          disabled={loading}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
                        >
                          {loading ? "Syncing..." : "Sync Emails"}
                        </motion.button>
                        <Link href="/profile">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all duration-200 cursor-pointer"
                          >
                            View Profile
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all duration-200 cursor-pointer"
                        >
                          View Settings
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-4 py-3 rounded-lg bg-linear-to-r from-cyan-500 to-cyan-400 text-black font-semibold text-sm transition-all duration-200 mt-4 cursor-pointer"
                        >
                          Generate Report
                        </motion.button>
                      </div>
                    )}

                    {/* Subscriptions Tab */}
                    {activeTab === "subscriptions" && (
                      <div>
                        {subscriptions.length === 0 ? (
                          <div className="text-center py-8">
                            <Zap className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">
                              No subscriptions found
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              Sync emails to detect subscriptions
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {subscriptions.map((sub, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/5"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-cyan-400 truncate">
                                      {sub.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {sub.email}
                                    </p>
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleUnsubscribe(sub.email)}
                                    disabled={unsubscribingEmail === sub.email}
                                    className="flex-shrink-0 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-200 cursor-pointer disabled:opacity-50"
                                    title="Unsubscribe"
                                  >
                                    {unsubscribingEmail === sub.email ? (
                                      <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </motion.button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Insights Section */}
            <motion.div variants={itemVariants} className="group">
              <div className="relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-semibold text-white">
                      Insights & Recommendations
                    </h2>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-300">
                      💡{" "}
                      <span className="text-cyan-400">
                        Optimize subscriptions:
                      </span>{" "}
                      You have 12 inactive newsletters that could be
                      unsubscribed to reduce clutter.
                    </p>
                    <p className="text-sm text-gray-300">
                      📊{" "}
                      <span className="text-cyan-400">Peak email hours:</span>{" "}
                      Most of your emails arrive between 9 AM - 12 PM. Plan your
                      review time accordingly.
                    </p>
                    <p className="text-sm text-gray-300">
                      ⚡ <span className="text-cyan-400">Smart summary:</span>{" "}
                      Enable AI summaries to save 2+ hours per week on email
                      reading.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
