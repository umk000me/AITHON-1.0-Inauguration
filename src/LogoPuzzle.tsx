import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, RefreshCw, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Piece {
  id: number;       // correct slot index (0-8)
  label: string;
  emoji: string;
  color: string;
}

// ─── Puzzle Config ────────────────────────────────────────────────────────────
const GRID = 3; // 3×3
const PIECES: Piece[] = [
  { id: 0, label: "Innovation", emoji: "💡", color: "#00FF94" },
  { id: 1, label: "Knowledge",  emoji: "📚", color: "#7000FF" },
  { id: 2, label: "Technology", emoji: "⚙️", color: "#00BFFF" },
  { id: 3, label: "AI",         emoji: "🧠", color: "#FF6B6B" },
  { id: 4, label: "AITHON",     emoji: "🏫", color: "#FFD700" },
  { id: 5, label: "Research",   emoji: "🔬", color: "#00FF94" },
  { id: 6, label: "Excellence", emoji: "⭐", color: "#FF8C00" },
  { id: 7, label: "Community",  emoji: "🤝", color: "#7000FF" },
  { id: 8, label: "Future",     emoji: "🚀", color: "#00FF94" },
];

const SLIDES = [
  { src: "/images/slideshow_1.png", caption: "AI Innovation Lab" },
  { src: "/images/slideshow_2.png", caption: "Award Ceremony" },
  { src: "/images/slideshow_3.png", caption: "Campus Collaboration" },
  { src: "/images/college_logo.png", caption: "AI-THON 1.0" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateTone(ctx: AudioContext, freq: number, duration: number, startTime: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq;
  osc.type = "sine";
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playCelebrationMusic(ctx: AudioContext) {
  // Triumphant ascending chord sequence
  const melody = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
  melody.forEach((freq, i) => {
    generateTone(ctx, freq, 0.5, ctx.currentTime + i * 0.18);
  });
  // Harmony
  const harmony = [196.00, 246.94, 293.66, 392.00, 493.88, 587.33, 784.00];
  harmony.forEach((freq, i) => {
    generateTone(ctx, freq, 0.5, ctx.currentTime + i * 0.18 + 0.09);
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** A floating particle for the celebration effect */
const Particle = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <motion.div
    className="absolute w-3 h-3 rounded-full pointer-events-none"
    style={{ left: x, top: y, backgroundColor: color }}
    initial={{ opacity: 1, scale: 1, y: 0, x: 0 }}
    animate={{
      opacity: 0,
      scale: 0,
      y: -(Math.random() * 200 + 100),
      x: (Math.random() - 0.5) * 300,
    }}
    transition={{ duration: 1.5, ease: "easeOut" }}
  />
);

/** Individual puzzle tile */
const PuzzleTile = ({
  piece,
  onClick,
  isSelected,
  isCorrect,
  isEmpty,
}: {
  piece: Piece | null;
  onClick: () => void;
  isSelected: boolean;
  isCorrect: boolean;
  isEmpty: boolean;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={piece ? { scale: 1.05, zIndex: 10 } : {}}
    whileTap={piece ? { scale: 0.95 } : {}}
    className="relative aspect-square rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer select-none outline-none transition-all duration-300"
    style={{
      background: isEmpty
        ? "rgba(255,255,255,0.03)"
        : isCorrect
        ? "linear-gradient(135deg, rgba(0,255,148,0.25), rgba(0,255,148,0.10))"
        : isSelected
        ? "linear-gradient(135deg, rgba(112,0,255,0.4), rgba(0,191,255,0.2))"
        : "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
      border: isEmpty
        ? "2px dashed rgba(255,255,255,0.12)"
        : isCorrect
        ? "2px solid rgba(0,255,148,0.8)"
        : isSelected
        ? "2px solid rgba(112,0,255,0.9)"
        : "2px solid rgba(255,255,255,0.1)",
      boxShadow: isCorrect
        ? "0 0 20px rgba(0,255,148,0.4), inset 0 0 20px rgba(0,255,148,0.05)"
        : isSelected
        ? "0 0 20px rgba(112,0,255,0.5)"
        : "none",
    }}
    animate={
      isCorrect
        ? { scale: [1, 1.08, 1], transition: { duration: 0.4 } }
        : {}
    }
  >
    {piece && (
      <>
        <motion.span
          className="text-3xl md:text-4xl"
          animate={isCorrect ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {piece.emoji}
        </motion.span>
        <span
          className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider"
          style={{ color: piece.color }}
        >
          {piece.label}
        </span>
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ background: "rgba(112,0,255,0.15)" }}
          />
        )}
      </>
    )}
    {isEmpty && (
      <span className="text-white/20 text-xl">✦</span>
    )}
  </motion.button>
);

/** Infinite slideshow */
const Slideshow = ({ muted, onToggleMute }: { muted: boolean; onToggleMute: () => void }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [go]);

  const slide = SLIDES[current];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto mt-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1">
          <motion.h3
            className="text-2xl md:text-3xl font-black uppercase tracking-widest"
            style={{
              background: "linear-gradient(135deg, #00FF94, #7000FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎉 Congratulations! Puzzle Solved!
          </motion.h3>
          <p className="text-white/50 text-sm mt-1 uppercase tracking-widest font-mono">
            The AI-THON Gallery
          </p>
        </div>
        <button
          onClick={onToggleMute}
          className="ml-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-brand-primary" />}
        </button>
      </div>

      {/* Slideshow frame */}
      <div className="relative rounded-3xl overflow-hidden aspect-video bg-black/40"
        style={{ border: "2px solid rgba(0,255,148,0.3)", boxShadow: "0 0 60px rgba(0,255,148,0.2)" }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={slide.src}
              alt={slide.caption}
              className="w-full h-full object-cover"
            />
            {/* Caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6"
              style={{ background: "linear-gradient(to top, rgba(5,5,5,0.9) 0%, transparent 100%)" }}
            >
              <motion.p
                className="text-white font-bold text-lg tracking-wider uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {slide.caption}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <button
          onClick={() => go(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-brand-primary hover:text-brand-dark transition-all z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-brand-primary hover:text-brand-dark transition-all z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                backgroundColor: i === current ? "#00FF94" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LogoPuzzle() {
  const [slots, setSlots] = useState<(Piece | null)[]>(() => Array(GRID * GRID).fill(null));
  const [tray, setTray] = useState<Piece[]>(() => shuffle(PIECES));
  const [selected, setSelected] = useState<{ source: "tray" | "slot"; index: number } | null>(null);
  const [solved, setSolved] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Check if puzzle is solved
  const checkSolved = useCallback((currentSlots: (Piece | null)[]) => {
    const allFilled = currentSlots.every((p) => p !== null);
    if (!allFilled) return false;
    return currentSlots.every((p, i) => p?.id === i);
  }, []);

  // Celebration particles
  const celebrate = useCallback(() => {
    const colors = ["#00FF94", "#7000FF", "#FFD700", "#FF6B6B", "#00BFFF"];
    const rect = boardRef.current?.getBoundingClientRect();
    const cx = rect ? rect.width / 2 : 200;
    const cy = rect ? rect.height / 2 : 200;
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: Date.now() + i,
      x: cx + (Math.random() - 0.5) * 200,
      y: cy + (Math.random() - 0.5) * 200,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  }, []);

  // Play music
  const playMusic = useCallback(() => {
    if (muted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      playCelebrationMusic(ctx);
      // Play 3 times for extra celebration
      setTimeout(() => playCelebrationMusic(ctx), 1400);
      setTimeout(() => playCelebrationMusic(ctx), 2800);
    } catch (e) {
      console.warn("Audio not available:", e);
    }
  }, [muted]);

  // Handle tile selection and placement
  const handleTrayClick = (trayIndex: number) => {
    if (solved) return;
    if (selected?.source === "tray" && selected.index === trayIndex) {
      setSelected(null);
      return;
    }
    if (selected?.source === "slot") {
      // Put slot piece back to tray, put tray piece into slot
      const slotIndex = selected.index;
      const trayPiece = tray[trayIndex];
      const slotPiece = slots[slotIndex];
      const newSlots = [...slots];
      const newTray = [...tray];
      newSlots[slotIndex] = trayPiece;
      newTray[trayIndex] = slotPiece!;
      setSlots(newSlots);
      setTray(newTray);
      setSelected(null);
      if (checkSolved(newSlots)) { setSolved(true); celebrate(); playMusic(); }
      return;
    }
    setSelected({ source: "tray", index: trayIndex });
  };

  const handleSlotClick = (slotIndex: number) => {
    if (solved) return;
    if (selected?.source === "tray") {
      // Place tray piece into slot
      const trayIndex = selected.index;
      const trayPiece = tray[trayIndex];
      const existingInSlot = slots[slotIndex];
      const newSlots = [...slots];
      const newTray = [...tray];
      newSlots[slotIndex] = trayPiece;
      if (existingInSlot) {
        newTray[trayIndex] = existingInSlot;
      } else {
        newTray.splice(trayIndex, 1);
      }
      setSlots(newSlots);
      setTray(newTray);
      setSelected(null);
      if (checkSolved(newSlots)) { setSolved(true); celebrate(); playMusic(); }
      return;
    }
    if (selected?.source === "slot") {
      if (selected.index === slotIndex) { setSelected(null); return; }
      // Swap two slots
      const newSlots = [...slots];
      [newSlots[slotIndex], newSlots[selected.index]] = [newSlots[selected.index], newSlots[slotIndex]];
      setSlots(newSlots);
      setSelected(null);
      if (checkSolved(newSlots)) { setSolved(true); celebrate(); playMusic(); }
      return;
    }
    if (slots[slotIndex]) {
      setSelected({ source: "slot", index: slotIndex });
    }
  };

  const handleReset = () => {
    setSlots(Array(GRID * GRID).fill(null));
    setTray(shuffle(PIECES));
    setSelected(null);
    setSolved(false);
    setParticles([]);
  };

  const correctCount = slots.filter((p, i) => p?.id === i).length;
  const progress = Math.round((correctCount / (GRID * GRID)) * 100);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-secondary/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary mb-5">
            🎓 Interactive Puzzle
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-3">
            Arrange the{" "}
            <span style={{
              background: "linear-gradient(135deg, #00FF94, #7000FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              College Logo
            </span>
          </h2>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto">
            Click a piece from the tray below, then click a slot to place it.
            Arrange all 9 tiles in the correct order to reveal the logo!
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center justify-between mb-2 text-xs font-mono text-white/40 uppercase tracking-widest">
            <span>Progress</span>
            <span className="text-brand-primary font-bold">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #00FF94, #7000FF)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Puzzle grid */}
          <motion.div
            ref={boardRef}
            className="relative w-full max-w-[420px] mx-auto flex-shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* College logo reference overlay (faint) */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/30 text-xs font-mono uppercase tracking-wider">
              <img src="/images/college_logo.png" alt="Logo Reference" className="w-10 h-10 rounded-lg opacity-40 object-contain" />
              <span>Reference Logo</span>
            </div>

            <div
              className="rounded-2xl p-3 relative"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: solved ? "2px solid rgba(0,255,148,0.5)" : "2px solid rgba(255,255,255,0.07)",
                boxShadow: solved ? "0 0 60px rgba(0,255,148,0.2)" : "none",
                transition: "border-color 0.5s, box-shadow 0.5s",
              }}
            >
              {/* Grid slot labels */}
              <div className="absolute -top-7 left-0 right-0 flex justify-between px-3">
                {["①", "②", "③"].map((n) => (
                  <span key={n} className="text-white/20 text-xs font-mono">{n}</span>
                ))}
              </div>

              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
              >
                {slots.map((piece, i) => (
                  <PuzzleTile
                    key={i}
                    piece={piece}
                    onClick={() => handleSlotClick(i)}
                    isSelected={selected?.source === "slot" && selected.index === i}
                    isCorrect={piece?.id === i}
                    isEmpty={!piece}
                  />
                ))}
              </div>

              {/* Solved badge */}
              <AnimatePresence>
                {solved && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ background: "rgba(0,255,148,0.05)" }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <CheckCircle className="w-16 h-16 text-brand-primary drop-shadow-lg" />
                      <span className="text-brand-primary font-black text-lg uppercase tracking-widest">Solved!</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <AnimatePresence>
                {particles.map((p) => (
                  <Particle key={p.id} x={p.x} y={p.y} color={p.color} />
                ))}
              </AnimatePresence>
            </div>

            {/* Reset button */}
            <div className="flex justify-center mt-4">
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Puzzle
              </motion.button>
            </div>
          </motion.div>

          {/* Tray of pieces */}
          {!solved && (
            <motion.div
              className="w-full max-w-[420px] mx-auto"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 font-mono">
                  🗃️ Piece Tray — {tray.length} remaining
                </span>
              </div>
              <div
                className="rounded-2xl p-3"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "2px dashed rgba(255,255,255,0.1)",
                }}
              >
                <div className="grid grid-cols-3 gap-2">
                  {tray.map((piece, i) => (
                    <PuzzleTile
                      key={piece.id}
                      piece={piece}
                      onClick={() => handleTrayClick(i)}
                      isSelected={selected?.source === "tray" && selected.index === i}
                      isCorrect={false}
                      isEmpty={false}
                    />
                  ))}
                  {/* Empty placeholders to maintain grid */}
                  {Array.from({ length: Math.max(0, GRID * GRID - tray.length) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="aspect-square rounded-xl"
                      style={{ border: "2px dashed rgba(255,255,255,0.04)" }}
                    />
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 space-y-2">
                {[
                  { step: "1", text: "Click a piece from the tray to select it" },
                  { step: "2", text: "Click an empty slot or slot to swap" },
                  { step: "3", text: "Arrange all 9 in the correct position" },
                  { step: "🎵", text: "Music plays & slideshow starts when solved!" },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-center gap-3 text-sm text-white/40">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: "rgba(0,255,148,0.15)", color: "#00FF94" }}
                    >
                      {step}
                    </span>
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Slideshow appears when solved */}
        <AnimatePresence>
          {solved && (
            <Slideshow muted={muted} onToggleMute={() => setMuted((m) => !m)} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
