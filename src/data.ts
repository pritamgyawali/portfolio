import { Project, BlogPost } from "./types";

export const PROJECTS: Project[] = [
{
id: "music-engine",
title: "Music Engine",
tags: ["Music", "Algorithms", "Recommendation"],
description:
"A music-shuffling/recommendation system designed around giving neglected tracks an actual chance instead of repeatedly cycling through the same tiny subset. While ignoring others.",
image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
links: [
{ label: "live", url: "https://pritamgyawali.github.io/musicengine" },
{ label: "code", url: "https://github.com/pritamgyawali/musicengine" },
],
},
{
id: "gym-saas",
title: "Gym SaaS",
tags: ["SAAS", "Supabase", "Vercel"],
description:
"Nepal-focused gym management software covering members, staff, equipment, accounts, offline operation and future payment integration.",
image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
links: [
{ label: "live", url: "https://pritamgyawali.github.io/crush/goout.html" },
{ label: "code", url: "https://github.com/pritamgyawali/nexisfitness" },
{ label: "demo", url: "https://youtu.be/ENTjZEBd74A?si=kkc3HAc4guJ7Sn5u" },
],
},
{
id: "athlete-x",
title: "Athlete-X (AX)",
tags: ["Android", "Fitness", "Offline"],
description:
"An offline-first fitness application combining training, athlete profiling, calculations and personal tracking without ads or unnecessary cloud dependence.",
image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
links: [
{ label: "live", url: "https://pritamgyawali.github.io/crush/goout.html" },
{ label: "code", url: "https://github.com/pritamgyawali/AX" },
],
},
{
id: "ui-library",
title: "ui library",
tags: ["UI"],
description:
"A modular, accessible React component library crafted with high-fidelity micro-interactions and extremely clean, minimal layouts.",
image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
links: [
{ label: "live", url: "https://Pritamgyawali.github.io/systemui" },
{ label: "code", url: "https://github.com/pritamgyawali/systemui" },
],
},
{
id: "aisha-skully",
title: "Aisha / Skully",
tags: ["Agentic", "Automation", "AI"],
description:
"A personal AI system with different personalities and hardware-specific implementations, combining local models, voice interaction, tools and device automation.",
image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80",
links: [
{ label: "live", url: "https://pritamgyawali.github.io/crush/goout.html" },
{ label: "code", url: "https://github.com/pritamgyawali/aisha" },
],
},
{
id: "forge",
title: "Forge",
tags: ["Android", "Python", "Dev Tools"],
description:
"A modular Android-oriented Python development environment designed around building and running simple projects directly from and on a mobile device.",
image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
links: [{ label: "live", url: "https://pritamgyawali.github.io/crush/goout.html" }],
},
{
id: "ghost-whisper",
title: "Ghost Whisper",
tags: ["Networking", "Privacy", "Communication"],
description:
"A privacy-oriented communication concept derived from mesh/local communication ideas, exploring Bitchat-style networking, LoRa/DMR/LAN/WAN possibilities and identity privacy.",
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
links: [{ label: "live", url: "https://pritamgyawali.github.io/crush/goout.html" }],
},
];

