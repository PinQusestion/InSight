const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function summarizeEmails(emails) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

        const emailContext = emails.map((mail, index) => (
            `Email #${index + 1}\nSubject: ${mail.subject}\nContent: ${mail.body || mail.snippet}`
        )).join("\n\n---\n\n");

        const prompt = `
            You are a helpful AI assistant called InSight. 
            I am providing you with my latest emails. 
            Please provide a summary of these emails. 
            Highlight any urgent actions or appointments.
            
            Emails:
            ${emailContext}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Summarization Error:", error);
        return "Could not generate summary at this time.";
    }
}

module.exports = { summarizeEmails };