const emailService = require('../services/gmail.services');

async function getSummary(req, res){
  try {
    const emails = await emailService.fetchRecentEmails(
      req.user.accessToken, 
      req.user.refreshToken
    );
    res.status(200).json(emails);
  } catch (error) {
    console.error("Summary Controller Error:", error);
    res.status(500).json({ message: "Failed to fetch summaries" });
  }
};

async function getSubscriptions(req,res){
  try {
    const subs = await emailService.fetchSubscriptions(
      req.user.accessToken, 
      req.user.refreshToken
    );
    res.status(200).json(subs);
  } catch (error) {
    console.error("Subscription Controller Error:", error);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
};

async function cleanupSender(req, res){
  const { email } = req.body; // The sender's email from your list
  try {
    const result = await emailService.trashAllFromSender(
      req.user.accessToken,
      req.user.refreshToken,
      email
    );
    res.json({ message: `Successfully trashed ${result.deletedCount} emails.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to cleanup emails." });
  }
};

module.exports = {
  getSummary,
  getSubscriptions,
  cleanupSender
}