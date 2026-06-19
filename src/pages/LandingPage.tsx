import { motion } from 'framer-motion'
import { 
  Sparkles, 
  ShieldCheck, 
  PhoneCall, 
  DollarSign, 
  Bot
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function LandingPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  // Floating tags for Card 2
  const floatingTags = [
    { text: 'Search PDF', x: '10%', y: '15%', delay: 0.1 },
    { text: 'Contracts', x: '55%', y: '20%', delay: 0.3 },
    { text: 'Analyze CSV', x: '15%', y: '50%', delay: 0.2 },
    { text: 'Summarize', x: '50%', y: '60%', delay: 0.4 },
    { text: 'Query DB', x: '25%', y: '80%', delay: 0.5 },
  ]

  return (
    <div className="min-h-screen bg-[#F0F9FF] relative overflow-x-hidden flex flex-col font-sans select-none pb-12">
      {/* Blueprint background grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none z-0" />
      
      {/* Decorative ambient glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-brandSky/30 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-brandSky/20 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Main outer rounded card container (simulates the screenshot viewport border) */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-8 pt-4 flex-1 flex flex-col relative z-10">
        
        {/* ─── Header / Navbar ─────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between py-5 px-6 rounded-2xl glass border border-white/40 shadow-sm mb-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-brandNavy flex items-center justify-center text-white">
              <Bot size={18} className="text-brandSky" />
            </div>
            <span className="font-display font-bold text-lg text-brandNavy tracking-tight">
              CloudStore AI
            </span>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-brandNavy/80">
            <a href="#about" className="hover:text-brandNavy transition-colors">About</a>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-brandNavy transition-colors font-semibold">
                Services
                <svg className="w-3 h-3 text-brandNavy/65" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <a href="#blog" className="hover:text-brandNavy transition-colors">Blog</a>
            <a href="#resources" className="hover:text-brandNavy transition-colors">Resources</a>
            <a href="#contact" className="hover:text-brandNavy transition-colors">Contact Us</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2 rounded-full text-sm font-semibold text-brandNavy bg-white border border-brandNavy/10 hover:bg-slate-50 transition-all shadow-sm"
            >
              Sign Up
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 rounded-full text-sm font-semibold text-white bg-brandNavy hover:bg-brandNavy/90 transition-all shadow-md shadow-brandNavy/10"
            >
              Login
            </button>
          </div>
        </header>

        {/* ─── Hero Section ───────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/35 rounded-3xl p-8 sm:p-12 border border-white/60 shadow-sm flex-1 mb-6 relative">
          
          {/* Left Column: Headline & Subtitle */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-2"
            >
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-brandNavy tracking-tight leading-[1.08] mb-4">
                Cloud Storage<br />
                Revolutionized<br />
                with AI{' '}
                <span className="inline-flex items-center gap-1 bg-brandSky/30 px-3 py-1 rounded-xl text-brandNavy text-3xl sm:text-4xl lg:text-5xl font-bold align-middle border border-brandSky/50 shadow-inner">
                  <Sparkles size={28} className="text-brandNavy shrink-0 animate-pulse" />
                  Powered
                </span>
              </h1>
              
              <p className="text-base text-brandNavy/70 max-w-lg leading-relaxed mb-8">
                Search, query, and analyze your documents and databases with our cutting-edge RAG-powered engine. Find files instantly using conversational AI.
              </p>
            </motion.div>

            {/* Email Field matching screenshot pill shape */}
            <motion.form 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              onSubmit={handleGetStarted}
              className="flex items-center bg-white rounded-full p-1.5 border border-brandNavy/10 shadow-sm max-w-md w-full mb-3 focus-within:ring-2 focus-within:ring-brandSky transition-all"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent border-none outline-none text-sm text-brandNavy pl-5 pr-2 placeholder-brandNavy/40"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full text-sm font-bold text-white bg-brandNavy hover:bg-brandNavy/95 shadow-md transition-all shrink-0"
              >
                Get Started
              </button>
            </motion.form>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-xs text-brandNavy/50 flex items-center gap-1.5 pl-2"
            >
              <svg className="w-3.5 h-3.5 text-brandNavy/65" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              30 day free trial, no credit card required.
            </motion.p>
          </div>

          {/* Right Column: iPhone & Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] lg:min-h-[500px]">
            
            {/* SVG Connector Lines mapping the floating badges to the phone */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block" fill="none">
              {/* Top Left Badge to Phone */}
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                d="M 120,130 C 180,130 180,180 230,180" 
                stroke="#BAE6FD" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
              />
              {/* Bottom Left Badge to Phone */}
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                d="M 140,290 C 200,290 200,270 230,260" 
                stroke="#BAE6FD" 
                strokeWidth="1.5" 
              />
              {/* Bottom Right Badge to Phone */}
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                d="M 440,360 C 380,360 380,300 350,300" 
                stroke="#BAE6FD" 
                strokeWidth="1.5" 
              />
            </svg>

            {/* Float Wrapper */}
            <div className="relative z-10 w-full max-w-[270px] aspect-[9/19.5] bg-[#111827] rounded-[48px] p-2.5 shadow-2xl border-[5px] border-slate-300">
              
              {/* Dynamic Island / Speaker notch */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800 absolute right-3" />
              </div>

              {/* Internal Screen mockup */}
              <div className="w-full h-full rounded-[38px] overflow-hidden bg-slate-50 relative flex flex-col pt-8 pb-4 px-3 font-sans">
                
                {/* Mock Header */}
                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-brandNavy flex items-center justify-center text-[10px] text-white">☁</div>
                  <div className="text-left leading-none">
                    <p className="text-[10px] font-bold text-brandNavy">CloudStore AI</p>
                    <p className="text-[7px] text-slate-400 mt-0.5">Active Agent</p>
                  </div>
                </div>

                {/* Chat items */}
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
                  <p className="text-[8px] text-slate-400 text-center select-none font-bold my-1">Sep 19, 2026</p>
                  
                  {/* Bot message */}
                  <div className="flex gap-1.5 items-start">
                    <div className="w-4 h-4 rounded-full bg-brandNavy shrink-0 flex items-center justify-center text-[6px] text-white">🤖</div>
                    <div className="bg-slate-100 border border-slate-200 text-brandNavy text-[9px] p-2 rounded-2xl rounded-tl-sm text-left max-w-[80%] shadow-sm leading-normal">
                      Hi, Welcome to CloudStore AI.<br />How can I help?
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex gap-1.5 items-start justify-end mt-1">
                    <div className="bg-brandNavy text-white text-[9px] p-2 rounded-2xl rounded-tr-sm text-left max-w-[80%] shadow-sm leading-normal">
                      Hi, I need help finding invoices above ₹10,000 from January.
                    </div>
                  </div>

                  {/* Bot reply */}
                  <div className="flex gap-1.5 items-start mt-1">
                    <div className="w-4 h-4 rounded-full bg-brandNavy shrink-0 flex items-center justify-center text-[6px] text-white">🤖</div>
                    <div className="bg-slate-100 border border-slate-200 text-brandNavy text-[9px] p-2 rounded-2xl rounded-tl-sm text-left max-w-[80%] shadow-sm leading-normal">
                      Sure! I'd be happy to assist. Could you tell me a bit more about your product or filters? I found 3 matching files in your vault.
                    </div>
                  </div>
                </div>

                {/* Bottom feedback buttons */}
                <div className="flex items-center gap-2.5 text-slate-400 text-[10px] border-t border-slate-200 pt-2 shrink-0 justify-start pl-1">
                  <button className="hover:text-brandNavy">👍</button>
                  <button className="hover:text-brandNavy">👎</button>
                  <button className="hover:text-brandNavy">🔗</button>
                </div>
              </div>
            </div>

            {/* Floating Badge 1: #1 AI search engine (Top Left) */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-[-4%] sm:left-4 z-20 bg-white border border-brandNavy/10 p-3 rounded-2xl shadow-md max-w-[130px]"
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-lg">🏆</span>
                <span className="text-[10px] font-bold text-brandNavy mt-1">#1 Best AI Search</span>
                <span className="text-[8px] text-slate-400 mt-0.5 leading-tight">for Cloud Documents</span>
              </div>
            </motion.div>

            {/* Floating Badge 2: Latency Spark Chart (Bottom Left) */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-20 left-[-6%] sm:left-0 z-20 bg-brandNavy p-3 rounded-2xl shadow-xl w-[130px] border border-brandNavy/30"
            >
              <div className="text-left flex flex-col justify-between h-full">
                <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                  ⏱ Latency Reduction
                </span>
                <div className="flex items-baseline gap-1 mt-1 text-white">
                  <span className="text-xl font-bold">42</span>
                  <span className="text-[9px] font-semibold text-brandSky">ms</span>
                </div>
                {/* Wavy line vector */}
                <svg className="w-full h-8 mt-2 text-brandSky" viewBox="0 0 100 30" fill="none">
                  <path d="M0 25 C10 25 15 5 25 15 C35 25 45 5 55 10 C65 15 75 28 85 2 C95 2 95 15 100 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="85" cy="2" r="2.5" fill="#FFF" className="animate-ping" />
                </svg>
              </div>
            </motion.div>

            {/* Floating Badge 3: User Count (Bottom Right) */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-12 right-[-6%] sm:right-6 z-20 bg-white border border-brandNavy/10 p-3.5 rounded-2xl shadow-md min-w-[140px]"
            >
              <div className="flex flex-col items-center">
                {/* Small avatar stack */}
                <div className="flex items-center -space-x-1.5">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60" className="w-5.5 h-5.5 rounded-full border border-white object-cover" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60" className="w-5.5 h-5.5 rounded-full border border-white object-cover" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60" className="w-5.5 h-5.5 rounded-full border border-white object-cover" />
                </div>
                <span className="text-xs font-extrabold text-brandNavy mt-1.5">100K+</span>
                <span className="text-[7px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">Satisfied Users</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Bottom Feature Grid ─────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 w-full">
          
          {/* Card 1: Navy 24K+ Stat Card */}
          <div className="lg:col-span-3 bg-brandNavy rounded-3xl p-6 flex flex-col justify-between min-h-[170px] relative overflow-hidden shadow-lg border border-brandNavy/30 text-left">
            <div className="flex justify-between items-start z-10">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-white">24K+</span>
              <span className="text-[9px] font-semibold text-brandEmerald px-2 py-0.5 rounded-full bg-brandEmerald/15 border border-brandEmerald/30">+4%</span>
            </div>
            <div className="z-10 mt-auto">
              <p className="text-xs font-bold text-slate-350">Start a chat with CloudStore AI</p>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Instant semantic search & file index querying.</p>
            </div>
            {/* Glowing ambient blob */}
            <div className="absolute right-[-10%] bottom-[-20%] w-24 h-24 rounded-full bg-brandSky/20 blur-xl" />
          </div>

          {/* Card 2: Interactive Floating Tags / Filter Chips */}
          <div className="lg:col-span-3 rounded-3xl p-6 flex flex-col justify-between min-h-[170px] relative overflow-hidden shadow-lg border border-white/60 bg-gradient-to-br from-brandSky to-[#D0F2FF]">
            <div className="absolute inset-0 opacity-40 mix-blend-overlay grid-pattern" />
            <div className="relative flex-1 w-full min-h-[100px]">
              {floatingTags.map((tag) => (
                <motion.span
                  key={tag.text}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: tag.delay }}
                  className="absolute px-3 py-1.5 rounded-full text-[9px] font-bold text-brandNavy bg-white/75 shadow-sm backdrop-blur-sm border border-white/40 cursor-pointer hover:bg-white hover:scale-105 transition-all"
                  style={{ left: tag.x, top: tag.y }}
                  onClick={() => navigate('/dashboard')}
                >
                  {tag.text}
                </motion.span>
              ))}
            </div>
            <div className="z-10 mt-auto text-left">
              <p className="text-xs font-bold text-brandNavy">Smart Category Tags</p>
              <p className="text-[9px] text-brandNavy/65 mt-0.5">Filter documents dynamically by intent.</p>
            </div>
          </div>

          {/* Card 3: AI Suggestion Box */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-5 flex flex-col justify-between min-h-[170px] border border-white/80 shadow-md text-left">
            <div className="flex items-center gap-2">
              <div className="w-5.5 h-5.5 rounded bg-brandNavy/10 flex items-center justify-center">
                <Bot size={12} className="text-brandNavy" />
              </div>
              <span className="text-[10px] font-bold text-brandNavy">CloudStore AI Suggestion</span>
            </div>
            
            <p className="text-xs text-brandNavy/80 leading-normal my-2.5">
              Optimized index size by <span className="font-bold underline text-brandNavy">18.2% through deduplication</span>. Saved 4.2GB of redundant storage.
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-fit flex items-center gap-1 px-4 py-1.5 rounded-full text-[10px] font-bold text-white bg-brandNavy hover:bg-brandNavy/90 shadow-sm transition-all"
            >
              + Update
            </button>
          </div>

          {/* Card 4: Grid of 4 Feature Icons */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-3 min-h-[170px]">
            
            {/* Tile 1 */}
            <div className="bg-white rounded-2xl p-3 border border-white/85 shadow-sm flex flex-col justify-between items-start text-left hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-6.5 h-6.5 rounded-full bg-[#E0F2FE] flex items-center justify-center">
                <DollarSign size={13} className="text-brandNavy" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-brandNavy">Cost savings</p>
                <p className="text-[8px] text-slate-400 mt-0.5 leading-none">Up to 35% savings</p>
              </div>
            </div>

            {/* Tile 2 */}
            <div className="bg-white rounded-2xl p-3 border border-white/85 shadow-sm flex flex-col justify-between items-start text-left hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-6.5 h-6.5 rounded-full bg-[#E0F2FE] flex items-center justify-center">
                <Sparkles size={12} className="text-brandNavy" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-brandNavy">User experience</p>
                <p className="text-[8px] text-slate-400 mt-0.5 leading-none">Instant search lookup</p>
              </div>
            </div>

            {/* Tile 3 */}
            <div className="bg-white rounded-2xl p-3 border border-white/85 shadow-sm flex flex-col justify-between items-start text-left hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-6.5 h-6.5 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                <PhoneCall size={12} className="text-rose-500" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-brandNavy">24/7 support</p>
                <p className="text-[8px] text-slate-400 mt-0.5 leading-none">Always available help</p>
              </div>
            </div>

            {/* Tile 4 */}
            <div className="bg-white rounded-2xl p-3 border border-white/85 shadow-sm flex flex-col justify-between items-start text-left hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-6.5 h-6.5 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                <ShieldCheck size={13} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-brandNavy">Safety guaranteed</p>
                <p className="text-[8px] text-slate-400 mt-0.5 leading-none">Fully secured vaults</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
