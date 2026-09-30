import { useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
interface HoverTooltipProps {
/** The underlined trigger word/phrase */
children: ReactNode;
/** Tooltip body content */
content: ReactNode;
/** Extra classes on the trigger span (e.g. font-bold for experience items) */
triggerClassName?: string;
/** Horizontal alignment of the floating card relative to the trigger */
align?: "center" | "start";
}
/**
* A word/phrase with a minimal underline that reveals a small floating
* tooltip card on hover (desktop) or tap (touch devices).
* Repurposed across "travelling", "mentor", "judge", and each "past" entry.
*/
export default function HoverTooltip({
children,
content,
triggerClassName = "",
align = "center",
}: HoverTooltipProps) {
const [open, setOpen] = useState(false);
const closeTimer = useRef<number | null>(null);
const show = () => {
if (closeTimer.current) window.clearTimeout(closeTimer.current);
setOpen(true);
};
const scheduleHide = () => {
closeTimer.current = window.setTimeout(() => setOpen(false), 140);
};
const alignClasses =
align === "center"
? "left-1/2 -translate-x-1/2"
: "left-0";
return (
<span
className="relative inline-block"
onMouseEnter={show}
onMouseLeave={scheduleHide}
>
<span
onClick={() => setOpen((o) => !o)}
className={`minimal-underline cursor-pointer transition-colors ${triggerClassName}`}
>
{children}
</span>
<AnimatePresence>
{open && (
<motion.div
initial={{ opacity: 0, y: 6, scale: 0.97 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 6, scale: 0.97 }}
transition={{ duration: 0.15, ease: "easeOut" }}
onMouseEnter={show}
onMouseLeave={scheduleHide}
className={`absolute z-50 bottom-full mb-3 ${alignClasses} w-max max-w-[min(85vw,300px)] rounded-2xl bg-[#18181c] text-[#f5f5f4] border border-[#2d2d34] shadow-2xl px-4 py-3`}
>
{content}
<span
className={`absolute top-full w-2.5 h-2.5 bg-[#18181c] border-b border-r border-[#2d2d34] rotate-45 -mt-1.5 ${
align === "center" ? "left-1/2 -translate-x-1/2" : "left-4"
}`}
/>
</motion.div>
)}
</AnimatePresence>
</span>
);
}
