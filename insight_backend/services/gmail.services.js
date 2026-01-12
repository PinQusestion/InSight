const { google } = require("googleapis");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-09-2025",
});

// Helper to create the OAuth2 Client
const createOAuthClient = (accessToken, refreshToken, userId) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  oauth2Client.on("tokens", async (tokens) => {
    try {
      const updateData = {};
      if (tokens.access_token) updateData.accessToken = tokens.access_token;
      
      if (tokens.refresh_token) updateData.refreshToken = tokens.refresh_token;

      if (Object.keys(updateData).length > 0 && userId) {
        await User.findByIdAndUpdate(userId, updateData);
        console.log(`Database updated with refreshed tokens for user: ${userId}`);
      }
    } catch (err) {
      console.error("Failed to update tokens in database:", err);
    }
  });

  return oauth2Client;
};

// fetching emails
async function fetchRecentEmails(accessToken, refreshToken, userId, limit = 10) {
  const auth = createOAuthClient(accessToken, refreshToken, userId);
  const gmail = google.gmail({ version: "v1", auth });

  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: limit,
  });
  const messages = response.data.messages || [];

  return Promise.all(
    messages.map(async (msg) => {
      const detail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });
      const snippet = detail.data.snippet;
      const body = detail.data.payload.body.data
        ? Buffer.from(detail.data.payload.body.data, "base64").toString()
        : snippet;

      // --- AI Logic Starts Here ---
      const prompt = `
            You are an expert Inbox Manager. Summarize the following email for a dashboard view.
  
            RULES:
                - Max 10 words.
                - Highlight the ACTION ITEM (e.g., "Meeting at 2pm" or "Bill due tomorrow").
                - If it's a newsletter, mention the main topic.
                - Return the result in JSON format.

            EMAIL BODY:
          "${body}"
        `;
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      });

      const aiData = JSON.parse(result.response.text());

      return {
        id: msg.id,
        snippet: snippet,
        aiSummary: aiData.summary,
        from: detail.data.payload.headers.find((h) => h.name === "From")?.value,
      };
    })
  );
}

// fetching subscriptions
async function fetchSubscriptions(accessToken, refreshToken, userId) {
  const auth = createOAuthClient(accessToken, refreshToken, userId);
  const gmail = google.gmail({ version: "v1", auth });
  const subscriptionsMap = new Map();

    const listRes = await gmail.users.messages.list({
      userId: "me",
      q: "unsubscribe",
      maxResults: 50,
    });

  const messages = listRes.data.messages || [];
  const details = await Promise.all(
    messages.map((msg) =>
      gmail.users.messages.get({ userId: "me", id: msg.id, format: "metadata" })
    )
  );

  details.forEach((res) => {
    const headers = res.data.payload.headers;
    const from = headers.find((h) => h.name === "From")?.value || "";
    const unsub =
      headers.find((h) => h.name.toLowerCase() === "list-unsubscribe")?.value ||
      "";

    if (unsub) {
      const email = from.match(/<([^>]+)>/)?.[1] || from;
      const urlMatch = unsub.match(/<(https?:\/\/[^>]+)>/);

      if (urlMatch && !subscriptionsMap.has(email)) {
        subscriptionsMap.set(email, {
          name: from.split("<")[0].replace(/"/g, "").trim(),
          email: email,
          unsubscribeUrl: urlMatch[1],
        });
      }
    }
  });

  return Array.from(subscriptionsMap.values());
}

// moving the subscriber emails to trash
async function trashAllFromSender(accessToken, refreshToken, userId, senderEmail){
  const auth = createOAuthClient(accessToken, refreshToken, userId);
  const gmail = google.gmail({ version: 'v1', auth });

  // 1. Search for all emails from this specific sender
  const searchRes = await gmail.users.messages.list({
    userId: 'me',
    q: `from:${senderEmail}`
  });

  const messageIds = (searchRes.data.messages || []).map(m => m.id);

  if (messageIds.length === 0) return { deletedCount: 0 };

  // 2. Move all found IDs to Trash
  await gmail.users.messages.batchModify({
    userId: 'me',
    resource: {
      ids: messageIds,
      addLabelIds: ['TRASH'],
      removeLabelIds: ['INBOX']
    }
  });

  return { deletedCount: messageIds.length };
};

module.exports = {
  fetchRecentEmails,
  fetchSubscriptions,
  trashAllFromSender
};
