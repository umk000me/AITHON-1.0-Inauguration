import { motion, AnimatePresence } from "motion/react";
import { Cpu, Calendar, MapPin, Users, Zap, Terminal, ChevronRight, Github, Twitter, Linkedin } from "lucide-react";
import { useState, useEffect } from "react";
import LogoGate, { Slideshow } from "./LogoGate";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-04-15T09:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 md:gap-8 font-mono">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="text-3xl md:text-5xl font-bold text-brand-primary">
            {value.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/40 mt-1">
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
};

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
      <a href="#schedule" className="hover:text-brand-primary transition-colors">Schedule</a>
      <a href="#speakers" className="hover:text-brand-primary transition-colors">Speakers</a>
      <a href="#sponsors" className="hover:text-brand-primary transition-colors">Sponsors</a>
    </div>
    <button className="px-5 py-2 bg-white text-brand-dark text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-primary transition-all active:scale-95">
      Register Now
    </button>
  </nav>
);

const Hero = () => (
  <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/10 blur-[120px] rounded-full" />
      <div className="scanline" />
    </div>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 text-center max-w-4xl"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary mb-8">
        <Zap className="w-3 h-3" /> The Future is Here
      </div>
      
      <h1 className="text-6xl md:text-9xl font-black leading-none mb-6">
        INNOVATE <br />
        <span className="gradient-text">INTELLIGENTLY</span>
      </h1>
      
      <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
        Join the most ambitious AI hackathon of the year. 48 hours of building, 
        learning, and defining the next generation of artificial intelligence.
      </p>

      <div className="flex flex-col items-center gap-10">
        <Countdown />
        
        <div className="flex flex-wrap justify-center gap-4">
          <button className="group relative px-8 py-4 bg-brand-primary text-brand-dark font-bold rounded-xl overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(0,255,148,0.4)]">
            <span className="relative z-10 flex items-center gap-2">
              GET STARTED <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
            VIEW CHALLENGES
          </button>
        </div>
      </div>
    </motion.div>

    <div className="absolute bottom-10 left-0 w-full px-10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-xs font-mono tracking-widest uppercase">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-primary" />
          APRIL 15-17, 2026
        </div>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-primary" />
          SILICON VALLEY, CA
        </div>
      </div>
      <div className="flex gap-6">
        <a href="#" className="hover:text-brand-primary transition-colors">Twitter</a>
        <a href="#" className="hover:text-brand-primary transition-colors">Discord</a>
        <a href="#" className="hover:text-brand-primary transition-colors">GitHub</a>
      </div>
    </div>
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
  <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
    <div className="grid md:grid-cols-2 gap-20 items-center">
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
            <div className="text-3xl font-bold text-brand-primary mb-1">$50K+</div>
            <div className="text-xs uppercase tracking-widest text-white/40">Prize Pool</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-primary mb-1">48H</div>
            <div className="text-xs uppercase tracking-widest text-white/40">Of Building</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-primary mb-1">500+</div>
            <div className="text-xs uppercase tracking-widest text-white/40">Participants</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-primary mb-1">20+</div>
            <div className="text-xs uppercase tracking-widest text-white/40">Mentors</div>
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

const ScheduleItem = ({ time, title, description }: any) => (
  <div className="flex gap-8 group">
    <div className="w-24 pt-1 text-xs font-mono text-brand-primary shrink-0">{time}</div>
    <div className="pb-12 border-l border-white/10 pl-8 relative">
      <div className="absolute top-1.5 -left-[5px] w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(0,255,148,0.8)]" />
      <h4 className="text-lg font-bold mb-2 group-hover:text-brand-primary transition-colors">{title}</h4>
      <p className="text-white/40 text-sm">{description}</p>
    </div>
  </div>
);

const Schedule = () => (
  <section id="schedule" className="py-32 px-6 bg-white/[0.02]">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Event Timeline</h2>
        <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold">48 Hours of Pure Innovation</p>
      </div>
      
      <div className="space-y-2">
        <div className="text-xs font-bold text-white/20 uppercase tracking-widest mb-8">Day 1: April 15</div>
        <ScheduleItem time="09:00 AM" title="Opening Ceremony" description="Grand inauguration and keynote speech by industry leaders." />
        <ScheduleItem time="11:00 AM" title="Hacking Begins" description="Teams start working on their projects. Mentors available." />
        <ScheduleItem time="02:00 PM" title="Workshop: Advanced RAG" description="Deep dive into Retrieval Augmented Generation techniques." />
        
        <div className="text-xs font-bold text-white/20 uppercase tracking-widest mb-8 mt-12">Day 2: April 16</div>
        <ScheduleItem time="10:00 AM" title="Mid-Point Check-in" description="Progress review and technical support sessions." />
        <ScheduleItem time="08:00 PM" title="Midnight Snack & Gaming" description="Relax and recharge with some fun activities." />
        
        <div className="text-xs font-bold text-white/20 uppercase tracking-widest mb-8 mt-12">Day 3: April 17</div>
        <ScheduleItem time="11:00 AM" title="Hacking Ends" description="Final project submissions and demo preparations." />
        <ScheduleItem time="02:00 PM" title="Project Demos" description="Showcasing the best innovations to the judges." />
        <ScheduleItem time="05:00 PM" title="Award Ceremony" description="Announcing winners and closing remarks." />
      </div>
    </div>
  </section>
);

const Speaker = ({ name, role, company, image }: any) => (
  <div className="group">
    <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-white/5 border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500">
      <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
    </div>
    <h4 className="text-xl font-bold">{name}</h4>
    <p className="text-brand-primary text-xs font-mono uppercase tracking-widest mt-1">{role}</p>
    <p className="text-white/40 text-sm mt-2">{company}</p>
  </div>
);

const Speakers = () => (
  <section id="speakers" className="py-32 px-6 max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
      <div>
        <h2 className="text-4xl md:text-6xl font-bold mb-4">Guest Speakers</h2>
        <p className="text-white/60 max-w-xl">Learn from the pioneers who are shaping the future of artificial intelligence across the globe.</p>
      </div>
      <button className="px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
        View All Speakers
      </button>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      <Speaker 
        name="Dr. Elena Vance" 
        role="Chief AI Scientist" 
        company="Neural Dynamics" 
        image="https://picsum.photos/seed/elena/400/400"
      />
      <Speaker 
        name="Marcus Chen" 
        role="Founder" 
        company="Synthetix Labs" 
        image="https://picsum.photos/seed/marcus/400/400"
      />
      <Speaker 
        name="Sarah Jenkins" 
        role="Head of Ethics" 
        company="OpenMind AI" 
        image="https://picsum.photos/seed/sarah/400/400"
      />
      <Speaker 
        name="Alex Rivera" 
        role="Lead Engineer" 
        company="Quantum Systems" 
        image="https://picsum.photos/seed/alex/400/400"
      />
    </div>
  </section>
);

const Sponsors = () => (
  <section id="sponsors" className="py-32 px-6 bg-white/[0.02]">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-16 text-white/40 uppercase tracking-[0.4em]">Supported By</h2>
      <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all">
        <div className="text-3xl font-black tracking-tighter">GOOGLE</div>
        <div className="text-3xl font-black tracking-tighter">MICROSOFT</div>
        <div className="text-3xl font-black tracking-tighter">NVIDIA</div>
        <div className="text-3xl font-black tracking-tighter">OPENAI</div>
        <div className="text-3xl font-black tracking-tighter">ANTHROPIC</div>
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
  const slides = [Hero, About, Schedule, Speakers, Sponsors];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000); // Auto-advance every 7 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-brand-dark selection:bg-brand-primary selection:text-brand-dark">
      {/* Main Slide Content - No Scroll */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* We wrap the component to apply a slight scaling if needed, creating a beautiful presentation look */}
          <div className="w-full flex justify-center items-center scale-90 md:scale-100 origin-center">
            <CurrentSlideComponent />
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
  const [unlocked, setUnlocked] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const handleUnlock = () => {
    // 1. Hide the puzzle gate so it's a solid black screen layout
    setUnlocked(true);
    
    // 2. Keep screen pitch black for exactly 2 seconds, then show video
    setTimeout(() => {
      setShowVideo(true);
    }, 2000); // 2 second pure black delay
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
              src="/videos/inauguration.mp4"
              autoPlay
              controls={false} // clean presentation look, hides UI
              className="w-full h-full object-contain"
              onEnded={() => setVideoEnded(true)}
              onError={() => {
                // Failsafe in case video file doesn't exist – immediately fall back to Presentation
                console.warn("Could not play video at /videos/inauguration.mp4");
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
