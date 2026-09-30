import { Fragment } from "react";
import { ContentBlock } from "../types";
import HoverTooltip from "../components/HoverTooltip";

// Matches, in order of precedence: {{tooltip: ... }}, [text](url), **bold**
const INLINE_PATTERN =
/\{\{tooltip:\s*([^|}]+?)\s*\|(?:\s*icons:\s*([^|}]+?)\s*\|)?\s*note:\s*([^}]+?)\}\}|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

function TooltipContent({ icons, note }: { icons?: string; note: string }) {
return (
<div className="flex flex-col items-center text-center min-w-[200px]">
{icons && (
<div className="flex gap-2.5 text-xl mb-2.5 flex-wrap justify-center max-w-[220px]">
{icons
.trim()
.split(/\s+/)
.map((icon, idx) => (
<span key={idx} className="hover:scale-115 transition-transform duration-200 cursor-default">
{icon}
</span>
))}
</div>
)}
<p className="text-[10px] font-mono tracking-wider text-cyan-500 uppercase font-bold">{note}</p>
</div>
);
}

// Parses a plain string for {{tooltip:}}, [links](url), and **bold** into React nodes.
export function renderInline(text: string) {
const nodes: React.ReactNode[] = [];
let lastIndex = 0;
let match: RegExpExecArray | null;
let key = 0;
INLINE_PATTERN.lastIndex = 0;
while ((match = INLINE_PATTERN.exec(text)) !== null) {
if (match.index > lastIndex) {
nodes.push(<Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>);
}
const [, tipLabel, tipIcons, tipNote, linkText, linkUrl, boldText] = match;
if (tipLabel !== undefined) {
nodes.push(
<HoverTooltip key={key++} content={<TooltipContent icons={tipIcons} note={tipNote.trim()} />}>
{tipLabel.trim()}
</HoverTooltip>
);
} else if (linkText !== undefined) {
nodes.push(
<a
key={key++}
href={linkUrl}
target="_blank"
rel="noopener noreferrer"
className="text-cyan-400 hover:text-cyan-200 underline decoration-cyan-600/50 hover:decoration-cyan-300 transition-colors"
>
{linkText}
</a>
);
} else if (boldText !== undefined) {
nodes.push(
<strong key={key++} className="text-cyan-100 font-bold">
{boldText}
</strong>
);
}
lastIndex = INLINE_PATTERN.lastIndex;
}
if (lastIndex < text.length) {
nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
}
return nodes;
}

// Renders a full array of ContentBlocks (blog post body).
export function BlogArticleBody({ blocks }: { blocks: ContentBlock[] }) {
return (
<div className="space-y-5 font-sans">
{blocks.map((block, idx) => {
if (block.type === "heading") {
return (
<h3
key={idx}
className="text-sm font-bold font-mono tracking-widest text-cyan-50 uppercase pt-6 border-t border-cyan-800/20"
>
{block.text}
</h3>
);
}
if (block.type === "p") {
return (
<p key={idx} className="text-sm leading-relaxed text-cyan-300">
{renderInline(block.text)}
</p>
);
}
if (block.type === "items") {
return (
<div key={idx} className="space-y-2.5 text-sm text-cyan-200">
{block.items.map((item, i) => (
<div key={i} className="flex items-start gap-2.5">
<span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
<p className="leading-relaxed">
{item.right ? (
<>
<strong className="text-cyan-100 font-bold">{renderInline(item.left)}</strong>{" "}
{renderInline(item.right)}
</>
) : (
renderInline(item.left)
)}
</p>
</div>
))}
</div>
);
}
if (block.type === "quote") {
return (
<div
key={idx}
className="bg-cyan-950/50 p-4 rounded-xl border border-cyan-800/25 text-sm text-cyan-300 italic leading-relaxed"
>
"{renderInline(block.text)}"
</div>
);
}
if (block.type === "tweet") {
return (
<div key={idx} className="bg-[#0a1a2e]/85 border border-cyan-800/30 rounded-xl p-4 space-y-2">
<div className="flex items-center gap-2 text-xs">
<span className="font-bold text-cyan-100">{block.name}</span>
<span className="text-cyan-500">{block.handle}</span>
</div>
<p className="text-sm text-cyan-300 leading-relaxed">{renderInline(block.text)}</p>
</div>
);
}
return null;
})}
</div>
);
}
