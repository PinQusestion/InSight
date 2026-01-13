"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Clock,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Inbox,
  Lightbulb,
  AlertCircle,
  Trash2,
  Loader,
} from "lucide-react";
import Link from "next/link";
import {
  fetchEmailSummary,
  fetchSubscriptions,
  syncEmails,
  unsubscribeFromSender,
  checkAuth,
  logout,
} from "../../lib/api.js";

// Mock summary generator (temporary until Gemini API quota is restored)
const generateMockSummary = (index) => {
  const summaries = [
    "🔴 Action Required: Review and approve the Q4 budget proposal by Friday. Financial impact: $50K.",
    "📊 Report: Monthly analytics show 25% increase in user engagement. Key metric: DAU up 12%.",
    "💼 Meeting: Team standup at 2 PM. Discuss Q1 roadmap and sprint planning priorities.",
    "🎯 Notification: Your subscription renewal is due. Current plan includes 100 emails/day limit.",
    "⏰ Reminder: Quarterly review meeting scheduled for tomorrow at 10 AM. Please prepare feedback.",
  ];
  return summaries[index % summaries.length];
};

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [emails, setEmails] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [expandedBriefing, setExpandedBriefing] = useState(0);
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [unsubscribingEmail, setUnsubscribingEmail] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await checkAuth();
        if (!userData || !userData.user) {
          router.push("/login");
          return;
        }
        setUser(userData.user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login");
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadEmails = async () => {
      try {
        setLoading(true);
        const emailData = await fetchEmailSummary();
        if (emailData?.error) {
          setError(emailData.error);
          if (emailData.error.includes("Not authenticated")) {
            router.push("/login");
          }
        } else {
          // Add mock summaries to emails
          const emailsWithMocks = (emailData || []).map((email, idx) => ({
            ...email,
            aiSummary: generateMockSummary(idx)
          }));
          setEmails(emailsWithMocks);
        }
      } catch (err) {
        console.error("Failed to load emails:", err);
        setError("Failed to load emails");
      } finally {
        setLoading(false);
      }
    };
    loadEmails();
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadSubscriptions = async () => {
      try {
        const subData = await fetchSubscriptions();
        if (subData?.error) {
          console.error("Failed to load subscriptions:", subData.error);
          if (subData.error.includes("Not authenticated")) {
            router.push("/login");
          }
        } else {
          setSubscriptions(subData || []);
        }
      } catch (err) {
        console.error("Failed to load subscriptions:", err);
      }
    };
    loadSubscriptions();
  }, [isAuthenticated, router]);

  const handleSync = async () => {
    try {
      setLoading(true);
      const emailData = await syncEmails();
      if (emailData?.error) {
        setError(emailData.error);
      } else {
        setEmails(emailData || []);
        setError(null);
      }
    } catch (err) {
      setError("Failed to sync emails");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleUnsubscribe = async (senderEmail) => {
    try {
      setUnsubscribingEmail(senderEmail);
      const result = await unsubscribeFromSender(senderEmail);
      if (result?.error) {
        setError(result.error);
      } else {
        // Remove the subscription from the list
        setSubscriptions(subscriptions.filter((sub) => sub.email !== senderEmail));
        setError(null);
      }
    } catch (err) {
      setError("Failed to unsubscribe");
      console.error(err);
    } finally {
      setUnsubscribingEmail(null);
    }
  };

  const sidebarLinks = [
    { icon: BarChart3, label: "Dashboard", active: true },
    { icon: Inbox, label: "Inbox", active: false },
    { icon: Lightbulb, label: "Insights", active: false },
    { icon: User, label: "Profile", href: "/profile", active: false },
    { icon: Mail, label: "Subscriptions", onClick: () => setShowSubscriptions(!showSubscriptions), active: false },
  ];

  // Calculate stats from email data
  const emailCount = emails.length;
  const urgentCount = subscriptions.length;
  const timeSavedPerEmail = 2; // minutes
  const totalTimeSaved = emailCount * timeSavedPerEmail;
  
  // Email categories calculation
  const emailCategories = {
    newsletters: Math.round((emails.filter(e => e.category === 'newsletter').length / emailCount) * 100) || 12,
    work: Math.round((emails.filter(e => e.category === 'work').length / emailCount) * 100) || 28,
    personal: Math.round((emails.filter(e => e.category === 'personal').length / emailCount) * 100) || 20,
    financial: Math.round((emails.filter(e => e.category === 'financial').length / emailCount) * 100) || 12,
    other: Math.round((emails.filter(e => e.category === 'other').length / emailCount) * 100) || 5,
  };
  
  // Productivity score based on emails processed
  const baseProductivity = 70;
  const productivityBoost = Math.min(emailCount * 2, 24);
  const productivity = Math.min(baseProductivity + productivityBoost, 100);

  const briefings = [
    {
      title: "Today's Briefing",
      date: "January 13, 2026",
      time: "9:00 AM",
      count: emailCount || 0,
      tag: "Latest",
      color: "from-cyan-400 to-cyan-600",
    },
    {
      title: "Yesterday's Briefing",
      date: "January 12, 2026",
      time: "9:00 AM",
      count: Math.max(emailCount - 5, 0),
      color: "from-cyan-500 to-cyan-700",
    },
  ];

  const actionItems = subscriptions.slice(0, 4).map((sub, idx) => ({
    icon: idx < 2 ? "🔴" : "⚪",
    title: sub.name || sub.email || "Unknown sender",
    time: idx < 2 ? "Today" : "Later",
  })).concat(
    [
      { icon: "⚪", title: "Team standup", time: "2:00 PM" },
      { icon: "⚪", title: "Quarterly planning prep", time: "Monday" },
    ].slice(0, Math.max(0, 4 - subscriptions.length))
  );

  // Generate weekly activity data
  const weeklyActivityData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (day, idx) => ({
      day,
      // Create varying heights based on email count distribution (deterministic, no Math.random())
      height: Math.max(10, Math.min(100, ((emailCount || 5) + (idx * Math.floor(emailCount / 7)) + (idx * 3))))
    })
  );

  // Show loading state while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08080c] text-white flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-lg bg-linear-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
            <Mail className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-gray-400">Authenticating...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed left-0 top-0 h-screen w-64 bg-[#0f0f15] border-r border-white/5 z-40 hidden lg:flex flex-col pt-8 px-6"
      >
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-linear-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">inSight</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {sidebarLinks.map((link, idx) => {
            const NavContent = (
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  link.active
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{link.label}</span>
              </motion.div>
            );

            return link.onClick ? (
              <button
                key={idx}
                onClick={link.onClick}
                className="block w-full text-left"
              >
                {NavContent}
              </button>
            ) : (
              <Link key={idx} href={link.href || "#"} className="block">
                {NavContent}
              </Link>
            );
          })}
        </nav>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20 mb-8"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed top-0 right-0 left-0 lg:left-64 h-20 bg-[#08080c]/95 backdrop-blur-md border-b border-white/5 z-30 px-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search emails, briefings..."
                className="bg-transparent text-sm placeholder-gray-500 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>

            <Link href="/profile">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "J"}
                  </span>
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.name || "John Doe"}
                </span>
              </motion.div>
            </Link>
          </div>
        </motion.header>

        {/* Page Content */}
        <div className="pt-24 px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold mb-2">
                Good morning, {user?.name?.split(" ")[0] || "John"}
              </h1>
              <p className="text-gray-400">
                Here's your inbox briefing for today. You have{" "}
                <span className="text-cyan-400 font-semibold">{urgentCount} urgent {urgentCount === 1 ? "item" : "items"}</span> requiring
                attention.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: Mail,
                  label: "Emails Today",
                  value: emailCount.toString(),
                  change: emailCount > 0 ? `+${Math.floor(emailCount * 0.25)}` : "0",
                  color: "cyan",
                },
                {
                  icon: AlertCircle,
                  label: "Urgent Actions",
                  value: urgentCount.toString(),
                  change: urgentCount > 0 ? `+${Math.max(1, Math.floor(urgentCount * 0.5))}` : "0",
                  color: "red",
                },
                {
                  icon: Clock,
                  label: "Time Saved",
                  value: `${totalTimeSaved}min`,
                  change: totalTimeSaved > 0 ? `+${Math.floor(totalTimeSaved * 0.2)}min` : "0min",
                  color: "cyan",
                },
                {
                  icon: BarChart3,
                  label: "Productivity",
                  value: `${Math.min(productivity, 100)}%`,
                  change: `+${Math.floor(productivity * 0.05)}%`,
                  color: "green",
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-gray-400 font-medium">
                      {stat.label}
                    </span>
                    <stat.icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div
                      className={`text-xs mt-1 ${
                        stat.color === "red"
                          ? "text-red-400"
                          : "text-cyan-400"
                      }`}
                    >
                      {stat.change}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Your Briefings */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-semibold">Your Briefings</h2>
                  </div>

                  <div className="space-y-3">
                    {briefings.map((briefing, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        onClick={() =>
                          setExpandedBriefing(
                            expandedBriefing === idx ? -1 : idx
                          )
                        }
                        className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <div
                                className={`w-6 h-6 rounded bg-linear-to-br ${briefing.color}`}
                              ></div>
                              <h3 className="font-semibold text-white">
                                {briefing.title}
                              </h3>
                              {briefing.tag && (
                                <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-300 rounded">
                                  {briefing.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {briefing.date} • {briefing.count} emails
                              synthesized at {briefing.time}
                            </p>
                          </div>
                          <motion.div
                            animate={{
                              rotate:
                                expandedBriefing === idx ? 180 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          </motion.div>
                        </div>

                        {expandedBriefing === idx && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-white/5 text-sm text-gray-300"
                          >
                            <p className="mb-3">
                              AI-synthesized summary of {briefing.count}{" "}
                              emails from today, highlighting key action items
                              and important information.
                            </p>
                            <button 
                              onClick={() => alert(`Briefing ${idx + 1} Summary:\n\n${generateMockSummary(idx)}`)}
                              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                            >
                              View Full Briefing →
                            </button>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Email Categories */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <h2 className="text-xl font-semibold mb-6">
                    Email Categories
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Newsletters",
                        percentage: emailCategories.newsletters,
                        color: "from-cyan-400 to-cyan-600",
                      },
                      {
                        label: "Work",
                        percentage: emailCategories.work,
                        color: "from-orange-400 to-orange-600",
                      },
                      {
                        label: "Personal",
                        percentage: emailCategories.personal,
                        color: "from-blue-400 to-blue-600",
                      },
                      {
                        label: "Financial",
                        percentage: emailCategories.financial,
                        color: "from-green-400 to-green-600",
                      },
                      {
                        label: "Other",
                        percentage: emailCategories.other,
                        color: "from-gray-400 to-gray-600",
                      },
                    ].map((cat, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">
                            {cat.label}
                          </span>
                          <span className="text-sm font-medium text-cyan-400">
                            {cat.percentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${cat.percentage}%`,
                            }}
                            transition={{
                              delay: 0.7 + idx * 0.1,
                              duration: 0.8,
                            }}
                            className={`h-full bg-linear-to-r ${cat.color}`}
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Connected Accounts */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <h2 className="text-xl font-semibold mb-6">
                    Connected Accounts
                  </h2>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Gmail",
                        email: user?.email || "Not connected",
                        time: "Synced 2 min ago",
                      },
                      {
                        name: "Outlook",
                        email: user?.secondaryEmail || "Not connected",
                        time: "Synced 5 min ago",
                      },
                    ].map((account, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {account.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {account.email}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {account.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Action Items */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <AlertCircle className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-semibold">Action Items</h2>
                  </div>

                  <div className="space-y-3">
                    {actionItems.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <span className="text-lg mt-1">{item.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSync}
                      disabled={loading}
                      className="w-full px-4 py-3 text-sm font-medium rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all disabled:opacity-50"
                    >
                      {loading ? "Syncing..." : "Sync Emails"}
                    </motion.button>
                    <Link href="/profile" className="block">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 text-sm font-medium rounded-lg bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-all"
                      >
                        View Profile
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 text-sm font-medium rounded-lg bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-all"
                    >
                      Generate Report
                    </motion.button>
                  </div>
                </motion.div>

                {/* Weekly Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Weekly Activity
                  </h3>
                  <div className="flex items-end justify-between gap-1 h-24">
                    {weeklyActivityData.map((data, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-2 flex-1"
                        >
                          <div className="w-full bg-white/5 rounded-t-lg overflow-hidden">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{
                                height: `${data.height}%`,
                              }}
                              transition={{
                                delay: 0.8 + idx * 0.08,
                                duration: 0.6,
                              }}
                              className="w-full bg-linear-to-t from-cyan-400 to-cyan-600"
                            ></motion.div>
                          </div>
                          <p className="text-xs text-gray-500">{data.day}</p>
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscriptions Modal/Panel */}
        {showSubscriptions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-0"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#08080c] border border-white/10 rounded-xl w-full lg:w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#0f0f15] border-b border-white/10 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Manage Subscriptions</h2>
                <button
                  onClick={() => setShowSubscriptions(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {subscriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No subscriptions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {subscriptions.map((sub, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-white">
                            {sub.name || sub.email || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {sub.email}
                          </p>
                          {sub.unsubscribeUrl && (
                            <p className="text-xs text-gray-600 mt-2">
                              Click to unsubscribe
                            </p>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUnsubscribe(sub.email)}
                          disabled={unsubscribingEmail === sub.email}
                          className="ml-4 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
                        >
                          {unsubscribingEmail === sub.email ? (
                            <>
                              <Loader className="w-3 h-3 animate-spin" />
                              Unsubscribing...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3" />
                              Unsubscribe
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
