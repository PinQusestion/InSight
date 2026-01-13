"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader, Inbox, LogOut, Settings, Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import Footer from "../../components/Footer.js";
import { fetchEmailSummary, checkAuth, logout } from "../../lib/api.js";
import { useRouter } from "next/navigation";

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

export default function ProfilePage() {
    const router = useRouter();
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);

    // Check auth and load user data
    useEffect(() => {
        const checkAuthAndLoadData = async () => {
            try {
                const authData = await checkAuth();
                if (!authData || !authData.user) {
                    router.push("/login");
                    return;
                }
                setUser(authData.user);
            } catch (err) {
                console.error("Auth check error:", err);
                router.push("/login");
            }
        };

        checkAuthAndLoadData();
    }, [router]);

    // Fetch last 10 emails
    useEffect(() => {
        const loadEmails = async () => {
            try {
                setLoading(true);
                const emailData = await fetchEmailSummary();
                if (emailData.error) {
                    setError(emailData.error);
                } else {
                    // Get last 5 emails with mock summaries
                    const mockEmails = Array.isArray(emailData) ? emailData.slice(0, 5).map((email, idx) => ({
                        ...email,
                        aiSummary: generateMockSummary(idx)
                    })) : [];
                    setEmails(mockEmails);
                }
            } catch (err) {
                setError("Failed to load emails");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadEmails();
    }, []);

    // Copy email to clipboard
    const copyToClipboard = (email) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    // Handle logout
    const handleLogout = async () => {
        await logout();
        router.push("/");
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
                        <Link href="/dashboard">
                            <motion.div
                                className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                                whileHover={{ y: -2 }}
                            >
                                Dashboard
                            </motion.div>
                        </Link>
                        <Link href="/#features">
                            <motion.div
                                className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                                whileHover={{ y: -2 }}
                            >
                                Features
                            </motion.div>
                        </Link>
                    </div>

                    {/* Back Button */}
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </motion.button>
                    </Link>
                </div>
            </motion.nav>

            {/* Main Content */}
            <main className="min-h-screen bg-[#08080c] text-white overflow-x-hidden">
                {/* Profile Header Section */}
                <motion.section
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="pt-24 pb-12 px-6 border-b border-white/5"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-start justify-between gap-6 flex-wrap">
                            <div>
                                <h1 className="text-5xl font-bold text-white mb-3">My Account</h1>
                                <p className="text-gray-400 text-lg">
                                    {user ? `Welcome back, ${user.name}` : "Loading profile..."}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </motion.button>
                        </div>
                    </div>
                </motion.section>

                {/* Account Info & Stats Grid */}
                {user && (
                    <motion.section
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="py-12 px-6"
                    >
                        <div className="max-w-7xl mx-auto">
                            <div className="grid gap-6 md:grid-cols-3 mb-8">
                                {/* Name Card */}
                                <motion.div variants={itemVariants} className="group">
                                    <div className="relative p-6 rounded-xl bg-linear-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-cyan-400">{user.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Name</p>
                                                <p className="text-lg font-semibold text-white truncate">{user.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Email Card */}
                                <motion.div variants={itemVariants} className="group">
                                    <div className="relative p-6 rounded-xl bg-linear-to-brrom-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Email Address</p>
                                                <p className="text-sm font-semibold text-white truncate mt-1">{user.email}</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => copyToClipboard(user.email)}
                                                className="shrink-0 p-2 text-purple-400 hover:text-purple-300 transition-colors"
                                            >
                                                {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Account Status Card */}
                                <motion.div variants={itemVariants} className="group">
                                    <div className="relative p-6 rounded-xl bg-linear-to-br from-green-500/10 to-transparent border border-green-500/20 hover:border-green-500/50 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Status</p>
                                                <p className="text-lg font-semibold text-green-400">Active</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* Email Summary Section */}
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="py-12 px-6"
                >
                    <div className="max-w-7xl mx-auto">
                        <motion.div variants={itemVariants} className="group">
                            <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-white/5 to-transparent border border-white/10">
                                {/* Header */}
                                <div className="px-8 py-6 border-b border-white/10">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                                <Inbox className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">Last 5 Emails</h2>
                                                <p className="text-sm text-gray-400 mt-1">Full email content view</p>
                                            </div>
                                        </div>
                                        <span className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20">
                                            {emails.length} emails
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-8 py-6">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-16">
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                                <Loader className="w-8 h-8 text-cyan-400" />
                                            </motion.div>
                                            <p className="text-gray-400 mt-4 text-center">Fetching your latest emails...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                                <Mail className="w-8 h-8 text-red-400" />
                                            </div>
                                            <p className="text-red-400 font-medium">Error loading emails</p>
                                            <p className="text-gray-400 text-sm mt-2">{error}</p>
                                        </div>
                                    ) : emails.length === 0 ? (
                                        <div className="text-center py-16">
                                            <div className="w-16 h-16 rounded-full bg-gray-500/10 flex items-center justify-center mx-auto mb-4">
                                                <Mail className="w-8 h-8 text-gray-500" />
                                            </div>
                                            <p className="text-gray-400 text-lg font-medium">No emails yet</p>
                                            <p className="text-gray-500 text-sm mt-2">Sync your emails from the dashboard to see them here</p>
                                            <Link href="/dashboard">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="mt-4 px-6 py-2 bg-cyan-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                                                >
                                                    Go to Dashboard
                                                </motion.button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                            {emails.map((email, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.06 }}
                                                    onClick={() => setSelectedEmail(selectedEmail === idx ? null : idx)}
                                                    className="p-5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer group"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0">
                                                            <span className="text-sm font-bold text-white">
                                                                {(email.from?.charAt(0) || 'M').toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors truncate text-sm">
                                                                        {email.from || "Unknown Sender"}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-1">Email #{idx + 1}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-200 leading-relaxed line-clamp-2 mb-2">
                                                                {email.snippet || "No content available"}
                                                            </p>
                                                            {selectedEmail === idx && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="mt-3 pt-3 border-t border-white/10"
                                                                >
                                                                    <div className="space-y-2">
                                                                        <div>
                                                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Full Content</p>
                                                                            <p className="text-sm text-gray-200 mt-2 leading-relaxed">{email.snippet}</p>
                                                                        </div>
                                                                        <div className="pt-2 mt-2 border-t border-white/5">
                                                                            <p className="text-xs text-gray-500">ID: {email.id}</p>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                {selectedEmail === idx ? "Click to collapse" : "Click to expand"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Footer Spacing */}
                <div className="py-8" />
            </main>

            <Footer />
        </>
    );
}
