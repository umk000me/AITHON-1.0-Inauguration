import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, Lock, Unlock, Volume2, VolumeX } from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────
const GRID = 3;                          // 3×3 grid
const LOGO_SRC = "/images/college_logo.png";
const TOTAL = GRID * GRID;

// Piece IDs: 0-8 (row-major, 0=top-left, 8=bottom-right)
const ALL_IDS = Array.from({ length: TOTAL }, (_, i) => i);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Ensure it's not already sorted
  if (a.every((v, i) => v === arr[i])) return shuffleArray(arr);
  return a;
}

function bgPos(id: number, tileSize: number): string {
  const col = id % GRID;
  const row = Math.floor(id / GRID);
  return `-${col * tileSize}px -${row * tileSize}px`;
}

// ─── Audio ────────────────────────────────────────────────────────────────────
function playTone(
  ctx: AudioContext,
  freq: number,
  start: number,
  dur: number,
  vol = 0.25,
  waveform: OscillatorType = "sine"
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = waveform;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(vol, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

function playUnlockFanfare(ctx: AudioContext) {
  const t = ctx.currentTime;
  // Rising triumphant melody in C major
  const notes = [
    [261.63, 0.0],  // C4
    [329.63, 0.15], // E4
    [392.00, 0.30], // G4
    [523.25, 0.45], // C5
    [659.25, 0.60], // E5
    [783.99, 0.75], // G5
    [1046.5, 0.85], // C6 – climax
    [783.99, 1.05],
    [1046.5, 1.20],
  ] as [number, number][];

  notes.forEach(([freq, offset]) => {
    playTone(ctx, freq, t + offset, 0.55, 0.28, "sine");
    // Harmonics for richness
    playTone(ctx, freq * 1.5, t + offset, 0.4, 0.08, "triangle");
  });

  // Bass chord
  [130.81, 164.81, 196.00].forEach((f, i) => {
    playTone(ctx, f, t + i * 0.05, 1.5, 0.18, "sine");
  });

  // Bell-like accent at climax
  playTone(ctx, 2093, t + 0.85, 0.8, 0.15, "sine");
  playTone(ctx, 4186, t + 0.90, 0.5, 0.07, "sine");
}

function playPickSound(ctx: AudioContext) {
  playTone(ctx, 880, ctx.currentTime, 0.1, 0.06, "sine");
}

function playPlaceSound(ctx: AudioContext, correct: boolean) {
  if (correct) {
    playTone(ctx, 1046.5, ctx.currentTime, 0.15, 0.1, "sine");
    playTone(ctx, 1318.5, ctx.currentTime + 0.08, 0.15, 0.08, "sine");
  } else {
    playTone(ctx, 440, ctx.currentTime, 0.08, 0.05, "triangle");
  }
}

// ─── Tile Component ───────────────────────────────────────────────────────────
interface TileProps {
  pieceId: number | null;        // which logo slice this tile holds (null = empty)
  tileSize: number;
  isSelected: boolean;
  isCorrect: boolean;
  isSolved: boolean;
  onClick: () => void;
  animateCorrect: boolean;
}

function Tile({ pieceId, tileSize, isSelected, isCorrect, isSolved, onClick, animateCorrect }: TileProps) {
  const isEmpty = pieceId === null;

  return (
    <motion.button
      onClick={onClick}
      className="relative rounded-lg overflow-hidden cursor-pointer select-none outline-none"
      style={{
        width: tileSize,
        height: tileSize,
        border: isEmpty
          ? "2px dashed rgba(0,255,148,0.25)"
          : isCorrect
          ? "2.5px solid rgba(0,255,148,0.9)"
          : isSelected
          ? "2.5px solid rgba(112,0,255,0.95)"
          : "2px solid rgba(255,255,255,0.12)",
        boxShadow: isCorrect
          ? "0 0 18px rgba(0,255,148,0.5), inset 0 0 12px rgba(0,255,148,0.08)"
          : isSelected
          ? "0 0 18px rgba(112,0,255,0.6)"
          : "0 2px 12px rgba(0,0,0,0.4)",
        background: isEmpty ? "rgba(0,255,148,0.03)" : "transparent",
        transition: "border 0.25s, box-shadow 0.25s",
      }}
      whileHover={!isEmpty && !isSolved ? { scale: 1.06, zIndex: 20 } : {}}
      whileTap={!isEmpty && !isSolved ? { scale: 0.94 } : {}}
      animate={
        animateCorrect
          ? { scale: [1, 1.1, 1], transition: { duration: 0.35 } }
          : {}
      }
    >
      {/* Logo slice */}
      {pieceId !== null && (
        <div
          style={{
            width: tileSize,
            height: tileSize,
            backgroundImage: `url(${LOGO_SRC})`,
            backgroundSize: `${tileSize * GRID}px ${tileSize * GRID}px`,
            backgroundPosition: bgPos(pieceId, tileSize),
            backgroundRepeat: "no-repeat",
            filter: isCorrect ? "none" : "brightness(0.85)",
            transition: "filter 0.3s",
          }}
        />
      )}

      {/* Correct glow overlay */}
      {isCorrect && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(0,255,148,0.08)" }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Selected shimmer */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(112,0,255,0.3), rgba(0,191,255,0.15))",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}

      {/* Empty slot hint */}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-brand-primary text-2xl font-thin"
          >
            ✦
          </motion.div>
        </div>
      )}
    </motion.button>
  );
}

