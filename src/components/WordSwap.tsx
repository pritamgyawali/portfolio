import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
interface WordSwapProps {
/** Text shown by default */
original: string;
/** Text shown while hovered/tapped */
hover: string;
className?: string;
}
/**
* A word that swaps for another word on hover (e.g. 日本語 -> "japanese").
* Reserves width for whichever text is wider so nothing reflows.
*/
export default function WordSwap({ original, hover, className = "" }: WordSwapProps) {
const [isHover, setIsHover] = useState(false);
const sizer = hover.length > original.length ? hover : original;
return (
<span
className={`relative inline-flex items-baseline justify-center align-middle ${className}`}
onMouseEnter={() => setIsHover(true)}
onMouseLeave={() => setIsHover(false)}
onTouchStart={() => setIsHover((h) => !h)}
>
{/* invisible sizer reserves the max width so layout never shifts */}
<span className="invisible whitespace-nowrap">{sizer}</span>
<AnimatePresence mode="wait">
<motion.span
key={isHover ? "hover" : "original"}
initial={{ opacity: 0, y: 3 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -3 }}
transition={{ duration: 0.13 }}
className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
>
{isHover ? hover : original}
</motion.span>
</AnimatePresence>
</span>
);
}
