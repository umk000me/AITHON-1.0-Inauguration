import { motion, AnimatePresence } from "motion/react";
import { Cpu, Calendar, MapPin, Users, Zap, Terminal, ChevronRight, Github, Twitter, Linkedin, Trophy, Medal, Award, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import LogoGate, { Slideshow } from "./LogoGate";
import { INAUGURATION_VIDEO_URL } from "./config";

// ─── Mobile Block ─────────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

const MobileBlock = () => (
  <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center text-center px-8"
    style={{ background: "radial-gradient(ellipse at 50% 40%, #0a0a1a 0%, #050505 100%)" }}>
    {/* Animated background glow */}
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
      style={{ background: "rgba(112,0,255,0.15)" }} />
    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
      style={{ background: "rgba(0,255,148,0.08)" }} />

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 flex flex-col items-center"
    >
      {/* Icon */}
      <motion.div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
        style={{ background: "rgba(0,255,148,0.08)", border: "2px solid rgba(0,255,148,0.25)" }}
        animate={{ boxShadow: ["0 0 0px rgba(0,255,148,0)", "0 0 30px rgba(0,255,148,0.3)", "0 0 0px rgba(0,255,148,0)"] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <Monitor className="w-10 h-10" style={{ color: "#00FF94" }} />
      </motion.div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[10px] font-bold uppercase tracking-[0.25em]"
        style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.35)", color: "#FF6B6B" }}>
        Desktop Only
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight"
        style={{
          background: "linear-gradient(135deg, #ffffff 30%, #00FF94 70%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
        AI-THON 1.0
      </h1>

      {/* Message */}
      <p className="text-white/60 text-base leading-relaxed max-w-sm mb-3">
        This inauguration experience is optimised for
        <span className="text-white font-semibold"> desktop and laptop screens</span>.
      </p>
      <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-10">
        Please open this link on a <strong className="text-white/70">Windows / Mac laptop</strong> or a
        <strong className="text-white/70"> desktop computer</strong> for the best experience.
      </p>

      {/* Steps */}
      <div className="w-full max-w-xs space-y-3 text-left">
        {[
          { icon: "1", text: "Open a browser on your laptop or PC" },
          { icon: "2", text: "Visit the link shared by your organiser" },
          { icon: "3", text: "Enjoy the full AI-THON 1.0 experience!" },
        ].map(({ icon, text }) => (
          <div key={icon} className="flex items-center gap-3 text-sm text-white/50">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: "rgba(0,255,148,0.15)", color: "#00FF94" }}>
              {icon}
            </span>
            {text}
          </div>
        ))}
      </div>

      {/* Footer badge */}
      <div className="mt-10 text-[10px] text-white/20 uppercase tracking-[0.3em] font-mono">
        Dept. of AI &amp; Data Science · AI-THON 1.0
      </div>
    </motion.div>
  </div>
);



const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-brand-primary rounded-sm flex items-center justify-center">
        <Cpu className="text-brand-dark w-5 h-5" />
      </div>
      <span className="font-display font-bold text-xl tracking-tighter">AI-THON <span className="text-brand-primary">1.0</span></span>
    </div>
    <div className="hidden md:flex gap-8 text-sm font-medium text-white/60">
      <a href="#about" className="hover:text-brand-primary transition-colors">About</a>
      <a href="#speakers" className="hover:text-brand-primary transition-colors">Speakers</a>
      <a href="#prizes" className="hover:text-brand-primary transition-colors">Prizes</a>
    </div>
    <button className="px-5 py-2 bg-white text-brand-dark text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-primary transition-all active:scale-95">
      Register Now
    </button>
  </nav>
);

const Hero = () => (
  <section className="relative w-full h-full flex flex-col items-center justify-center px-6 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/10 blur-[120px] rounded-full" />
    </div>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 text-center max-w-4xl"
    >
      <div className="inline-flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary mb-8">
        <Cpu className="w-4 h-4" /> Organised by Department of Artificial Intelligence And Data Science
      </div>
      
      <h1 className="text-6xl md:text-9xl font-black leading-none mb-6">
        AI-THON <br />
        <span className="gradient-text">1.0</span>
      </h1>
      
      <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
        Join the most ambitious AI hackathon of the year. 4 hours of building, 
        learning, and defining the next generation of artificial intelligence.
      </p>

      {/* Beautifully integrated Date & Location */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white/80 text-sm md:text-base font-mono tracking-widest uppercase mt-4 mx-auto w-fit border border-white/5 bg-white/5 px-6 py-3 rounded-xl shadow-lg">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-primary drop-shadow-[0_0_8px_rgba(0,255,148,0.4)]" />
          <span className="font-bold">MARCH 25, 2026</span>
        </div>
        <div className="hidden md:block w-1.5 h-1.5 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(0,255,148,0.6)]" />
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-primary drop-shadow-[0_0_8px_rgba(0,255,148,0.4)]" />
          <span className="font-bold border-b border-brand-primary/50 pb-0.5">SIR VISVESVARAYA M. HALL</span>
        </div>
      </div>

    </motion.div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, description, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-glass p-8 rounded-2xl group hover:border-brand-primary/30 transition-all"
  >
    <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="text-brand-primary w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-white/50 text-sm leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const About = () => (
  <section id="about" className="py-12 px-6 max-w-7xl mx-auto w-full">
    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div>
        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
          What is <br />
          <span className="text-brand-primary">Ai-Thon 1.0?</span>
        </h2>
        <p className="text-white/60 text-lg mb-10 leading-relaxed">
          Ai-Thon 1.0 is a premier hackathon dedicated to pushing the boundaries of 
          Artificial Intelligence. We bring together developers, designers, and 
          visionaries to solve real-world problems using cutting-edge AI models.
        </p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="text-3xl font-bold text-brand-primary mb-1">₹5K+</div>
            <div className="text-xs uppercase tracking-widest text-white/40">Prize Pool</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-primary mb-1">4H</div>
            <div className="text-xs uppercase tracking-widest text-white/40">Of Building</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-primary mb-1">55+</div>
            <div className="text-xs uppercase tracking-widest text-white/40">Teams</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-primary mb-1">5+</div>
            <div className="text-xs uppercase tracking-widest text-white/40">Judges</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FeatureCard 
          icon={Terminal} 
          title="LLM Track" 
          description="Build next-gen applications using Large Language Models."
          index={0}
        />
        <FeatureCard 
          icon={Zap} 
          title="Generative Art" 
          description="Explore the intersection of AI and creative expression."
          index={1}
        />
        <FeatureCard 
          icon={Cpu} 
          title="Edge AI" 
          description="Deploy intelligent models on constrained hardware."
          index={2}
        />
        <FeatureCard 
          icon={Users} 
          title="Social Impact" 
          description="Solve critical societal challenges with AI solutions."
          index={3}
        />
      </div>
    </div>
  </section>
);

const PersonProfile = ({ name, role, title, image, size = "large", containObj = false }: any) => {
  const sizeClasses = containObj
    ? size === 'large' ? 'h-24 md:h-32 w-auto' : size === 'medium' ? 'h-20 md:h-24 w-auto' : 'h-16 md:h-20 w-auto'
    : size === 'large' ? 'w-24 h-24 md:w-32 md:h-32' : size === 'medium' ? 'w-20 h-20 md:w-24 md:h-24' : 'w-16 h-16 md:w-20 md:h-20';

  return (
    <div className="group flex flex-col items-center text-center">
      <div className={`rounded-xl overflow-hidden mb-3 bg-white/5 border-2 border-white/5 group-hover:border-brand-primary transition-all duration-500 shadow-2xl flex items-center justify-center ${sizeClasses}`}>
        <img src={image} alt={name} className={`${containObj ? 'h-full w-auto object-contain' : 'w-full h-full object-cover'} group-hover:scale-105 transition-transform duration-700`} referrerPolicy="no-referrer" />
      </div>
      <h4 className={`${size === 'large' ? 'text-xl md:text-2xl' : size === 'medium' ? 'text-lg md:text-xl' : 'text-base md:text-lg'} font-bold`}>{name}</h4>
      <p className="text-brand-primary text-[9px] md:text-[10px] font-mono uppercase tracking-widest mt-1">{role}</p>
      {title && <p className="text-white/40 text-[8px] uppercase tracking-[0.2em] mt-0.5">{title}</p>}
    </div>
  );
};

const InaugurationPanel = () => (
  <section id="panel" className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-4">
    <div className="text-center mb-4 md:mb-6">
      <h2 className="text-2xl md:text-4xl font-black mb-1 uppercase tracking-tight">Hosting <span className="text-brand-primary">Panel</span></h2>
      <div className="w-12 h-1 bg-brand-primary mx-auto rounded-full shadow-[0_0_10px_rgba(0,255,148,0.5)]" />
    </div>
    
    <div className="flex flex-col items-center gap-4 md:gap-6 w-full">
      {/* Principal */}
      <div className="flex flex-col items-center w-full">
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-3 font-bold border border-white/10 px-3 py-1 rounded-full">Inaugurated By</span>
        <PersonProfile 
          name="Dr. M.A. Venkatesh" 
          role="Principal" 
          title="Amrutvahini College of Engineering"
          image="/images/principal.jpeg"
          size="large"
          containObj={true}
        />
      </div>

      <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* HOD & Coordinators Row */}
      <div className="flex flex-col md:flex-row items-baseline justify-center gap-8 md:gap-16 w-full">
        {/* HOD */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 mb-2 font-bold">Head of Department</span>
          <PersonProfile 
            name="Dr. A.R. Panhalkar" 
            role="HOD - Ai&DS" 
            image="/images/hod.png"
            size="medium"
          />
        </div>

        {/* Coordinators */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 mb-2 font-bold">Faculty Coordinators</span>
          <div className="flex gap-6 md:gap-10">
            <PersonProfile 
              name="Prof. S.G. Dighe" 
              role="Faculty Coordinator" 
              image="/images/c1.jpg"
              size="small"
            />
            <PersonProfile 
              name="Prof. R.B. Pandit" 
              role="Faculty Coordinator" 
              image="/images/c2.jpg"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Prizes = () => (
  <section id="prizes" className="py-16 px-6 bg-white/[0.02] w-full rounded-3xl">
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-3xl md:text-5xl font-black mb-12 uppercase tracking-tight">
        Event <span className="text-brand-primary">Prizes</span>
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* 2nd Prize */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center transform md:translate-y-4">
          <Medal className="w-12 h-12 text-gray-300 mb-4 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" />
          <h3 className="text-2xl font-bold mb-2 text-gray-300">2nd Place</h3>
          <p className="text-white/60 font-mono text-xs uppercase tracking-wider">Cash Prize + Momento + Certificate</p>
        </div>

        {/* 1st Prize */}
        <div className="bg-white/5 border border-brand-primary/40 p-8 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,255,148,0.15)] transform md:-translate-y-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-primary/5 blur-3xl rounded-full" />
          <Trophy className="w-16 h-16 text-brand-primary mb-4 drop-shadow-[0_0_15px_rgba(0,255,148,0.8)] relative z-10" />
          <h3 className="text-3xl font-black mb-2 relative z-10">1st Place</h3>
          <p className="text-brand-primary/80 font-mono text-xs uppercase tracking-wider relative z-10">Cash Prize + Momento<br />+ Certificate</p>
        </div>
        
        {/* 3rd Prize */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center transform md:translate-y-4">
          <Medal className="w-12 h-12 text-amber-600 mb-4 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" />
          <h3 className="text-2xl font-bold mb-2 text-amber-600">3rd Place</h3>
          <p className="text-white/60 font-mono text-xs uppercase tracking-wider">Cash Prize + Momento + Certificate</p>
        </div>
      </div>

      {/* Best Innovation Award */}
      <h3 className="text-lg md:text-xl font-bold mb-6 text-white/50 uppercase tracking-[0.3em] inline-block">Best Innovation Award</h3>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        <div className="bg-white/5 border border-white/5 px-8 py-5 rounded-xl flex items-center gap-4 hover:border-brand-primary/30 transition-colors">
          <Award className="w-6 h-6 text-brand-primary" />
          <div className="text-left">
            <div className="font-bold text-white">Award 1</div>
            <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest mt-0.5">Certificate</div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/5 px-8 py-5 rounded-xl flex items-center gap-4 hover:border-brand-primary/30 transition-colors">
          <Award className="w-6 h-6 text-brand-primary" />
          <div className="text-left">
            <div className="font-bold text-white">Award 2</div>
            <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest mt-0.5">Certificate</div>
          </div>
        </div>
      </div>

    </div>
  </section>
);

const Footer = () => (
  <footer className="py-20 px-6 border-t border-white/5">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-brand-primary rounded-sm flex items-center justify-center">
            <Cpu className="text-brand-dark w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tighter">AI-THON <span className="text-brand-primary">1.0</span></span>
        </div>
        <p className="text-white/40 max-w-sm leading-relaxed mb-8">
          The ultimate platform for AI innovation. Join us in building the future, one intelligent line of code at a time.
        </p>
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-brand-dark transition-all">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-brand-dark transition-all">
            <Github className="w-4 h-4" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-brand-dark transition-all">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      <div>
        <h5 className="font-bold mb-6 uppercase tracking-widest text-xs">Navigation</h5>
        <ul className="space-y-4 text-sm text-white/40">
          <li><a href="#" className="hover:text-brand-primary transition-colors">Home</a></li>
          <li><a href="#about" className="hover:text-brand-primary transition-colors">About</a></li>
          <li><a href="#schedule" className="hover:text-brand-primary transition-colors">Schedule</a></li>
          <li><a href="#speakers" className="hover:text-brand-primary transition-colors">Speakers</a></li>
        </ul>
      </div>
      
      <div>
        <h5 className="font-bold mb-6 uppercase tracking-widest text-xs">Contact</h5>
        <ul className="space-y-4 text-sm text-white/40 font-mono">
          <li>hello@aithon.io</li>
          <li>+1 (555) 000-AI-THON</li>
          <li>123 Neural Way, <br />Silicon Valley, CA</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
      <div>© 2026 AI-THON 1.0. ALL RIGHTS RESERVED.</div>
      <div className="flex gap-8">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-white transition-colors">Code of Conduct</a>
      </div>
    </div>
  </footer>
);

const PresentationView = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    Hero,
    About,
    InaugurationPanel,
    Prizes
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000); // Auto-advance every 7 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="min-h-screen w-screen md:h-screen overflow-x-hidden md:overflow-hidden relative bg-brand-dark selection:bg-brand-primary selection:text-brand-dark pt-10 pb-24 md:p-0">
      {/* Main Slide Content - Scrollable on Mobile, Fixed on Desktop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="md:absolute inset-0 z-10 flex flex-col items-center justify-start md:justify-center px-4 md:px-12 w-full"
        >
          {/* Strict scaling for Desktop / Smooth scrolling for Mobile */}
          <div className="w-full md:h-full max-h-none md:max-h-[100vh] flex justify-center md:items-center">
            <div className="transform scale-100 md:scale-95 xl:scale-100 origin-center w-full max-w-7xl flex flex-col items-center">
              <CurrentSlideComponent />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Presentation Progress Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50 bg-black/40 backdrop-blur-md px-5 py-3 rounded-full border border-white/5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-500 rounded-full ${
              currentSlide === idx 
                ? 'w-10 h-2 bg-brand-primary shadow-[0_0_12px_rgba(0,255,148,0.6)]' 
                : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const isMobile = useIsMobile();
  const [unlocked, setUnlocked] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  // Block mobile users immediately
  if (isMobile) return <MobileBlock />;

  // Auto-Fullscreen on first interaction
  useEffect(() => {
    const enterFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn("Could not auto-enable fullscreen:", err);
        });
      }
    };
    document.addEventListener("click", enterFullscreen, { once: true });
    return () => document.removeEventListener("click", enterFullscreen);
  }, []);

  const handleUnlock = () => {
    setUnlocked(true);
    
    // If no video URL configured, skip straight to presentation
    if (!INAUGURATION_VIDEO_URL) {
      setTimeout(() => setVideoEnded(true), 2000);
      return;
    }

    // 2-second black screen, then play video
    setTimeout(() => {
      setShowVideo(true);
    }, 2000);
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Full-screen puzzle gate — renders on top until solved */}
      {!unlocked && <LogoGate onUnlock={handleUnlock} />}

      {/* 2-Second Pitch Black + Custom Video Player */}
      <AnimatePresence>
        {unlocked && showVideo && !videoEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center cursor-none"
          >
            <video
              src={INAUGURATION_VIDEO_URL}
              autoPlay
              controls={false}
              className="w-full h-full object-contain"
              onEnded={() => setVideoEnded(true)}
              onError={() => {
                console.warn("Could not play video:", INAUGURATION_VIDEO_URL);
                setVideoEnded(true);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main site — Fades into an infinite looping presentation after video ends */}
      <AnimatePresence>
        {videoEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <PresentationView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
