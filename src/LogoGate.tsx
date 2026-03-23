import { motion } from "motion/react";
import { Cpu, ChevronRight } from "lucide-react";

export default function LogoGate({ onUnlock }: { onUnlock: () => void }) {
    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center max-w-2xl"
            >
                <motion.div
                    className="w-24 h-24 mb-10 text-brand-primary"
                    animate={{ filter: ["drop-shadow(0 0 10px rgba(0,255,148,0.2))", "drop-shadow(0 0 30px rgba(0,255,148,0.6))", "drop-shadow(0 0 10px rgba(0,255,148,0.2))"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Cpu className="w-full h-full" />
                </motion.div>

                <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-widest text-white leading-tight">
                    Welcome to <br />
                    <span className="text-brand-primary drop-shadow-[0_0_15px_rgba(0,255,148,0.3)]">AI-THON 1.0</span>
                </h1>

                <p className="text-white/50 text-base md:text-lg mb-16 max-w-xl leading-relaxed">
                    Prepare for the future of artificial intelligence. Click below to officially inaugurate the event.
                </p>

                <button
                    onClick={onUnlock}
                    className="group relative px-10 py-5 bg-brand-primary text-brand-dark rounded-full font-bold uppercase tracking-[0.2em] text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,255,148,0.4)]"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center gap-3">
                        Officially Inaugurate
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            </motion.div>

            {/* Background glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
        </div>
    );
}
