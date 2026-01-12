const emailService = require('../services/gmail.services');

async function getSummary(req, res){
  try {
    const emails = await emailService.fetchRecentEmails(
      req.user.accessToken, 
      req.user.refreshToken,
      req.user._id
    );
    res.status(200).json(emails);
  } catch (error) {
    console.error("Summary Controller Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch summaries" });
  }
};

async function getSubscriptions(req,res){
  try {
    const subs = await emailService.fetchSubscriptions(
      req.user.accessToken, 
      req.user.refreshToken,
      req.user._id
    );
    res.status(200).json(subs);
  } catch (error) {
    console.error("Subscription Controller Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch subscriptions" });
  }
};

async function cleanupSender(req, res){
  const { email } = req.body; // The sender's email from your list
  
  // Input validation
  if (!email || typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  try {
    const result = await emailService.trashAllFromSender(
      req.user.accessToken,
      req.user.refreshToken,
      req.user._id,
      email
    );
    res.json({ message: `Successfully trashed ${result.deletedCount} emails.` });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to cleanup emails." });
  }
};

module.exports = {
  getSummary,
  getSubscriptions,
  cleanupSender
}