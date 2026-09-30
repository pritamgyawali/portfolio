export interface Project {
id: string;
title: string;
tags: string[];
description: string;
image?: string;
links?: {
label: string;
url: string;
}[];
}
export type ContentBlock =
| { type: "p"; text: string }
| { type: "heading"; text: string }
| { type: "items"; items: { left: string; right?: string }[] }
| { type: "quote"; text: string }
| { type: "tweet"; name: string; handle: string; text: string };
export interface BlogPost {
id: string;
title: string;
subtitle: string;
publishDate: string;
body: ContentBlock[];
}
export interface Message {
id: string;
role: "user" | "model";
text: string;
timestamp: Date;
}