export const BLOGS: BlogPost[] = [
{
id: "books-2026",
title: "what i'm learning in 2026 (books edition)",
subtitle: "subtitle here",
publishDate: "2025-12-26",
body: [
{ type: "heading", text: "TECHNICAL BOOKS" },
{ type: "p", text: "paragraph:" },
{
type: "items",
items: [{ left: "Bullet point1" }, { left: "2" }, { left: "3" }],
},
{ type: "p", text: "paragraph hereeeeeeeeee hehe" },
{
type: "p",
text: "second paragraph beech this bp is getting too much coverage, i'll keep metamorphosis by franz kafka here hehe.",
},
{ type: "heading", text: "CLASSICAL COLLECTION" },
{ type: "p", text: "Rickroll? naah, just another paragraph : ) :" },
{
type: "items",
items: [{ left: "bp1" }, { left: "bp2" }, { left: "bp3" }, { left: "bp4" }],
},
{ type: "heading", text: "THE PLAN" },
{ type: "p", text: "finally, d end, seeya" },
],
},
{
id: "music-engine-idea",
title: "the idea behind MusicEngine",
subtitle: "why I built a music player with personal shuffle algorithm from scratch?",
publishDate: "2026-09-29",
body: [
{
type: "p",
text: "I noticed something while using YouTube Music. Its shuffle kept circling around the same handful of songs while huge parts of my library could go unheard for months.",
},
{ type: "p", text: "The problem wasn't that I didn't have enough music." },
{ type: "p", text: "**The problem was that shuffle wasn't actually exploring my library.**" },
{
type: "p",
text: "Once a song had proven itself popular, it kept getting selected. The songs that weren't selected never got the opportunity to prove themselves in the first place.",
},
{ type: "heading", text: "THE PROBLEM" },
{
type: "p",
text: "Normal shuffle treats every song as an isolated item. It doesn't really understand that listening is a sequence.",
},
{
type: "p",
text: "You can go from one song into something completely different in tempo or energy, and the transition feels terrible. You can also repeatedly hear the same familiar songs while other tracks in your library effectively disappear.",
},
{
type: "p",
text: "And when I skip something, a skip doesn't necessarily mean \"I don't like this song.\" Maybe it didn't fit the current mood. Maybe I've heard it too many times. Maybe I simply wanted something else.",
},
{
type: "p",
text: "So I wanted a system that could distinguish between those situations instead of treating every skip as the same signal.",
},
{ type: "heading", text: "THE SOLUTION" },
{ type: "p", text: "So I built MusicEngine." },
{ type: "p", text: "The idea is simple: **give songs a chance before deciding they don't belong.**" },
{
type: "p",
text: "Instead of letting a small group of historically successful tracks dominate shuffle forever, MusicEngine keeps track of what has actually been listened to and deliberately gives less-heard tracks opportunities to appear.",
},
{ type: "p", text: "A track isn't permanently rejected just because it wasn't played before. It has to actually fail in the current context." },
{
type: "p",
text: "The engine also considers listening context. What I listen to at a particular hour can influence what gets played around that hour, with separate behavior for weekdays and weekends.",
},
{ type: "heading", text: "HOW IT WORKS" },
{
type: "p",
text: "MusicEngine analyzes the library and builds a profile for each track, including BPM, energy, and valence. It then combines those audio characteristics with actual listening behavior. The current implementation uses librosa for audio analysis and stores playback and skip history in SQLite.",
},
{
type: "items",
items: [
{
left: "Fair Shuffle",
right:
"balances preferred, normal, and least-listened tracks so the same songs don't monopolize the queue. Tracks with low play counts are deliberately given opportunities instead of being ignored forever.",
},
{
left: "Contextual Listening",
right:
"learns which tracks tend to be played around particular hours and distinguishes weekday behavior from weekend behavior. Hourly scoring uses Gaussian time weighting rather than treating every historical play equally.",
},
{
left: "Skip Feedback",
right:
"when a track is skipped, the system can record whether it was overplayed, didn't fit the mood, was simply something else the listener wanted, or had no specific reason. Those signals don't all affect the engine in the same way.",
},
{
left: "Mood Bridges",
right:
"when two consecutive tracks differ too much in BPM or energy, the engine can find intermediate tracks and use them as bridges instead of throwing the listener directly from one musical state into another.",
},
{
left: "Playlist Intelligence",
right: "playlists can generate suggestions by comparing BPM, energy, valence, and genre against the existing playlist.",
},
{
left: "Local First",
right:
"the system is built around a local music library and local SQLite data rather than requiring a cloud recommendation service. The current architecture uses FastAPI, SQLite, React, and Vite.",
},
],
},
{ type: "heading", text: "WHY I BUILT THIS" },
{ type: "p", text: "Honestly, I didn't set out to build another music player." },
{ type: "p", text: "I just got tired of shuffle behaving like it had a favorite 50 songs and absolutely no interest in the rest of my library." },
{ type: "p", text: "I wanted something that would actually explore." },
{ type: "p", text: "The philosophy is basically this:" },
{ type: "p", text: "**Don't assume a song is bad because it hasn't proven itself yet. Give it a chance.**" },
{
type: "p",
text: "If I skip it because it doesn't fit my mood, remember that context. If I've heard it too many times, reduce its exposure. If I simply wanted something else, don't punish the song for it.",
},
{
type: "p",
text: "And when two songs don't naturally belong next to each other, don't just pretend human ears are a random-number generator. Find a bridge.",
},
{
type: "p",
text: "The current system already has the foundations for that: playback history, explicit skip feedback, contextual scoring, audio-feature analysis, preference tracking, and transition handling.",
},
{
type: "p",
text: "I'm deliberately making the present version simpler to execute, though, because I want to **stop using the shuffle I'm trying to replace before spending months perfecting its replacement**.",
},
{ type: "p", text: "The goal isn't to build the world's most complicated recommendation system." },
{ type: "p", text: "**It's to make shuffle actually shuffle.**" },
],
},
];
