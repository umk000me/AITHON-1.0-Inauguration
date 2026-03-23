import { useState } from "react";
import { motion } from "motion/react";

export default function LogoGate({ onUnlock }: { onUnlock: () => void }) {
    const [curtainsOpen, setCurtainsOpen] = useState(false);

    const handleCurtainClick = () => {
        if (curtainsOpen) return;
        setCurtainsOpen(true);
        // After curtain animation completes, unlock
        setTimeout(() => onUnlock(), 1800);
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-center px-6 overflow-hidden">
            {/* "Click to Inaugurate" hint text - visible before curtains open */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: curtainsOpen ? 0 : 1 }}
                transition={{ duration: 0.5, delay: curtainsOpen ? 0 : 1 }}
                className="absolute z-[60] text-white/70 text-lg md:text-2xl font-bold uppercase tracking-[0.3em] pointer-events-none"
            >
                Click the Curtains to Inaugurate
            </motion.div>

            {/* Left Curtain */}
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: curtainsOpen ? "-100%" : 0 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={handleCurtainClick}
                className="absolute top-0 left-0 w-1/2 h-full z-50 cursor-pointer border-r-[1px] border-[#00ff94]/30"
                style={{
                    background: "linear-gradient(to right, #022415, #0a4f32, #022415)",
                    boxShadow: curtainsOpen ? "none" : "15px 0px 50px rgba(0,0,0,1)"
                }}
            >
                {/* Curtain fold lines */}
                <div className="flex w-full h-full opacity-60">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex-1 h-full bg-gradient-to-r from-black/70 via-transparent to-black/70" />
                    ))}
                </div>
                {/* Curtain bottom drape */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>

            {/* Right Curtain */}
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: curtainsOpen ? "100%" : 0 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={handleCurtainClick}
                className="absolute top-0 right-0 w-1/2 h-full z-50 cursor-pointer border-l-[1px] border-[#00ff94]/30"
                style={{
                    background: "linear-gradient(to left, #022415, #0a4f32, #022415)",
                    boxShadow: curtainsOpen ? "none" : "-15px 0px 50px rgba(0,0,0,1)"
                }}
            >
                {/* Curtain fold lines */}
                <div className="flex w-full h-full opacity-60">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex-1 h-full bg-gradient-to-l from-black/70 via-transparent to-black/70" />
                    ))}
                </div>
                {/* Curtain bottom drape */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>

            {/* Curtain rod at top */}
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#0a4f32] to-transparent z-[55]" />

            {/* Background glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
        </div>
    );
}
