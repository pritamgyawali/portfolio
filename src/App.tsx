import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
Music,
ArrowLeft,
ChevronDown,
ChevronUp,
Github,
Twitter,
Linkedin,
Mail,
Send,
X,
MessageSquare
} from "lucide-react";
import { PROJECTS, BLOGS } from "./data";
import { BlogPost, Message } from "./types";
import HoverTooltip from "./components/HoverTooltip";
import FastReveal from "./components/FastReveal";
import WordSwap from "./components/WordSwap";
import { BlogArticleBody } from "./lib/content";
function formatFullDate(dateStr: string) {
const d = new Date(dateStr);
return d
.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
.toLowerCase();
}
function groupBlogsByMonth(blogs: BlogPost[]) {
const groups = new Map<string, BlogPost[]>();
blogs.forEach((blog) => {
const d = new Date(blog.publishDate);
const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
if (!groups.has(label)) groups.set(label, []);
groups.get(label)!.push(blog);
});
return Array.from(groups.entries())
.map(([label, posts]) => ({
label,
posts: [...posts].sort(
(a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
),
}))
.sort(
(a, b) =>
new Date(b.posts[0].publishDate).getTime() - new Date(a.posts[0].publishDate).getTime()
);
}
export default function App() {
// Navigation & View State
const [currentView, setCurrentView] = useState<"home" | "blog-index" | "blog-post">("home");
const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
const [expandedProject, setExpandedProject] = useState<string | null>(null);
// AI Chatbox State
const [isChatOpen, setIsChatOpen] = useState(false);
const [chatInput, setChatInput] = useState("");
const [messages, setMessages] = useState<Message[]>([
{
id: "initial-welcome",
role: "model",
text: "Hey! I'm Pritam's AI assistant. Ask me anything about my projects, my coursework at Pokhara University, or what I'm reading!",
timestamp: new Date()
}
]);
const [isTyping, setIsTyping] = useState(false);
const chatBottomRef = useRef<HTMLDivElement>(null);
// Suggestion prompt lists
const promptSuggestions = [
"WHAT TECHNOLOGIES DO YOU USE?",
"TELL ME ABOUT YOUR WORK AT INDUCED AI",
"WHAT'S YOUR FAVORITE PROJECT YOU'VE BUILT?",
"HOW CAN WE COLLABORATE?"
];
// Dynamic Spotify-like song tracking state
const [songProgress, setSongProgress] = useState(35);
useEffect(() => {
const timer = setInterval(() => {
setSongProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
}, 1000);
return () => clearInterval(timer);
}, []);
// Scroll to bottom on massage update
useEffect(() => {
if (chatBottomRef.current) {
chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
}
}, [messages, isTyping, isChatOpen]);
// Command + K launcher listener
useEffect(() => {
const handleKeyDown = (e: KeyboardEvent) => {
if ((e.metaKey || e.ctrlKey) && e.key === "k") {
e.preventDefault();
setIsChatOpen((prev) => !prev);
}
if (e.key === "Escape") {
setIsChatOpen(false);
}
};
window.addEventListener("keydown", handleKeyDown);
return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
// Send message to Gemini API `/api/chat`
const handleSendMessage = async (text: string) => {
if (!text.trim()) return;
// Add user message to state
const userMsg: Message = {
id: Math.random().toString(),
role: "user",
text,
timestamp: new Date()
};
setMessages((prev) => [...prev, userMsg]);
setChatInput("");
setIsTyping(true);
try {
// Map message state to expected backend structure without date objects
const historyPayload = messages.map((m) => ({
role: m.role,
text: m.text
}));
const res = await fetch("/api/chat", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ message: text, history: historyPayload })
});
const data = await res.json();
setIsTyping(false);
setMessages((prev) => [
...prev,
{
id: Math.random().toString(),
role: "model",
text: data.text || "I apologize, something went wrong processing my thoughts. Can you ask me again?",
timestamp: new Date()
}
]);
} catch (err) {
console.error("Chat fetch error:", err);
setIsTyping(false);
setMessages((prev) => [
...prev,
{
id: Math.random().toString(),
role: "model",
text: "I couldn't contact my core LLM neural server. But here's Pritam's note on the fly: I'm a CSE student at Pokhara University, building things across AI, systems, and a lot of side projects. Contact me directly at pritamgyawali89@gmail.com!",
timestamp: new Date()
}
]);
}
};
const selectSuggestion = (suggestion: string) => {
handleSendMessage(suggestion);
};
const toggleProject = (projectId: string) => {
setExpandedProject((prev) => (prev === projectId ? null : projectId));
};
const navigateTo = (view: typeof currentView) => {
setCurrentView(view);
window.scrollTo({ top: 0, behavior: "smooth" });
};
const openBlog = (id: string) => {
setSelectedBlogId(id);
setCurrentView("blog-post");
window.scrollTo({ top: 0, behavior: "smooth" });
};
return (
<div className="relative min-h-screen pb-32 pt-10 font-mono text-[#c8e6ff] selection:bg-[#00d4ff]/30 select-text">
{/* Main Content Area Container */}
<div className="relative z-10 max-w-2xl px-6 mx-auto">
{/* Navigation / Header Brand */}
{currentView === "home" && (
<header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-12 pb-6 border-b border-gray-200/60">
<div>
<h1
onClick={() => navigateTo("home")}
className="text-xl font-bold font-sans tracking-tight cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
>
Pritam Gyawali
</h1>
<div className="mt-2.5 flex items-center gap-2 flex-wrap">
<span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md border border-cyan-700/30 bg-cyan-900/30 text-cyan-300 tracking-wider">
AI • Systems • Builder
</span>
</div>
<div className="mt-4 text-sm text-cyan-200">
ships really <FastReveal />
</div>
</div>
{/* Spotify music activity simulation badge */}
<div className="w-full sm:w-auto bg-[#0a1a2e]/85 border border-cyan-800/25 shadow-xs rounded-xl p-3 flex flex-col gap-1.5 min-w-[210px] relative overflow-hidden backdrop-blur-xs">
<div className="flex items-center gap-2 text-[11px] text-cyan-400">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
</span>
<Music className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
<span>listening to <span className="font-semibold text-cyan-100">pplx.fm</span></span>
</div>
<div className="text-[10px] text-cyan-400 font-sans tracking-wide">
बुटवल, नेपाल (Butwal, Nepal)
</div>
{/* Miniature Audio track simulation */}
<div className="w-full h-[3px] bg-cyan-800/20 rounded-full mt-1.5 overflow-hidden">
<div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${songProgress}%` }}></div>
</div>
</div>
</header>
)}
{/* Dynamic Views Manager */}
<AnimatePresence mode="wait">
{currentView === "home" && (
<motion.main
key="home-view"
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -15 }}
transition={{ duration: 0.3 }}
className="space-y-12"
>
{/* Today Section */}
<section className="space-y-6">
<h2 className="text-sm font-bold text-cyan-100 uppercase tracking-widest border-b border-dashed border-cyan-700/30 pb-1.5">today</h2>
<p className="text-sm leading-relaxed text-cyan-200 font-sans">
I'm a CSE student at{" "}
<a
href="https://pu.edu.np/"
target="_blank"
rel="noopener noreferrer"
className="text-cyan-400 hover:text-cyan-200 underline decoration-cyan-600/50 hover:decoration-cyan-300 transition-colors"
>
Pokhara University
</a>
, building my way toward becoming a tech professional.
</p>
<p className="text-sm leading-relaxed text-cyan-200 font-sans">
enjoys building things that sit somewhere between software, AI, systems, and completely unnecessary{" "}
<HoverTooltip
content={
<div className="flex flex-col items-center text-center min-w-[220px]">
<div className="flex gap-2.5 text-xl mb-2.5 flex-wrap justify-center max-w-[220px]">
<span className="hover:scale-115 transition-transform duration-200 cursor-default">🎸</span>
<span className="hover:scale-115 transition-transform duration-200 cursor-default">💪</span>
<span className="hover:scale-115 transition-transform duration-200 cursor-default">🥊</span>
<span className="hover:scale-115 transition-transform duration-200 cursor-default">🍳</span>
</div>
<p className="text-[10px] font-mono tracking-wider text-cyan-500 uppercase font-bold">
Side quests
</p>
</div>
}
>
Rabbit Holes
</HoverTooltip>. My projects range from music algorithms and gym management software to offline AI assistants, game logic, developer tools, and communication systems. and I'm also learning{" "}
<WordSwap original="日本語" hover="japanese" className="static-underline font-mono" />.
</p>
</section>
{/* Past work Section */}
<section className="space-y-4">
<h2 className="text-sm font-bold text-cyan-100 uppercase tracking-widest border-b border-dashed border-cyan-700/30 pb-1.5">past</h2>
<div className="space-y-2.5">
<div className="flex items-center gap-2 text-sm">
<a
href="https://www.sebs.edu.np/"
target="_blank"
rel="noopener noreferrer"
className="font-bold text-cyan-100 hover:text-cyan-400 underline decoration-cyan-700/40 transition-colors"
>
SEBS
</a>
<span className="text-cyan-500">—</span>
<span className="text-xs text-cyan-300">Secondary Education • Grade 10</span>
</div>
<div className="flex items-center gap-2 text-sm">
<a
href="https://www.oxfordsecondaryschool.edu.np/"
target="_blank"
rel="noopener noreferrer"
className="font-bold text-cyan-100 hover:text-cyan-400 underline decoration-cyan-700/40 transition-colors"
>
OXFORD
</a>
<span className="text-cyan-500">—</span>
<span className="text-xs text-cyan-300">Higher Secondary • Computer Science</span>
</div>
</div>
</section>
{/* Personal Projects Section */}
<section className="space-y-4">
<h2 className="text-sm font-bold text-cyan-100 uppercase tracking-widest border-b border-dashed border-cyan-700/30 pb-1.5">personal projects</h2>
<div className="border border-cyan-800/30 bg-[#0a1a2e]/85 backdrop-blur-xs rounded-xl divide-y divide-cyan-800/30 overflow-hidden shadow-xs">
{PROJECTS.map((project) => {
const isExpanded = expandedProject === project.id;
return (
<div key={project.id} className="transition-all">
<button
onClick={() => toggleProject(project.id)}
className="w-full flex justify-between items-center px-4 py-3.5 text-left hover:bg-cyan-950/60 transition-colors cursor-pointer group"
>
<span className="font-bold text-cyan-100 group-hover:text-cyan-500 transition-colors">{project.title}</span>
<div className="flex items-center gap-2 text-cyan-500">
<span className="hidden sm:inline-flex gap-1.5 flex-shrink-0">
{project.tags.map((tag) => (
<span key={tag} className="text-[9px] px-1.5 py-0.5 border border-cyan-800/30 rounded bg-cyan-950/50 text-cyan-400">
{tag}
</span>
))}
</span>
<span className="sm:hidden text-[9px] px-1.5 py-0.5 border border-cyan-800/30 rounded bg-cyan-950/50 text-cyan-400">
{project.tags[0]}
</span>
{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
</div>
</button>
<AnimatePresence initial={false}>
{isExpanded && (
<motion.div
initial={{ height: 0, opacity: 0 }}
animate={{ height: "auto", opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: "easeInOut" }}
className="overflow-hidden"
>
<div className="px-4 pb-5 pt-1 border-t border-cyan-800/15 font-mono text-xs text-cyan-300 space-y-4">
{project.image && (
<div className="relative rounded-lg overflow-hidden border border-cyan-700/40 bg-cyan-900/30 aspect-video group">
<img
src={project.image}
alt={project.title}
referrerPolicy="no-referrer"
className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500"
/>
<div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 via-transparent pointer-events-none" />
</div>
)}
<p className="leading-relaxed font-sans text-cyan-300">
{project.description}
</p>
{project.links && (
<div className="flex flex-wrap gap-4 text-[11px] font-sans">
{project.links.map((link) => (
<a
key={link.label}
href={link.url}
target="_blank"
rel="noopener noreferrer"
className="inline-flex items-center gap-1 text-cyan-500 hover:text-cyan-600 font-medium underline decoration-cyan-600/50 hover:decoration-cyan-600 transition-all cursor-pointer"
>
↗ {link.label}
</a>
))}
</div>
)}
</div>
</motion.div>
)}
</AnimatePresence>
</div>
);
})}
</div>
</section>
{/* Recent Blogs Section */}
<section className="space-y-4">
<button
onClick={() => navigateTo("blog-index")}
className="w-full flex justify-between items-center border-b border-dashed border-cyan-700/30 pb-1.5 cursor-pointer group"
>
<h2 className="text-sm font-bold text-cyan-100 uppercase tracking-widest group-hover:text-cyan-500 transition-colors">recent blogs ↗</h2>
</button>
<div className="space-y-4">
{BLOGS.map((blog) => (
<div
key={blog.id}
onClick={() => openBlog(blog.id)}
className="bg-cyan-950/70 hover:bg-[#0a1a2e] border border-cyan-800/25 shadow-2xs hover:shadow-sm rounded-xl p-4 cursor-pointer transition-all duration-200 border-l-3 border-l-cyan-400 group"
>
<div className="flex justify-between items-start gap-4 mb-2">
<h3 className="font-bold text-sm text-cyan-100 group-hover:text-cyan-500 transition-colors uppercase font-mono tracking-tight leading-snug">
{blog.title}
</h3>
<span className="text-[10px] text-cyan-500 whitespace-nowrap bg-cyan-900/30 px-2 py-0.5 rounded font-mono">
{formatFullDate(blog.publishDate)}
</span>
</div>
<p className="text-xs text-cyan-400 font-sans leading-relaxed">
{blog.subtitle}
</p>
</div>
))}
</div>
</section>
{/* Links Footer Section */}
<section className="space-y-4">
<h2 className="text-sm font-bold text-cyan-100 uppercase tracking-widest border-b border-dashed border-cyan-700/30 pb-1.5">links</h2>
<div className="flex flex-wrap gap-5 text-sm">
<a
href="https://github.com/pritamgyawali"
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-100 hover:scale-102 transition-all font-bold"
>
<Github className="w-4 h-4 text-cyan-100" /> github
</a>
<a
href="https://x.com/PritamOg"
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-100 hover:scale-102 transition-all font-bold"
>
<Twitter className="w-4 h-4 text-cyan-400" /> x/twitter
</a>
<a
href="https://linkedin.com/in/pritamgyawali"
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-100 hover:scale-102 transition-all font-bold"
>
<Linkedin className="w-4 h-4 text-blue-600" /> linkedin
</a>
<a
href="mailto:pritamgyawali89@gmail.com"
className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-100 hover:scale-102 transition-all font-bold"
>
<Mail className="w-4 h-4 text-red-500" /> email
</a>
</div>
</section>
</motion.main>
)}
{/* Blog Index Listing Page */}
{currentView === "blog-index" && (
<motion.article
key="blog-index-view"
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.3 }}
className="space-y-8 font-sans"
>
<div className="font-mono text-xs">
<button
onClick={() => navigateTo("home")}
className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-100 cursor-pointer font-bold transition-all"
>
<ArrowLeft className="w-3.5 h-3.5" /> Home
</button>
</div>
<h1 className="text-xl font-bold font-mono tracking-tight text-cyan-100">Blog</h1>
<div className="space-y-2">
<h2 className="text-sm font-bold text-cyan-100 border-b border-dashed border-cyan-700/30 pb-1.5">why i write these?</h2>
<p className="text-sm leading-relaxed text-cyan-300">
I write these to share my thoughts about projects, my learnings and experiences with the world.
</p>
</div>
<div className="timeline">
{groupBlogsByMonth(BLOGS).map((group) =>
group.posts.map((blog) => (
<div
key={blog.id}
onClick={() => openBlog(blog.id)}
className="timeline-item cursor-pointer group"
>
<div className="timeline-date">{formatFullDate(blog.publishDate)}</div>
<div className="timeline-content">
<div className="bg-cyan-950/40 hover:bg-cyan-900/30 border border-cyan-800/30 hover:border-cyan-600/40 shadow-2xs hover:shadow-sm rounded-xl p-4 transition-all duration-200">
<h3 className="font-bold text-sm text-cyan-100 group-hover:text-cyan-300 transition-colors uppercase font-mono tracking-tight leading-snug mb-2">
{blog.title}
</h3>
<p className="text-xs text-cyan-400 font-sans leading-relaxed">
{blog.subtitle}
</p>
</div>
</div>
</div>
))
)}
</div>
</motion.article>
)}
{/* Blog Post Detail View */}
{currentView === "blog-post" && selectedBlogId && (() => {
const post = BLOGS.find((b) => b.id === selectedBlogId);
if (!post) return null;
return (
<motion.article
key={post.id}
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.3 }}
className="space-y-8 font-sans"
>
<div className="flex justify-between items-center font-mono text-xs">
<button
onClick={() => navigateTo("home")}
className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-100 cursor-pointer font-bold transition-all border border-cyan-700/30 rounded px-2 py-1 bg-[#0a1a2e] shadow-3xs"
>
<ArrowLeft className="w-3.5 h-3.5" /> Back to Home
</button>
<span className="text-cyan-500 bg-cyan-900/30 border border-cyan-800/30 px-2.5 py-0.5 rounded">
{formatFullDate(post.publishDate)}
</span>
</div>
<div>
<h1 className="text-2xl font-bold font-sans tracking-tight text-cyan-50 uppercase">
{post.title}
</h1>
<svg className="w-24 h-4 text-cyan-400 mt-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 100 20">
<path d="M0,10 Q12.5,0 25,10 T50,10 T75,10 T100,10" />
</svg>
</div>
<BlogArticleBody blocks={post.body} />
</motion.article>
);
})()}
</AnimatePresence>
</div>
{/* Floating AI chat drawer positioned fixed at viewport bottom */}
<div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/95 to-[#0a0f1e]/0 flex justify-center">
<div className="w-full max-w-2xl bg-[#0a1a2e]/95 hover:bg-[#0f2238] border border-cyan-800/30 shadow-md rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300">
<AnimatePresence>
{isChatOpen && (
<motion.div
initial={{ height: 0, opacity: 0 }}
animate={{ height: "420px", opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.3, ease: "easeInOut" }}
className="flex flex-col border-b border-cyan-800/15"
>
{/* Chat window Header controls */}
<div className="flex justify-between items-center px-4 py-2 bg-cyan-950/50 border-b border-cyan-800/30">
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"></span>
<span className="text-xs font-mono font-bold text-cyan-100">INTERACTIVE INTERVIEW WITH SURAJ</span>
</div>
<button
onClick={() => setIsChatOpen(false)}
className="text-cyan-500 hover:text-cyan-200 bg-[#0a1a2e] hover:bg-cyan-900/30 p-1 rounded-md border border-cyan-800/30 cursor-pointer transition-colors"
title="Press ESC to close"
>
<X className="w-3.5 h-3.5" />
</button>
</div>
{/* Message logs scrolling list */}
<div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
{messages.map((item) => {
const isUser = item.role === "user";
return (
<div key={item.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
<div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed shadow-3xs ${
isUser
? "bg-cyan-500 text-white rounded-br-none"
: "bg-cyan-900/40 text-cyan-100 border border-cyan-700/50 rounded-bl-none font-mono text-[11px]"
}`}>
<div className="whitespace-pre-line font-medium leading-relaxed">{item.text}</div>
</div>
</div>
);
})}
{isTyping && (
<div className="flex justify-start">
<div className="bg-cyan-900/30 border border-cyan-700/50 rounded-xl rounded-bl-none px-4 py-2.5 flex items-center gap-1">
<span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
<span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
<span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"></span>
</div>
</div>
)}
<div ref={chatBottomRef} />
</div>
{/* Suggestions launcher listing */}
<div className="px-4 py-2.5 bg-cyan-950/60 border-t border-cyan-800/15 flex flex-nowrap gap-2 overflow-x-auto select-none no-scrollbar">
{promptSuggestions.map((suggestion) => (
<button
key={suggestion}
onClick={() => selectSuggestion(suggestion)}
className="whitespace-nowrap flex-shrink-0 text-[10px] font-mono tracking-tight text-cyan-300 hover:text-cyan-100 bg-[#0a1a2e] border border-cyan-800/30 hover:border-cyan-600/40 active:bg-cyan-950/50 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
>
{suggestion}
</button>
))}
</div>
</motion.div>
)}
</AnimatePresence>
{/* Interactive Input form field */}
<form
onSubmit={(e) => {
e.preventDefault();
handleSendMessage(chatInput);
}}
onClick={() => { if(!isChatOpen) setIsChatOpen(true); }}
className="flex items-center gap-3 p-3 cursor-pointer"
>
<MessageSquare className="w-5 h-5 text-cyan-500 flex-shrink-0 pl-1" />
<input
type="text"
placeholder="Ask about me, work or send a message!"
value={chatInput}
onChange={(e) => setChatInput(e.target.value)}
className="flex-1 text-xs outline-none bg-transparent font-mono text-[#c8e6ff] placeholder-neutral-400/80 cursor-text"
/>
{/* Command-K Shortcut indicator badge */}
<div className="hidden sm:flex items-center gap-1.5 text-[9px] text-cyan-500 font-sans border border-cyan-800/30 bg-[#0a1a2e] px-2 py-1 rounded-md shadow-3xs flex-shrink-0">
<span>⌘ K</span>
</div>
<button
type="submit"
disabled={!chatInput.trim()}
className="text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 p-2 rounded-xl transition-all cursor-pointer flex-shrink-0 shadow-xs"
>
<Send className="w-3.5 h-3.5" />
</button>
</form>
{/* Disclaimer details sub-bar */}
<div className="bg-cyan-950/70 border-t border-cyan-800/15 px-4 py-1.5 text-[8px] text-cyan-500 font-sans leading-relaxed tracking-tight flex flex-col sm:flex-row justify-between items-start gap-1">
<span>Everyone makes mistakes, including this AI powered by Google's Gemini 3.5 Flash. Check context-aware content.</span>
<span className="text-[7.5px] uppercase text-cyan-400 font-mono">Locate LLMs.txt</span>
</div>
</div>
</div>
</div>
);
}
