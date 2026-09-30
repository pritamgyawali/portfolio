import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
/**
* "fast." — on hover the word swaps for a car zipping across with a
* couple of speed-lines, then reverts. Fixed-width box  text-neutral-900  so nothing reflows.
*/
export default function FastReveal() {
const [hover, setHover] = useState(false);
return (
<span
className="relative inline-flex items-baseline align-middle h-[1.3em] w-[3.6em] overflow-hidden"
onMouseEnter={() => setHover(true)}
onMouseLeave={() => setHover(false)}
onTouchStart={() => setHover((h) => !h)}
>
<AnimatePresence mode="wait">
{!hover ? (
<motion.span
key="text"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.12 }}
className="italic wavy-underline text-[#a9d8ff] font-semibold font-sans absolute left-0 top-0"
>
fast.
</motion.span>
) : (
<motion.span
key="vroom"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.12 }}
className="absolute inset-0 flex items-center wavy-underline"
>
<motion.span
className="absolute flex flex-col gap-[3px]"
initial={{ x: "160%", opacity: 0 }}
animate={{ x: "-60%", opacity: [0, 1, 1, 0] }}
transition={{ duration: 0.5, ease: "easeIn" }}
>
<span className="w-3 h-[1.5px] bg-neutral-400 rounded-full" />
<span className="w-2 h-[1.5px] bg-neutral-300 rounded-full self-end" />
</motion.span>
<motion.span
className="absolute text-[15px] leading-none"
initial={{ x: "160%", rotate: 0 }}
animate={{ x: "-8%" }}
transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
>
🏎️
</motion.span>
</motion.span>
)}
</AnimatePresence>
</span>
);
}
