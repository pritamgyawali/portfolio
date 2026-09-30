import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;
app.use(express.json());
// Lazy-initialized Gemini client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
if (!aiInstance) {
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
console.warn("GEMINI_API_KEY is not configured or holds a placeholder value. Falling back to local responder mode.");
return null;
}
aiInstance = new GoogleGenAI({
apiKey: apiKey,
httpOptions: {
headers: {
"User-Agent": "aistudio-build",
},
},
});
}
return aiInstance;
}
// Background context on Pritam Gyawali to serve the Gemini bot
const PRITAM_KNOWLEDGE_BASE = `
You are the AI Assistant representing Pritam Gyawali on his personal portfolio.
You speak in a warm, professional, and slightly conversational tone, matching his tech-savvy, AI + systems builder vibe.
Make sure to speak in the first person ("I") as Pritam himself! Keep responses concise, engaging, and structured with clean markdown.
About Pritam Gyawali:
- Current Role: CSE student at Pokhara University, building his way toward becoming a tech professional. His slogan is "ships really fast."
- Core Skills: AI, Systems, Builder — software, AI, systems, and side-quest projects.
- Hometown / Location: Butwal, Nepal (बुटवल, नेपाल).
- Interests: Building things across software/AI/systems, and side quests like guitar, gym, boxing, and cooking. Also learning Japanese (日本語).
- Musical taste: Listening to curated high-quality content via pplx.fm.
Education:
- SEBS: Secondary Education, Grade 10.
- OXFORD (Oxford Secondary School): Higher Secondary, Computer Science.
Personal Projects:
1. "Music Engine": A music-shuffling/recommendation system that gives neglected tracks in a library an actual chance, instead of repeatedly cycling through the same small subset.
2. "Gym SaaS": Nepal-focused gym management software covering members, staff, equipment, accounts, offline operation and future payment integration.
3. "Athlete-X (AX)": An offline-first fitness app combining training, athlete profiling, calculations and personal tracking without ads or unnecessary cloud dependence.
4. "ui library": Accessible, minimalist React component library with smooth micro-interactions.
5. "Aisha / Skully": A personal AI system with different personalities and hardware-specific implementations, combining local models, voice interaction, tools and device automation.
6. "Forge": A modular Android-oriented Python development environment for building and running projects directly on a mobile device.
7. "Ghost Whisper": A privacy-oriented communication concept exploring mesh/local networking (Bitchat-style, LoRa/DMR/LAN/WAN) and identity privacy.
Favorite Blogs:
- "What I'm learning in 2026 (Books Edition)": A reading list mixing technical books and classical literature.
- "The Idea Behind MusicEngine": Why normal shuffle fails to explore a whole library, and how MusicEngine uses fair shuffle, contextual listening, skip feedback, mood bridges, and playlist intelligence to fix it.
If an inquiry is outside of Pritam's scope, answer it with Pritam's wit but bring the topic back to his work or projects!
`;
// API routes first
app.post("/api/chat", async (req, res) => {
const { message, history } = req.body;
if (!message) {
return res.status(400).json({ error: "Message is required" });
}
try {
const ai = getGeminiClient();
if (!ai) {
// Local fallback simulator block
const lowercaseMsg = message.toLowerCase();
let responseText = `Hi there! (Simulated response) Thanks for asking! I'm currently running in simulator mode without an API key, but here is what I can tell you: `;
if (lowercaseMsg.includes("tech") || lowercaseMsg.includes("use") || lowercaseMsg.includes("language")) {
responseText += "I specialize in AI, Systems, and Builder work! I code daily in TypeScript, React, Python, and integrate local AI models. I'm also learning Japanese.";
} else if (lowercaseMsg.includes("music") || lowercaseMsg.includes("engine")) {
responseText += "MusicEngine is my personal shuffle algorithm project — it gives less-heard tracks in your library an actual chance instead of looping the same 50 songs forever.";
} else if (lowercaseMsg.includes("project") || lowercaseMsg.includes("favorite")) {
responseText += "My favorite recent project is 'Music Engine'! It's a shuffle/recommendation system built from scratch to actually explore a whole library. I also built 'Athlete-X' and 'Gym SaaS'.";
} else if (lowercaseMsg.includes("collaborate") || lowercaseMsg.includes("contact") || lowercaseMsg.includes("hire")) {
responseText += "I'm always excited to collaborate on AI, systems, or builder-type projects! You can link up with me via GitHub, LinkedIn, Twitter, or email me at pritamgyawali89@gmail.com.";
} else {
responseText += "I'm a CSE student at Pokhara University, building things across AI, systems, and a bunch of side projects! Ask me about MusicEngine, Athlete-X, or my 2026 reading list.";
}
return res.json({ text: responseText });
}
const compiledContents: any[] = [];
// Convert client-provided simplified message history to Gemini API format
if (history && Array.isArray(history)) {
history.forEach((turn: any) => {
compiledContents.push({
role: turn.role === "user" ? "user" : "model",
parts: [{ text: turn.text || "" }]
});
});
}
// Append current user message
compiledContents.push({
role: "user",
parts: [{ text: message }]
});
const response = await ai.models.generateContent({
model: "gemini-3.5-flash",
contents: compiledContents,
config: {
systemInstruction: PRITAM_KNOWLEDGE_BASE,
temperature: 0.7,
}
});
res.json({ text: response.text || "I was unable to formulate a response. Please let me know how I can help!" });
} catch (error: any) {
console.error("Gemini API Error in Server route:", error);
res.status(500).json({ error: "Failed to fetch response from AI", details: error.message });
}
});
// Vite middleware configuration or Static files hosting
async function initializeServer() {
if (process.env.NODE_ENV !== "production") {
const vite = await createViteServer({
server: { middlewareMode: true },
appType: "spa",
});
app.use(vite.middlewares);
} else {
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
res.sendFile(path.join(distPath, "index.html"));
});
}
app.listen(PORT, "0.0.0.0", () => {
console.log(`Server fully running on http://localhost:${PORT}`);
});
}
initializeServer();
