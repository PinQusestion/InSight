// const { google } = require("googleapis");
// const User = require("../models/User");
// const { summarizeEmails } = require("../services/api.services");

// async function getRecentEmails(req, res) {
//   try {
//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       process.env.GOOGLE_REDIRECT_URI
//     );

//     oauth2Client.setCredentials({
//       access_token: req.user.accessToken,
//       refresh_token: req.user.refreshToken,
//     });

//     oauth2Client.on("tokens", async (tokens) => {
//       if (tokens.access_token) {
//         await User.findByIdAndUpdate(req.user.id, {
//           accessToken: tokens.access_token,
//         });
//         console.log("Database updated with new refreshed access token.");
//       }
//     });

//     const gmail = google.gmail({ version: "v1", auth: oauth2Client });

//     // 1. Fetch the list of messages
//     const listResponse = await gmail.users.messages.list({
//       userId: "me",
//       maxResults: 10,
//       q: "category:primary",
//     });

//     const messages = listResponse.data.messages || [];

//     // 2. Fetch full details for each message
//     const emailDetails = await Promise.all(
//       messages.map(async (msg) => {
//         const mail = await gmail.users.messages.get({
//           userId: "me",
//           id: msg.id,
//         });
//         const subject =
//           mail.data.payload.headers.find((h) => h.name === "Subject")?.value ||
//           "No Subject";

//         // Decoding the body from Base64 so it's readable text
//         let body = "";
//         if (mail.data.payload.parts) {
//           const textPart = mail.data.payload.parts.find(
//             (p) => p.mimeType === "text/plain"
//           );
//           body = textPart?.body?.data
//             ? Buffer.from(textPart.body.data, "base64").toString()
//             : "";
//         } else {
//           body = mail.data.payload.body?.data
//             ? Buffer.from(mail.data.payload.body.data, "base64").toString()
//             : "";
//         }

//         return {
//           id: msg.id,
//           subject,
//           snippet: mail.data.snippet,
//           body: body.substring(0, 1000), // Keep it short for the AI
//         };
//       })
//     );

//     const briefing = await summarizeEmails(emailDetails);

//     res.json({
//       count: emailDetails.length,
//       briefing: briefing,
//       rawEmails: emailDetails,
//     });
//   } catch (err) {
//     console.error("Error fetching emails:", err);
//     // If the error is specific to tokens, it might mean the user needs to re-log
//     if (err.code === 401) {
//       return res
//         .status(401)
//         .json({ error: "Tokens expired. Please log in again." });
//     }
//     res.status(500).json({ error: "Failed to fetch emails" });
//   }
// }

// async function getAllSubscriptions(req, res) {
//   try {
//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       process.env.GOOGLE_REDIRECT_URI
//     );

//     oauth2Client.setCredentials({
//       access_token: req.user.accessToken,
//       refresh_token: req.user.refreshToken,
//     });

//     oauth2Client.on("tokens", async (tokens) => {
//       if (tokens.access_token) {
//         await User.findByIdAndUpdate(req.user.id, {
//           accessToken: tokens.access_token,
//         });
//         console.log("Database updated with new refreshed access token.");
//       }
//     });

//     const gmail = google.gmail({
//       version: "v1",
//       auth: oauth2Client,
//     });

//     const response = await gmail.users.messages.list({
//       userId: "me",
//       q: "has:list-unsubscribe",
//       maxResults: 50,
//     });

//     const messages = response.data.messages || [];
//     const subscriptions = new Map();

//     for (const msg of messages) {
//       const detail = await gmail.users.messages.get({
//         userId: "me",
//         id: msg.id,
//         format: "metadata",
//         metadataHeaders: ["From", "List-Unsubscribe", "Subject"],
//       });

//       const headers = detail.data.payload.header;
//       const fromHeader = headers.find((h) => h.name === "From")?.value || "";
//       const unsubHeader =
//         headers.find((h) => h.name.toLowerCase() === "list-unsubscribe")
//           ?.value || "";

//       if (unsubHeader) {
//         // Extract clean name and email
//         const name = fromHeader.split("<")[0].replace(/"/g, "").trim();
//         const email = fromHeader.match(/<([^>]+)>/)?.[1] || fromHeader;

//         // Extract the URL (ignore the mailto for now for simplicity)
//         const urlMatch = unsubHeader.match(/<(https?:\/\/[^>]+)>/);
//         const unsubUrl = urlMatch ? urlMatch[1] : null;

//         // Only add if we haven't seen this sender yet AND we found a URL
//         if (!subscriptionsMap.has(email) && unsubUrl) {
//           subscriptionsMap.set(email, {
//             senderName: name || email,
//             senderEmail: email,
//             unsubscribeUrl: unsubUrl,
//             lastSubject: headers.find((h) => h.name === "Subject")?.value,
//           });
//         }
//       }
//     }
//     return Array.from(subscriptionsMap.values());
//   } catch (err) {
//     console.error("Error fetching subscriptions:", err);
//     // If the error is specific to tokens, it might mean the user needs to re-log
//     if (err.code === 401) {
//       return res
//         .status(401)
//         .json({ error: "Tokens expired. Please log in again." });
//     }
//     res.status(500).json({ error: "Failed to fetch subscriptions" });
//   }
// }

// module.exports = { getRecentEmails };


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