// ─── Tray Tile ────────────────────────────────────────────────────────────────
function TrayTile({
  pieceId,
  tileSize,
  isSelected,
  onClick,
}: {
  pieceId: number;
  tileSize: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative rounded-lg overflow-hidden cursor-pointer select-none outline-none"
      style={{
        width: tileSize,
        height: tileSize,
        border: isSelected
          ? "2.5px solid rgba(112,0,255,0.95)"
          : "2px solid rgba(255,255,255,0.15)",
        boxShadow: isSelected
          ? "0 0 20px rgba(112,0,255,0.6)"
          : "0 2px 10px rgba(0,0,0,0.4)",
      }}
      whileHover={{ scale: 1.08, zIndex: 20 }}
      whileTap={{ scale: 0.92 }}
    >
      <div
        style={{
          width: tileSize,
          height: tileSize,
          backgroundImage: `url(${LOGO_SRC})`,
          backgroundSize: `${tileSize * GRID}px ${tileSize * GRID}px`,
          backgroundPosition: bgPos(pieceId, tileSize),
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.9)",
        }}
      />
      {isSelected && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(112,0,255,0.25)" }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}

// ─── Slideshow ────────────────────────────────────────────────────────────────
const SLIDES = [
  { src: "/images/slideshow_1.png", caption: "AI Innovation Lab" },
  { src: "/images/slideshow_2.png", caption: "Award Ceremony" },
  { src: "/images/slideshow_3.png", caption: "Campus Collaboration" },
  { src: LOGO_SRC,                  caption: "AI-THON 1.0" },
];

function Slideshow() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback((d: number) => {
    setDir(d);
    setIdx(p => (p + d + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => go(1), 4500);
    return () => clearInterval(t);
  }, [go]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:  (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0, scale: 0.96 }),
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden aspect-video"
      style={{ border: "2px solid rgba(0,255,148,0.35)", boxShadow: "0 0 60px rgba(0,255,148,0.15)" }}>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={idx} custom={dir} variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.65, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="absolute inset-0"
        >
          <img src={SLIDES[idx].src} alt={SLIDES[idx].caption} className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 p-5"
            style={{ background: "linear-gradient(to top, rgba(5,5,5,0.85) 0%, transparent)" }}>
            <motion.p className="text-white font-bold uppercase tracking-widest text-sm"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {SLIDES[idx].caption}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {([-1, 1] as (-1 | 1)[]).map(d => (
        <button key={d} onClick={() => go(d)}
          className={`absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-brand-primary hover:text-brand-dark transition-all text-white ${d === -1 ? "left-3" : "right-3"}`}>
          {d === -1 ? "‹" : "›"}
        </button>
      ))}

      {/* Dots */}
      <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
            className="rounded-full transition-all duration-300"
            style={{ width: i === idx ? 20 : 6, height: 6, background: i === idx ? "#00FF94" : "rgba(255,255,255,0.4)" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Gate Component ──────────────────────────────────────────────────────
interface LogoGateProps {
  onUnlock: () => void;
}

export default function LogoGate({ onUnlock }: LogoGateProps) {
  const TILE  = 110;   // px per tile in the grid
  const TRAY_TILE = 85; // px per tile in the tray

  // grid: array of piece IDs (or null for empty)
  const [grid, setGrid] = useState<(number | null)[]>(() => Array(TOTAL).fill(null));
  // tray: shuffled piece IDs not yet placed
  const [tray, setTray] = useState<number[]>(() => shuffleArray(ALL_IDS));
  // selection: where user clicked first
  const [selected, setSelected] = useState<{ from: "tray" | "grid"; idx: number } | null>(null);
  // which grid slots just became correct (for animation)
  const [justCorrect, setJustCorrect] = useState<Set<number>>(new Set());
  // solved state
  const [solved, setSolved] = useState(false);
  // gate opening phase
  const [opening, setOpening] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioRef.current.state === "suspended") audioRef.current.resume();
    return audioRef.current;
  };

  const isSolved = useCallback((g: (number | null)[]) =>
    g.every((v, i) => v === i), []);

  // Track newly correct slots
  const findNewCorrect = (newGrid: (number | null)[], oldGrid: (number | null)[]) => {
    const s = new Set<number>();
    newGrid.forEach((v, i) => { if (v === i && oldGrid[i] !== i) s.add(i); });
    return s;
  };

  const triggerCorrect = (slots: Set<number>) => {
    if (slots.size === 0) return;
    setJustCorrect(slots);
    setTimeout(() => setJustCorrect(new Set()), 450);
    if (!muted) { try { playPlaceSound(getAudio(), true); } catch {} }
  };

  // ── Interaction ─────────────────────────────────────────────────────────────

  const handleTrayClick = (trayIdx: number) => {
    if (solved) return;
    if (!muted) { try { playPickSound(getAudio()); } catch {} }

    if (selected?.from === "tray" && selected.idx === trayIdx) {
      setSelected(null); return;
    }

    if (selected?.from === "grid") {
      // Swap: grid slot ↔ tray slot
      const gridIdx = selected.idx;
      const trayPiece = tray[trayIdx];
      const gridPiece = grid[gridIdx];
      const newGrid = [...grid];
      const newTray = [...tray];
      newGrid[gridIdx] = trayPiece;
      if (gridPiece !== null) {
        newTray[trayIdx] = gridPiece;
      } else {
        newTray.splice(trayIdx, 1);
      }
      const nc = findNewCorrect(newGrid, grid);
      setGrid(newGrid);
      setTray(newTray);
      setSelected(null);
      triggerCorrect(nc);
      if (isSolved(newGrid)) handleSolve();
      return;
    }

    setSelected({ from: "tray", idx: trayIdx });
  };

  const handleGridClick = (gridIdx: number) => {
    if (solved) return;

    if (selected?.from === "tray") {
      // Place tray piece → grid slot
      const trayIdx = selected.idx;
      const trayPiece = tray[trayIdx];
      const displaced = grid[gridIdx];
      const newGrid = [...grid];
      const newTray = [...tray];
      newGrid[gridIdx] = trayPiece;
      if (displaced !== null) {
        newTray[trayIdx] = displaced;
      } else {
        newTray.splice(trayIdx, 1);
      }
      if (!muted) { try { playPickSound(getAudio()); } catch {} }
      const nc = findNewCorrect(newGrid, grid);
      setGrid(newGrid);
      setTray(newTray);
      setSelected(null);
      triggerCorrect(nc);
      if (isSolved(newGrid)) handleSolve();
      return;
    }

    if (selected?.from === "grid") {
      if (selected.idx === gridIdx) { setSelected(null); return; }
      // Swap two grid slots
      const newGrid = [...grid];
      [newGrid[gridIdx], newGrid[selected.idx]] = [newGrid[selected.idx], newGrid[gridIdx]];
      if (!muted) { try { playPickSound(getAudio()); } catch {} }
      const nc = findNewCorrect(newGrid, grid);
      setGrid(newGrid);
      setSelected(null);
      triggerCorrect(nc);
      if (isSolved(newGrid)) handleSolve();
      return;
    }

    if (grid[gridIdx] !== null) {
      if (!muted) { try { playPickSound(getAudio()); } catch {} }
      setSelected({ from: "grid", idx: gridIdx });
    }
  };

  const handleSolve = () => {
    setSolved(true);
    if (!muted) {
      try { playUnlockFanfare(getAudio()); } catch {}
    }
    // After a brief celebration delay, start the gate-opening animation
    setTimeout(() => {
      setOpening(true);
      setTimeout(() => {
        setUnlocked(true);
        onUnlock();
      }, 1800);
    }, 2200);
  };

  const handleReset = () => {
    setGrid(Array(TOTAL).fill(null));
    setTray(shuffleArray(ALL_IDS));
    setSelected(null);
    setSolved(false);
    setOpening(false);
    setJustCorrect(new Set());
  };

  const correctCount = grid.filter((v, i) => v === i).length;
  const progress = Math.round((correctCount / TOTAL) * 100);

  // ── Unlock animation overlay ─────────────────────────────────────────────
  if (unlocked) return null;

  return (
    <AnimatePresence>
      {!unlocked && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "radial-gradient(ellipse at 50% 40%, #0a0a1a 0%, #050505 100%)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated background grid lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(0,255,148,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,148,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Radial glow blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div className="absolute rounded-full"
              style={{ width: 500, height: 500, left: "30%", top: "20%", background: "radial-gradient(circle, rgba(112,0,255,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
              animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div className="absolute rounded-full"
              style={{ width: 400, height: 400, right: "25%", bottom: "20%", background: "radial-gradient(circle, rgba(0,255,148,0.08) 0%, transparent 70%)", filter: "blur(50px)" }}
              animate={{ scale: [1, 1.2, 1], x: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Gate-opening animation: tiles fly outward */}
          {opening && grid.map((pieceId, i) => {
            if (pieceId === null) return null;
            const row = Math.floor(i / GRID);
            const col = i % GRID;
            const cx = (col - 1) * 100;
            const cy = (row - 1) * 80;
            return (
              <motion.div key={i}
                className="absolute z-50 rounded-lg overflow-hidden"
                style={{
                  width: TILE, height: TILE,
                  top: "50%", left: "50%",
                  marginLeft: -TILE / 2 + (col - 1) * (TILE + 4),
                  marginTop: -TILE / 2 + (row - 1) * (TILE + 4),
                  backgroundImage: `url(${LOGO_SRC})`,
                  backgroundSize: `${TILE * GRID}px ${TILE * GRID}px`,
                  backgroundPosition: bgPos(pieceId, TILE),
                }}
                animate={{
                  x: cx * 8,
                  y: cy * 8,
                  opacity: 0,
                  scale: 0.3,
                  rotate: (Math.random() - 0.5) * 180,
                }}
                transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.05 }}
              />
            );
          })}

          {/* Main content — hidden during gate-open */}
          <AnimatePresence>
            {!opening && (
              <motion.div
                className="relative z-10 flex flex-col items-center w-full px-4 max-w-6xl mx-auto"
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                {/* Header */}
                <motion.div className="text-center mb-6"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <motion.div
                    className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-4 text-xs font-bold uppercase tracking-[0.25em]"
                    style={{ background: "rgba(0,255,148,0.08)", border: "1px solid rgba(0,255,148,0.25)", color: "#00FF94" }}
                    animate={{ boxShadow: ["0 0 0px rgba(0,255,148,0)", "0 0 20px rgba(0,255,148,0.3)", "0 0 0px rgba(0,255,148,0)"] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Solve the Puzzle to Enter
                  </motion.div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-none mb-2"
                    style={{
                      background: "linear-gradient(135deg, #ffffff 30%, #00FF94 70%, #7000FF 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>
                    AI-THON 1.0
                  </h1>
                  <p className="text-white/40 text-sm uppercase tracking-[0.3em] font-mono">
                    Arrange the logo · Unlock the experience
                  </p>
                </motion.div>

                {/* Progress bar */}
                <motion.div className="w-full max-w-sm mb-6"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest mb-1.5">
                    <span className="text-white/30">Completion</span>
                    <motion.span
                      className="font-bold"
                      style={{ color: progress === 100 ? "#00FF94" : "#7000FF" }}
                      animate={progress === 100 ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    >{progress}%</motion.span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #00FF94, #7000FF)" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.35 }}
                    />
                  </div>
                </motion.div>

                {/* Layout: Grid | Divider | Tray */}
                <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10 w-full justify-center">

                  {/* ─── Puzzle Grid ─────────────────────────────────── */}
                  <motion.div
                    className="flex flex-col items-center gap-3 flex-shrink-0"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                      Arrangement Board
                    </span>

                    {/* Solved flash */}
                    <div className="relative">
                      {solved && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
                          style={{ background: "rgba(0,255,148,0.12)" }}
                          animate={{ opacity: [0, 1, 0.5, 1, 0.3, 1] }}
                          transition={{ duration: 0.6 }}
                        />
                      )}

                      <div
                        className="rounded-2xl p-2"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: solved
                            ? "2px solid rgba(0,255,148,0.6)"
                            : "2px solid rgba(255,255,255,0.07)",
                          boxShadow: solved
                            ? "0 0 50px rgba(0,255,148,0.25), 0 0 100px rgba(0,255,148,0.1)"
                            : "0 8px 40px rgba(0,0,0,0.6)",
                          transition: "border 0.4s, box-shadow 0.4s",
                        }}
                      >
                        <div
                          className="grid gap-1"
                          style={{ gridTemplateColumns: `repeat(${GRID}, ${TILE}px)` }}
                        >
                          {grid.map((pieceId, i) => (
                            <Tile
                              key={i}
                              pieceId={pieceId}
                              tileSize={TILE}
                              isSelected={selected?.from === "grid" && selected.idx === i}
                              isCorrect={pieceId === i}
                              isSolved={solved}
                              onClick={() => handleGridClick(i)}
                              animateCorrect={justCorrect.has(i)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Solved badge */}
                      <AnimatePresence>
                        {solved && (
                          <motion.div
                            className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2 rounded-full"
                            style={{ background: "rgba(0,255,148,0.15)", border: "1px solid rgba(0,255,148,0.5)" }}
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Unlock className="w-4 h-4 text-brand-primary" />
                            <span className="text-brand-primary font-black text-sm uppercase tracking-widest">
                              Unlocking…
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Reset */}
                    <motion.button
                      onClick={handleReset}
                      className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <RefreshCw className="w-3 h-3" /> Reset
                    </motion.button>
                  </motion.div>

                  {/* ─── Divider ──────────────────────────────────────── */}
                  <div className="hidden lg:flex flex-col items-center self-stretch gap-2 pt-8">
                    <div className="w-px flex-1 rounded-full" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,255,148,0.3), transparent)" }} />
                    <span className="text-white/20 text-[10px] font-mono uppercase tracking-widest rotate-0 writing-mode-vertical">swap</span>
                    <div className="w-px flex-1 rounded-full" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,255,148,0.3), transparent)" }} />
                  </div>

                  {/* ─── Tray + Reference + Instructions ─────────────── */}
                  <motion.div
                    className="flex flex-col gap-5 flex-shrink-0"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {/* Reference logo */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <img src={LOGO_SRC} alt="Logo Reference"
                        className="w-12 h-12 rounded-lg object-contain opacity-70" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Target</p>
                        <p className="text-sm font-bold text-white/70">College Logo</p>
                      </div>
                      {/* Mute button */}
                      <button
                        onClick={() => setMuted(m => !m)}
                        className="ml-auto w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                        style={{ color: muted ? "rgba(255,255,255,0.3)" : "#00FF94" }}
                      >
                        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Piece tray */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2 text-center">
                        Piece Tray — {tray.length} left
                      </p>
                      <div
                        className="rounded-xl p-2"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1.5px dashed rgba(255,255,255,0.1)",
                          minWidth: TRAY_TILE * GRID + 24,
                        }}
                      >
                        {tray.length === 0 ? (
                          <div className="flex items-center justify-center h-24 text-white/20 text-sm font-mono">
                            All pieces placed!
                          </div>
                        ) : (
                          <div className="grid gap-1"
                            style={{ gridTemplateColumns: `repeat(${GRID}, ${TRAY_TILE}px)` }}>
                            {tray.map((pid, i) => (
                              <TrayTile
                                key={pid}
                                pieceId={pid}
                                tileSize={TRAY_TILE}
                                isSelected={selected?.from === "tray" && selected.idx === i}
                                onClick={() => handleTrayClick(i)}
                              />
                            ))}
                            {/* Ghost placeholders */}
                            {Array.from({ length: Math.max(0, TOTAL - tray.length) % GRID }).map((_, i) => (
                              <div key={`ghost-${i}`}
                                style={{ width: TRAY_TILE, height: TRAY_TILE,
                                  background: "rgba(255,255,255,0.02)",
                                  borderRadius: 8, border: "1px dashed rgba(255,255,255,0.06)" }} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-2.5">
                      {[
                        { n: "1", t: "Click a piece from the tray" },
                        { n: "2", t: "Click a slot on the board to place it" },
                        { n: "3", t: "Click any placed tile to reselect & swap" },
                        { n: "🔓", t: "Complete the logo to unlock the site!" },
                      ].map(({ n, t }) => (
                        <div key={n} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black"
                            style={{ background: "rgba(0,255,148,0.12)", color: "#00FF94" }}>
                            {n}
                          </span>
                          <span className="text-xs text-white/40">{t}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unlock flash overlay */}
          <AnimatePresence>
            {opening && (
              <motion.div
                className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(ellipse at center, rgba(0,255,148,0.25) 0%, transparent 70%)" }}
                  animate={{ opacity: [0, 1, 0.5, 1, 0] }}
                  transition={{ duration: 1.8 }}
                />
                <motion.div
                  className="relative z-50 flex flex-col items-center gap-4"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 250 }}
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Unlock className="w-20 h-20 text-brand-primary drop-shadow-lg" />
                  </motion.div>
                  <motion.h2
                    className="text-3xl md:text-5xl font-black uppercase tracking-widest"
                    style={{ color: "#00FF94", textShadow: "0 0 40px rgba(0,255,148,0.8)" }}
                    animate={{ opacity: [0.5, 1, 0.5, 1] }}
                    transition={{ duration: 0.8, repeat: 2 }}
                  >
                    Unlocked!
                  </motion.h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest font-mono">
                    Welcome to AI-THON 1.0 ✦
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Slideshow export (for re-use after unlock) ───────────────────────────────
export { Slideshow };
