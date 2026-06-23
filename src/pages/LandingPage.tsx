import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { 
  Sparkles, 
  ShieldCheck, 
  PhoneCall, 
  DollarSign, 
  Bot,
  Database,
  Search,
  Cpu,
  Layers,
  Lock,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Activity,
  FileText,
  HelpCircle,
  Menu,
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
export function LandingPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Scroll Parallax logic
  const { scrollY } = useScroll()
  const blobY1 = useTransform(scrollY, [0, 1000], [0, -100])
  const blobY2 = useTransform(scrollY, [0, 1000], [0, 120])
  const blobY3 = useTransform(scrollY, [0, 1000], [0, -60])
  const gridY = useTransform(scrollY, [0, 1000], [0, 40])
  
  // Interactive RAG Simulator states
  const [selectedSource, setSelectedSource] = useState<'pdf' | 'db' | 'csv'>('pdf')
  const [simStep, setSimStep] = useState<number>(-1)
  const [simProgress, setSimProgress] = useState<number>(0)
  const [simOutput, setSimOutput] = useState<string>('')


  // Simulator configurations
  const simulations = {
    pdf: {
      sourceName: 'NDA_2026_Final.pdf',
      query: 'What are the IP ownership clauses in Section 4?',
      steps: [
        { label: 'Reading PDF & checking signatures...', time: 800 },
        { label: 'Parsing text blocks & layouts...', time: 1000 },
        { label: 'Embedding text chunks (text-embedding-3-small)...', time: 1200 },
        { label: 'Querying Pinecone Vector database...', time: 900 },
        { label: 'Synthesizing response with Claude 3.5 Sonnet...', time: 1500 },
      ],
      result: 'According to Section 4.2 of NDA_2026_Final.pdf, all Intellectual Property created during the collaboration belongs solely to the Disclosing Party. The Receiving Party is granted a limited, non-exclusive license for project evaluation purposes only.',
    },
    db: {
      sourceName: 'sales_production_postgres',
      query: 'Show me total revenue for Q1 2026 grouped by category.',
      steps: [
        { label: 'Connecting to Postgres secure vault...', time: 700 },
        { label: 'Analyzing table schemas (orders, line_items, products)...', time: 1100 },
        { label: 'Translating NL to SQL query...', time: 1300 },
        { label: 'Executing optimized query plan...', time: 900 },
        { label: 'Formatting results in table view...', time: 1200 },
      ],
      result: 'Q1 2026 Revenue Summary:\n• SaaS Subscriptions: ₹8,42,500 (57%)\n• Dedicated Support: ₹4,10,000 (28%)\n• Consulting Services: ₹2,29,950 (15%)\nTotal: ₹14,82,450.00 (Up 18% QoQ)',
    },
    csv: {
      sourceName: 'user_analytics_raw.csv',
      query: 'Find users with unusually high error rates this week.',
      steps: [
        { label: 'Loading CSV dataset into memory (4.2MB)...', time: 600 },
        { label: 'Analyzing columns: user_id, error_count, success_count...', time: 1000 },
        { label: 'Calculating standard deviations & anomalies...', time: 1200 },
        { label: 'Filtering outliers (Z-score > 2.5)...', time: 900 },
        { label: 'Compiling anomaly report...', time: 1400 },
      ],
      result: 'Detected 2 outlier users:\n• User #9142: Error Rate 42.1% (Rate limit violations)\n• User #1203: Error Rate 31.8% (Mismatched API credentials)\nRecommended Action: Email warning triggers are queued for these accounts.',
    },
  }

  // Trigger RAG Simulator workflow
  const startSimulation = () => {
    setSimStep(0);
    setSimProgress(0);
    setSimOutput('');
  }

  useEffect(() => {
    if (simStep === -1) return

    const currentConfig = simulations[selectedSource]
    if (simStep < currentConfig.steps.length) {
      const stepConfig = currentConfig.steps[simStep]
      
      // Animate progress bar for the current step
      const intervalTime = stepConfig.time / 20
      let localProgress = 0
      const timer = setInterval(() => {
        localProgress += 5
        setSimProgress(prev => Math.min(prev + 5, (simStep + 1) * (100 / currentConfig.steps.length)))
        if (localProgress >= 100) {
          clearInterval(timer)
          setSimStep(prev => prev + 1)
        }
      }, intervalTime)

      return () => clearInterval(timer)
    } else {
      // Typing effect for result
      let charIndex = 0
      const resultText = currentConfig.result
      const typingTimer = setInterval(() => {
        setSimOutput(prev => prev + resultText.charAt(charIndex))
        charIndex++
        if (charIndex >= resultText.length) {
          clearInterval(typingTimer)
        }
      }, 10)

      return () => clearInterval(typingTimer)
    }
  }, [simStep, selectedSource])

  // Start simulation initially or when source changes
  useEffect(() => {
    startSimulation()
  }, [selectedSource])

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  const faqData = [
    {
      q: 'How does semantic search work in CloudStore AI?',
      a: 'Unlike traditional keyword searches that require exact matches, CloudStore AI uses modern vector embeddings. It translates your search intent and the semantic meaning of your documents into high-dimensional vectors, allowing the AI agent to understand context, synonyms, and logical relationships to retrieve highly accurate files.',
    },
    {
      q: 'Is my document and database data safe?',
      a: 'Absolutely. We enforce end-to-end encryption at rest (AES-256) and in transit (TLS 1.3). Your data is stored in isolated tenant vaults. Most importantly, none of your sensitive company data is ever used to train public LLM models, guaranteeing complete corporate privacy.',
    },
    {
      q: 'Which database sources can I connect to?',
      a: 'We support major cloud storages (AWS S3, Google Cloud Storage, Azure Blob) as well as SQL and NoSQL databases, including PostgreSQL, MySQL, MongoDB, and Snowflake. Connecting takes seconds via secure OAuth read-only credentials.',
    },
    {
      q: 'What LLMs are backing the semantic engine?',
      a: 'By default, the query synthesis and data analysis tasks are handled by Anthropic\'s Claude 3.5 Sonnet and Claude 3 Haiku for high-speed analysis. We also provide connectors for OpenAI GPT-4o and custom private enterprise models depending on your security plan.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] via-[#E4F5FE] to-[#D5F2FF] dark:from-[#090D16] dark:via-[#0E1524] dark:to-[#0B101D] relative overflow-x-hidden flex flex-col font-sans select-none pb-0">
      
      {/* Blueprint background grid pattern */}
      <motion.div style={{ y: gridY }} className="absolute inset-0 grid-pattern opacity-60 dark:opacity-30 pointer-events-none z-0" />
      
      {/* Decorative ambient glowing blobs */}
      <motion.div style={{ y: blobY1 }} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-brandSky/30 to-transparent blur-3xl pointer-events-none z-0" />
      <motion.div style={{ y: blobY2 }} className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-brandSky/20 to-transparent blur-3xl pointer-events-none z-0" />
      <motion.div style={{ y: blobY3 }} className="absolute top-[60%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-brandSky/15 to-transparent blur-3xl pointer-events-none z-0" />

      {/* ─── Pill Floating Dark Navbar ────────────────────────────────────────── */}
      <div className="sticky top-4 z-50 w-full flex justify-center px-4 mb-4">
        <header className="bg-[#0B1521]/70 backdrop-blur-xl rounded-full border border-white/15 shadow-lg max-w-4xl w-full flex items-center justify-between py-2.5 px-6 sm:px-8 text-white relative">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Bot size={16} className="text-brandSky animate-float" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight">
              CloudStore AI
            </span>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="/" className="text-brandSky hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* CTA: Dashboard link */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-xs font-extrabold text-brandSky hover:text-white transition-all cursor-pointer px-4.5 py-1.5 rounded-full border border-brandSky/30 hover:border-brandSky bg-brandSky/5 hover:bg-brandSky/10 hover:shadow-[0_0_12px_rgba(56,189,248,0.2)]"
            >
              Dashboard
            </button>
          </div>

          {/* Mobile menu hamburger toggle button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden p-1.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Mobile menu drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute top-[120%] left-0 right-0 overflow-hidden rounded-2xl border border-white/15 bg-[#0B1521]/75 backdrop-blur-xl p-5 flex flex-col gap-4 select-none shadow-xl text-left"
              >
                <nav className="flex flex-col gap-2.5 text-xs font-bold text-slate-350">
                  <a href="/" onClick={() => setMobileMenuOpen(false)} className="text-brandSky hover:text-white py-1.5 border-b border-white/5">Home</a>
                  <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1.5 border-b border-white/5">Features</a>
                  <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1.5 border-b border-white/5">Interactive Demo</a>
                  <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1.5 border-b border-white/5">Pricing</a>
                  <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1.5">FAQ</a>
                </nav>
                <button 
                  onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                  className="w-full py-2.5 rounded-full text-xs font-extrabold text-[#0B1521] bg-brandSky hover:bg-brandSky/90 shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all text-center"
                >
                  Dashboard
                </button>

              </motion.div>
            )}
          </AnimatePresence>
        </header>
      </div>

      {/* Main outer container */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-8 pt-2 flex-1 flex flex-col relative z-10 gap-16 md:gap-24 pb-20">
        
        {/* ─── Hero Section ───────────────────────────────────────────────────── */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/40 dark:bg-[#131B2E]/40 rounded-3xl p-6 sm:py-8 sm:px-10 border border-white/60 dark:border-white/10 shadow-lg relative overflow-hidden backdrop-blur-sm"
        >
          {/* Ambient blob inside card */}
          <div className="absolute top-[-30%] right-[-10%] w-[350px] h-[350px] rounded-full bg-brandSky/25 blur-3xl pointer-events-none" />

          {/* Left Column: Headline & Subtitle */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-2"
            >
              <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-[54px] text-brandNavy dark:text-white tracking-tight leading-[1.08] mb-6">
                Cloud Storage<br />
                Revolutionized<br />
                with AI{' '}
                <span className="inline-flex items-center gap-1 bg-brandSky/30 dark:bg-brandSky/20 px-3.5 py-1 rounded-xl text-brandNavy dark:text-brandSky text-3xl sm:text-4xl lg:text-[42px] font-bold align-middle border border-brandSky/50 dark:border-brandSky/30 shadow-inner">
                  <Sparkles size={26} className="text-brandNavy dark:text-brandSky shrink-0 animate-pulse" />
                  Powered
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-brandNavy/75 dark:text-slate-300 max-w-lg leading-relaxed mb-8">
                Instantly search, query, and analyze your unstructured files and active databases with our cutting-edge semantic RAG engine. Find answers, not just files, in milliseconds.
              </p>
            </motion.div>

            {/* Email Form */}
            <motion.form 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              onSubmit={handleGetStarted}
              className="flex items-center bg-white dark:bg-[#1E293B] rounded-full p-2 border border-brandNavy/10 dark:border-white/10 shadow-md max-w-md w-full mb-4 focus-within:ring-2 focus-within:ring-brandSky transition-all hover:border-brandNavy/20 dark:hover:border-white/20"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="flex-1 bg-transparent border-none outline-none text-sm text-brandNavy dark:text-white pl-5 pr-2 placeholder-brandNavy/40 dark:placeholder-white/45"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full text-sm font-bold text-white bg-brandNavy hover:bg-brandNavy/95 shadow-md hover:scale-[1.02] active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </motion.form>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-xs text-brandNavy/60 dark:text-slate-400 flex items-center gap-1.5 pl-2"
            >
              <ShieldCheck size={14} className="text-brandEmerald" />
              30 day free trial · No credit card required · Instant Setup
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
            <div className="relative z-10 w-full max-w-[270px] aspect-[9/19.5] bg-[#111827] rounded-[48px] p-2.5 shadow-2xl border-[5px] border-slate-350 hover:scale-[1.01] transition-transform duration-500">
              
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
                  <p className="text-[8px] text-slate-400 text-center select-none font-bold my-1">Today</p>
                  
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
                      Find invoices above ₹10,000 from January.
                    </div>
                  </div>

                  {/* Bot reply */}
                  <div className="flex gap-1.5 items-start mt-1">
                    <div className="w-4 h-4 rounded-full bg-brandNavy shrink-0 flex items-center justify-center text-[6px] text-white">🤖</div>
                    <div className="bg-slate-100 border border-slate-200 text-brandNavy text-[9px] p-2 rounded-2xl rounded-tl-sm text-left max-w-[80%] shadow-sm leading-normal">
                      Sure! I found 3 matching files in your vault. Total invoices sum is ₹42,500.
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
              className="absolute top-10 left-4 sm:left-4 z-20 bg-white dark:bg-[#131B2E] border border-brandNavy/10 dark:border-white/10 p-3 rounded-2xl shadow-md max-w-[130px] hidden sm:block"
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-lg">🏆</span>
                <span className="text-[10px] font-bold text-brandNavy dark:text-white mt-1">#1 AI Search</span>
                <span className="text-[8px] text-slate-400 dark:text-slate-400 mt-0.5 leading-tight">for Cloud Docs</span>
              </div>
            </motion.div>

            {/* Floating Badge 2: Latency Spark Chart (Bottom Left) */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-20 left-4 sm:left-0 z-20 bg-brandNavy p-3 rounded-2xl shadow-xl w-[130px] border border-brandNavy/35 hidden sm:block"
            >
              <div className="text-left flex flex-col justify-between h-full">
                <span className="text-[9px] font-bold text-slate-350 flex items-center gap-1">
                  ⏱ Latency Reduc
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
              className="absolute bottom-12 right-4 sm:right-6 z-20 bg-white dark:bg-[#131B2E] border border-brandNavy/10 dark:border-white/10 p-3.5 rounded-2xl shadow-md min-w-[140px] hidden sm:block"
            >
              <div className="flex flex-col items-center">
                {/* Small avatar stack */}
                <div className="flex items-center -space-x-1.5">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60" className="w-6 h-6 rounded-full border border-white object-cover" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60" className="w-6 h-6 rounded-full border border-white object-cover" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60" className="w-6 h-6 rounded-full border border-white object-cover" />
                </div>
                <span className="text-xs font-extrabold text-brandNavy dark:text-white mt-1.5">100K+</span>
                <span className="text-[7px] font-bold text-slate-400 dark:text-slate-450 tracking-wider uppercase mt-0.5">Satisfied Users</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ─── Interactive RAG Simulator Section (New) ────────────────────────── */}
        <motion.section 
          id="demo" 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="scroll-mt-24"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brandNavy dark:text-white tracking-tight">
              Experience Intelligent RAG in Real Time
            </h2>
            <p className="text-sm sm:text-base text-brandNavy/70 dark:text-slate-300 mt-3">
              Select a simulated data source, query the system, and watch our RAG engine retrieve, chunk, and synthesize details with ultra-low latency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Controller Panel: Source Selection & Queries */}
            <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
              <div className="glass bg-white/40 dark:bg-[#131B2E]/40 backdrop-blur-xl rounded-2xl p-6 border border-white/65 dark:border-white/10 shadow-md flex-1 flex flex-col">
                <span className="text-2xs font-extrabold text-brandNavy/50 dark:text-slate-400 tracking-wider uppercase mb-4 block">
                  Step 1: Choose Data Source
                </span>
                <div className="flex flex-col gap-3 flex-1 justify-center">
                  {[
                    { id: 'pdf', title: 'PDF Contract/Invoice', icon: <FileText size={18} />, color: 'bg-indigo-50 border-indigo-150 text-indigo-700' },
                    { id: 'db', title: 'PostgreSQL Database', icon: <Database size={18} />, color: 'bg-emerald-50 border-emerald-150 text-emerald-700' },
                    { id: 'csv', title: 'CSV Finance Analytics', icon: <Layers size={18} />, color: 'bg-amber-50 border-amber-150 text-brandSky' }
                  ].map(src => (
                    <button
                      key={src.id}
                      onClick={() => {
                        if (simStep === -1 || simStep === simulations[selectedSource].steps.length) {
                          setSelectedSource(src.id as any);
                        }
                      }}
                      className={`flex items-center gap-3.5 p-4 rounded-xl border text-left font-bold text-sm transition-all ${
                        selectedSource === src.id 
                          ? 'bg-brandNavy border-brandNavy dark:border-white/10 text-white shadow-md scale-[1.01]'
                          : 'bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 text-brandNavy/75 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-brandNavy/20 dark:hover:border-white/20'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedSource === src.id ? 'bg-white/10 text-brandSky' : 'bg-slate-100 text-brandNavy/60'}`}>
                        {src.icon}
                      </div>
                      <div className="flex-1">
                        <p className="leading-tight">{src.title}</p>
                        <p className={`text-[10px] font-normal mt-0.5 ${selectedSource === src.id ? 'text-brandSky/85' : 'text-slate-400'}`}>
                          {simulations[src.id as 'pdf'|'db'|'csv'].sourceName}
                        </p>
                      </div>
                      <Check size={16} className={`opacity-0 transition-opacity ${selectedSource === src.id ? 'opacity-100 text-brandSky' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Input details preview */}
              <div className="glass bg-white/40 dark:bg-[#131B2E]/40 backdrop-blur-xl rounded-2xl p-6 border border-white/65 dark:border-white/10 shadow-md">
                <span className="text-2xs font-extrabold text-brandNavy/50 dark:text-slate-400 tracking-wider uppercase mb-2 block">
                  Step 2: Natural Language Query
                </span>
                <div className="bg-white dark:bg-[#0B1521]/60 rounded-xl p-3.5 border border-brandNavy/10 dark:border-white/10 text-left relative">
                  <div className="flex gap-2 items-center mb-1">
                    <Bot size={14} className="text-brandNavy/40 dark:text-slate-550" />
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Ask the file anything:</span>
                  </div>
                  <p className="text-xs font-bold text-brandNavy dark:text-slate-200 leading-relaxed">
                    "{simulations[selectedSource].query}"
                  </p>
                </div>
                <button
                  onClick={startSimulation}
                  disabled={simStep !== -1 && simStep < simulations[selectedSource].steps.length}
                  className="w-full mt-4 py-3 rounded-xl bg-brandNavy hover:bg-brandNavy/95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Cpu size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
                  Re-Run RAG Simulation
                </button>
              </div>
            </div>

            {/* Right Terminal Panel: AI RAG Pipeline log */}
            <div className="lg:col-span-7 bg-[#0b1329] text-white rounded-2xl border border-brandNavy/40 shadow-xl overflow-hidden flex flex-col font-mono text-xs select-text min-h-[400px]">
              
              {/* Terminal Header */}
              <div className="bg-[#121c38] px-4 py-3 border-b border-brandNavy/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-450 font-semibold select-none flex items-center gap-1.5">
                  <Activity size={10} className="text-brandSky animate-pulse" />
                  rag_pipeline_log.sh
                </span>
                <span className="text-[10px] text-slate-500 select-none">UTC+5:30</span>
              </div>

              {/* Terminal Logs Content */}
              <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto leading-relaxed select-text">
                
                {/* Active Logs Stack */}
                <div className="flex flex-col gap-2">
                  <p className="text-slate-500 select-none">$ cloudstore-ai query --source={selectedSource} --prompt="{simulations[selectedSource].query}"</p>
                  
                  {simulations[selectedSource].steps.map((step, idx) => {
                    const isPassed = simStep > idx;
                    const isActive = simStep === idx;
                    if (!isPassed && !isActive) return null;
                    return (
                      <div key={idx} className="flex gap-2 items-start animate-fade-in">
                        {isPassed ? (
                          <span className="text-emerald-400 select-none">✔</span>
                        ) : (
                          <span className="text-brandSky animate-pulse select-none">●</span>
                        )}
                        <p className={isPassed ? 'text-slate-350' : 'text-brandSky font-bold'}>
                          {step.label}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Progress bar */}
                {simStep < simulations[selectedSource].steps.length && (
                  <div className="w-full bg-[#121c38] rounded-full h-1.5 mt-1 overflow-hidden">
                    <motion.div 
                      className="bg-brandSky h-full"
                      style={{ width: `${simProgress}%` }}
                    />
                  </div>
                )}

                {/* Simulated Synthesis output */}
                {simStep === simulations[selectedSource].steps.length && (
                  <div className="border-t border-brandNavy/35 pt-4 mt-2 animate-fade-in flex flex-col gap-2 text-left">
                    <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider select-none flex items-center gap-1">
                      <Sparkles size={11} className="text-brandSky" />
                      Synthesized AI Answer
                    </span>
                    <div className="bg-[#121c38]/50 border border-brandNavy/30 rounded-lg p-3 text-slate-200 text-xs leading-normal select-text whitespace-pre-line overflow-x-auto break-words">
                      {simOutput}
                      {simOutput.length < simulations[selectedSource].result.length && (
                        <span className="w-1.5 h-3 bg-brandSky inline-block ml-0.5 animate-pulse" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── Core Features Showcase Grid (Enhanced) ───────────────────────── */}
        <motion.section 
          id="features" 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="scroll-mt-24"
        >
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brandNavy dark:text-white tracking-tight">
              Enterprise-Grade AI Storage Engine
            </h2>
            <p className="text-sm sm:text-base text-brandNavy/70 dark:text-slate-300 mt-3">
              Ditch folders and keywords. Instantly access semantic vaults secured with military-grade safety systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 w-full">
            
            {/* Stat Card */}
            <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-brandNavy rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[220px] relative overflow-hidden shadow-lg border border-brandNavy/30 text-left hover:scale-[1.01] transition-transform">
              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl font-display font-extrabold text-white">24K+</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1">Total Daily Queries</span>
                </div>
                <span className="text-[9px] font-bold text-brandEmerald px-2.5 py-1 rounded-full bg-brandEmerald/15 border border-brandEmerald/30">+4.2%</span>
              </div>
              <div className="z-10 mt-auto">
                <p className="text-xs font-bold text-slate-350 flex items-center gap-1.5">
                  <Activity size={12} className="text-brandSky animate-pulse" />
                  RAG Embeddings Cache Active
                </p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Average vector similarity index lookup complete in 3.4ms with 99.8% precision.
                </p>
              </div>
              {/* Glowing ambient blob */}
              <div className="absolute right-[-10%] bottom-[-20%] w-32 h-32 rounded-full bg-brandSky/20 blur-xl" />
            </div>

            {/* Smart Category Tags Card */}
            <div className="col-span-1 md:col-span-1 lg:col-span-4 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[220px] relative overflow-hidden shadow-lg border border-white/75 dark:border-white/10 bg-gradient-to-br from-[#E0F6FF] to-[#BFE9FF] dark:from-[#131B2E] dark:to-[#0B1220] hover:scale-[1.01] transition-all duration-300 group">
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-30 mix-blend-overlay grid-pattern" />
              
              {/* Header search box mockup */}
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl p-2.5 shadow-sm w-full flex items-center gap-2 relative z-10 transition-all group-hover:bg-white dark:group-hover:bg-white/10">
                <Search size={12} className="text-brandNavy/50 dark:text-slate-400" />
                <span className="text-[10px] text-brandNavy/40 dark:text-slate-450 font-bold select-none">
                  Filter intent: <span className="text-brandNavy dark:text-brandSky animate-pulse font-extrabold">contracts...</span>
                </span>
                <div className="w-1.5 h-3 bg-brandNavy dark:bg-brandSky shrink-0 animate-pulse ml-auto" />
              </div>

              {/* Staggered tags row wrap layout */}
              <div className="flex flex-wrap gap-1.5 my-4 relative z-10">
                {[
                  { text: 'Search PDF', active: false },
                  { text: 'Contracts', active: true },
                  { text: 'Analyze CSV', active: false },
                  { text: 'Summarize', active: false },
                  { text: 'Query DB', active: true },
                ].map((tag) => (
                  <motion.span
                    key={tag.text}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate('/dashboard')}
                    className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                      tag.active 
                        ? 'bg-brandNavy dark:bg-brandSky text-white dark:text-brandNavy border border-brandNavy/20 dark:border-brandSky/20' 
                        : 'bg-white/80 dark:bg-white/5 text-brandNavy dark:text-slate-350 border border-white/40 dark:border-white/10 hover:bg-white dark:hover:bg-white/10'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${tag.active ? 'bg-brandSky' : 'bg-slate-350'}`} />
                    {tag.text}
                  </motion.span>
                ))}
              </div>

              {/* Card Footer details */}
              <div className="z-10 mt-auto text-left border-t border-brandNavy/5 dark:border-white/5 pt-3">
                <p className="text-xs font-bold text-brandNavy dark:text-slate-200 flex items-center gap-1">
                  <Sparkles size={12} className="text-brandNavy/65 dark:text-brandSky" />
                  Semantic Intent Tags
                </p>
                <p className="text-[9px] text-brandNavy/70 dark:text-slate-400 mt-0.5">Filter entire database resources by AI predicted intents.</p>
              </div>
            </div>

            {/* Cost Savings Analytics */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white dark:bg-[#131B2E]/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[220px] border border-white/80 dark:border-white/10 shadow-md text-left hover:scale-[1.01] transition-transform">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-brandNavy/10 dark:bg-brandSky/10 flex items-center justify-center">
                  <Bot size={13} className="text-brandNavy dark:text-brandSky" />
                </div>
                <span className="text-[10px] font-bold text-brandNavy dark:text-slate-200">Deduplication Insights</span>
              </div>
              
              <p className="text-xs text-brandNavy/80 dark:text-slate-350 leading-relaxed my-3">
                Identified and indexed <span className="font-extrabold underline text-brandNavy dark:text-white">18.2% duplicate assets</span>. Saved client storage fees by up to ₹8,400 monthly.
              </p>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-fit flex items-center gap-1.5 px-4.5 py-2 rounded-full text-[10px] font-bold text-white bg-brandNavy hover:bg-brandNavy/95 shadow-sm transition-all"
              >
                View Analytics
                <ArrowRight size={10} />
              </button>
            </div>

            {/* Detailed Feature 1 */}
            <div className="col-span-1 md:col-span-1 lg:col-span-3 glass-card rounded-3xl p-6 hover:scale-[1.02] transition-transform text-left">
              <div className="w-10 h-10 rounded-xl bg-brandNavy/5 dark:bg-white/5 flex items-center justify-center mb-4">
                <Search className="text-brandNavy dark:text-brandSky" size={20} />
              </div>
              <h3 className="font-display font-bold text-sm text-brandNavy dark:text-slate-200">Instant Search Lookup</h3>
              <p className="text-2xs text-slate-450 dark:text-slate-400 mt-2 leading-relaxed">
                Query deep files inside your drive instantly. RAG pipeline extracts text paragraphs and returns exactly the content you need.
              </p>
            </div>

            {/* Detailed Feature 2 */}
            <div className="col-span-1 md:col-span-1 lg:col-span-3 glass-card rounded-3xl p-6 hover:scale-[1.02] transition-transform text-left">
              <div className="w-10 h-10 rounded-xl bg-brandNavy/5 dark:bg-white/5 flex items-center justify-center mb-4">
                <Lock className="text-brandNavy dark:text-brandSky" size={18} />
              </div>
              <h3 className="font-display font-bold text-sm text-brandNavy dark:text-slate-200">Safety Guaranteed</h3>
              <p className="text-2xs text-slate-450 dark:text-slate-400 mt-2 leading-relaxed">
                Fully isolated vaults ensure zero leakage. End-to-end audit keys prevent unauthorized query attempts on documents.
              </p>
            </div>

            {/* Detailed Feature 3 */}
            <div className="col-span-1 md:col-span-1 lg:col-span-3 glass-card rounded-3xl p-6 hover:scale-[1.02] transition-transform text-left">
              <div className="w-10 h-10 rounded-xl bg-brandNavy/5 dark:bg-white/5 flex items-center justify-center mb-4">
                <DollarSign className="text-brandNavy dark:text-brandSky" size={18} />
              </div>
              <h3 className="font-display font-bold text-sm text-brandNavy dark:text-slate-200">Optimized Cost Limits</h3>
              <p className="text-2xs text-slate-450 dark:text-slate-400 mt-2 leading-relaxed">
                Cache embeddings locally to reduce direct LLM calls. Enjoy prompt cost savings up to 35% using semantic response layers.
              </p>
            </div>

            {/* Detailed Feature 4 */}
            <div className="col-span-1 md:col-span-1 lg:col-span-3 glass-card rounded-3xl p-6 hover:scale-[1.02] transition-transform text-left">
              <div className="w-10 h-10 rounded-xl bg-brandNavy/5 dark:bg-white/5 flex items-center justify-center mb-4">
                <PhoneCall className="text-brandNavy dark:text-brandSky" size={18} />
              </div>
              <h3 className="font-display font-bold text-sm text-brandNavy dark:text-slate-200">24/7 Agent Availability</h3>
              <p className="text-2xs text-slate-450 dark:text-slate-400 mt-2 leading-relaxed">
                Always active automated agent indexes, cleans, and monitors files background task updates for seamless collaboration.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ─── Interactive Pricing Section (New) ──────────────────────────────── */}
        <motion.section 
          id="pricing" 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="scroll-mt-24"
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brandNavy dark:text-white tracking-tight">
              Scale-Friendly, Simple Pricing
            </h2>
            <p className="text-sm sm:text-base text-brandNavy/70 dark:text-slate-300 mt-3">
              Start searching for free and upgrade as your team's semantic vaults and query volumes grow.
            </p>

            {/* Toggle Billing Period */}
            <div className="flex items-center justify-center gap-3.5 mt-8">
              <span className={`text-xs font-bold transition-colors ${billingPeriod === 'monthly' ? 'text-brandNavy dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                Billed Monthly
              </span>
              <button 
                onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="w-12 h-6 bg-brandNavy/15 dark:bg-brandSky/10 hover:bg-brandNavy/25 rounded-full p-1 transition-all relative flex items-center"
              >
                <div className={`w-4 h-4 rounded-full bg-brandNavy dark:bg-brandSky absolute shadow-sm transition-all ${billingPeriod === 'yearly' ? 'right-1' : 'left-1'}`} />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold transition-colors ${billingPeriod === 'yearly' ? 'text-brandNavy dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                  Billed Yearly
                </span>
                <span className="bg-brandEmerald/15 text-brandEmerald border border-brandEmerald/30 px-2 py-0.5 rounded-full text-[9px] font-extrabold select-none">
                  Save 20%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* Starter Plan */}
            <div className="glass bg-white/40 dark:bg-[#131B2E]/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/65 dark:border-white/10 shadow-md flex flex-col justify-between text-left hover:scale-[1.01] transition-transform">
              <div>
                <span className="text-xs font-extrabold text-brandNavy/60 dark:text-slate-400 uppercase tracking-widest block">Starter</span>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-display font-extrabold text-brandNavy dark:text-white">₹0</span>
                  <span className="text-2xs text-slate-400 dark:text-slate-500 font-semibold">/ month</span>
                </div>
                <p className="text-2xs text-slate-450 dark:text-slate-400 mt-3 leading-normal">
                  Perfect for testing RAG indexing and running semantic search on personal documents.
                </p>

                <div className="border-t border-brandNavy/10 dark:border-white/10 my-5" />

                <ul className="flex flex-col gap-3">
                  {[
                    'Up to 1 GB Storage Vault',
                    '50 queries per month',
                    'Connects to Google Drive',
                    'Standard search latency (150ms)',
                    'Community email support'
                  ].map(feat => (
                    <li key={feat} className="flex items-start gap-2 text-2xs font-semibold text-brandNavy/85 dark:text-slate-300">
                      <Check size={12} className="text-brandEmerald shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full mt-6 py-2.5 rounded-full border border-brandNavy/10 dark:border-white/10 text-brandNavy dark:text-brandSky bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 font-bold text-xs shadow-sm transition-all text-center"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="bg-white/70 dark:bg-[#131B2E]/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-brandNavy dark:border-brandSky shadow-xl flex flex-col justify-between text-left relative overflow-hidden hover:scale-[1.01] transition-transform hover:shadow-[0_0_30px_rgba(131,233,255,0.15)]">
              <div className="absolute top-3 right-3 bg-brandNavy dark:bg-brandSky text-brandSky dark:text-brandNavy px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wider uppercase select-none">
                Popular
              </div>
              <div>
                <span className="text-xs font-extrabold text-brandNavy dark:text-brandSky uppercase tracking-widest block">Pro RAG</span>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-display font-extrabold text-brandNavy dark:text-white">
                    {billingPeriod === 'monthly' ? '₹1,999' : '₹1,599'}
                  </span>
                  <span className="text-2xs text-slate-400 dark:text-slate-500 font-semibold">/ month</span>
                </div>
                <p className="text-2xs text-slate-450 dark:text-slate-400 mt-3 leading-normal">
                  For teams and businesses looking to automate database querying and sync multiple shared drives.
                </p>

                <div className="border-t border-brandNavy/10 dark:border-white/10 my-5" />

                <ul className="flex flex-col gap-3">
                  {[
                    'Up to 50 GB Secure Storage Vault',
                    'Unlimited semantic queries',
                    'Connect S3, Postgres, and MongoDB',
                    'AI Synthesized answers (Claude 3.5)',
                    'Smart deduplication reports',
                    'Dedicated priority support'
                  ].map(feat => (
                    <li key={feat} className="flex items-start gap-2 text-2xs font-semibold text-brandNavy/85 dark:text-slate-350 font-medium">
                      <Check size={12} className="text-brandEmerald shrink-0 mt-0.5" />
                      <span className={feat === 'Unlimited semantic queries' ? 'font-extrabold text-brandNavy dark:text-white' : ''}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full mt-6 py-3 rounded-full text-white dark:text-brandNavy bg-brandNavy dark:bg-brandSky hover:bg-brandNavy/95 dark:hover:bg-brandSky/90 font-bold text-xs shadow-md transition-all text-center hover:shadow-lg"
              >
                Upgrade to Pro RAG
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="glass bg-white/40 dark:bg-[#131B2E]/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/65 dark:border-white/10 shadow-md flex flex-col justify-between text-left hover:scale-[1.01] transition-transform col-span-1 md:col-span-2 lg:col-span-1">
              <div>
                <span className="text-xs font-extrabold text-brandNavy/60 dark:text-slate-400 uppercase tracking-widest block">Enterprise</span>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-display font-extrabold text-brandNavy dark:text-white">Custom</span>
                </div>
                <p className="text-2xs text-slate-450 dark:text-slate-400 mt-3 leading-normal">
                  For custom LLM deployments, private vector index instances, and complex storage arrays.
                </p>

                <div className="border-t border-brandNavy/10 dark:border-white/10 my-5" />

                <ul className="flex flex-col gap-3">
                  {[
                    'Custom cloud storage size limit',
                    'Private Vector storage keys',
                    'On-prem database deployment option',
                    'Custom LLM fine-tuning configuration',
                    'SOC2 compliance reports',
                    'Dedicated Slack/Teams channel support'
                  ].map(feat => (
                    <li key={feat} className="flex items-start gap-2 text-2xs font-semibold text-brandNavy/85 dark:text-slate-300">
                      <Check size={12} className="text-brandEmerald shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full mt-6 py-2.5 rounded-full border border-brandNavy/10 dark:border-white/10 text-brandNavy dark:text-brandSky bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 font-bold text-xs shadow-sm transition-all text-center"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </motion.section>

        {/* ─── Frequently Asked Questions Section ────────────────────────────── */}
        <motion.section
          id="faq"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="scroll-mt-24 max-w-4xl mx-auto mt-24 mb-24"
        >
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brandNavy dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-brandNavy/70 dark:text-slate-300 mt-3">
              Clear answers to technical details, privacy systems, and integration pipelines.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqData.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div 
                  key={index} 
                  className="glass bg-white/40 dark:bg-[#131B2E]/40 backdrop-blur-xl rounded-2xl border border-white/65 dark:border-white/10 shadow-sm overflow-hidden text-left hover:bg-white/45 dark:hover:bg-white/5 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full py-5 px-6 flex items-center justify-between font-bold text-sm text-brandNavy dark:text-slate-200 hover:text-brandNavy/95 hover:bg-white/20 dark:hover:bg-white/5 transition-all text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={16} className="text-brandNavy/40 dark:text-slate-500 shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-brandNavy/50 dark:text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-brandNavy/50 dark:text-slate-400" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-5 pt-1 text-xs text-brandNavy/75 dark:text-slate-300 leading-relaxed border-t border-brandNavy/5 dark:border-white/5 whitespace-pre-line">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* ─── Global Call-to-Action (CTA) Section ────────────────────────────── */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-brandNavy/80 backdrop-blur-xl border border-white/15 shadow-2xl rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center text-white"
        >
          {/* Ambient circular vectors */}
          <div className="absolute top-[-40%] left-[-20%] w-[350px] h-[350px] rounded-full bg-brandSky/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-40%] right-[-20%] w-[350px] h-[350px] rounded-full bg-brandSky/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="bg-brandSky/10 text-brandSky border border-brandSky/25 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase select-none">
              Deploy Instantly
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mt-5 leading-tight">
              Ready to Supercharge Your Data Vaults?
            </h2>
            <p className="text-sm text-slate-350 mt-4 leading-relaxed max-w-lg">
              Unlock the power of conversational RAG on top of PDF documents, Postgres tables, and S3 folders in less than two minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-bold text-brandNavy bg-brandSky hover:bg-brandSky/90 shadow-md hover:scale-[1.02] active:scale-95 transition-all text-center shadow-[0_0_15px_rgba(56,189,248,0.35)]"
              >
                Access Dashboard
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 hover:scale-[1.02] active:scale-95 transition-all text-center backdrop-blur-md"
              >
                Schedule Team Demo
              </button>
            </div>
          </div>
        </motion.section>
      </div>

      {/* ─── Structured Premium Footer (New) ────────────────────────────────── */}
      <footer className="w-full px-4 sm:px-8 mt-16 relative z-10 font-sans max-w-[1440px] mx-auto">
        {/* Main Card Container */}
        <div className="glass bg-white/40 dark:bg-[#0B1521]/70 backdrop-blur-xl rounded-3xl border border-white/65 dark:border-white/10 p-8 sm:p-12 shadow-md relative overflow-hidden text-brandNavy dark:text-white flex flex-col gap-10">
          
          {/* Watermark Logo in Background */}
          <div className="absolute bottom-[-15%] left-[-8%] text-brandNavy/[0.02] dark:text-white/[0.01] pointer-events-none select-none hidden lg:block">
            <Bot size={350} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 relative z-10">
            {/* Left Big Title Column */}
            <div className="col-span-1 sm:col-span-2 md:col-span-5 flex flex-col justify-center items-start text-left gap-2">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[34px] tracking-tight leading-[1.1] text-brandNavy dark:text-white">
                When Cloud Storage Checks Out,<br />
                <span className="text-brandSky font-black bg-brandSky/25 dark:bg-brandSky/20 px-2 py-0.5 rounded-lg border border-brandSky/40 dark:border-brandSky/30 shadow-inner inline-block mt-1.5 align-middle">
                  CloudStore AI
                </span> Checks In!
              </h3>
              <div 
                onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-1 mt-6 text-sm font-bold text-brandNavy/75 dark:text-slate-300 hover:text-brandNavy dark:hover:text-brandSky transition-colors cursor-pointer select-none"
              >
                Try Now
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Nav Links Column 1: Products */}
            <div className="col-span-1 sm:col-span-1 md:col-span-2 flex flex-col gap-3.5 text-left">
              <h4 className="text-2xs font-extrabold text-brandNavy/50 dark:text-slate-400 uppercase tracking-widest">Products</h4>
              <ul className="flex flex-col gap-2.5 text-xs text-brandNavy/75 dark:text-slate-350 font-semibold">
                <li><a href="#features" className="hover:text-brandNavy dark:hover:text-brandSky transition-colors">Semantic Document RAG</a></li>
                <li><a href="#demo" className="hover:text-brandNavy dark:hover:text-brandSky transition-colors">Multi-source Databases</a></li>
                <li><a href="#demo" className="hover:text-brandNavy dark:hover:text-brandSky transition-colors">Custom LLM Adapters</a></li>
                <li><a href="/dashboard" className="hover:text-brandNavy dark:hover:text-brandSky transition-colors">Cloud Cache Config</a></li>
              </ul>
            </div>

            {/* Nav Links Column 2: Resources */}
            <div className="col-span-1 sm:col-span-1 md:col-span-2 flex flex-col gap-3.5 text-left">
              <h4 className="text-2xs font-extrabold text-brandNavy/50 dark:text-slate-400 uppercase tracking-widest">Resources</h4>
              <ul className="flex flex-col gap-2.5 text-xs text-brandNavy/75 dark:text-slate-350 font-semibold">
                <li><a href="#about" className="hover:text-brandNavy dark:hover:text-brandSky transition-colors">Documentation</a></li>
                <li><a href="#blog" className="hover:text-brandNavy dark:hover:text-brandSky transition-colors">Demo Playground</a></li>
                <li><a href="#contact" className="hover:text-brandNavy dark:hover:text-brandSky transition-colors">API Reference Guide</a></li>
                <li><a href="#about" className="hover:text-brandNavy dark:hover:text-brandSky transition-colors">Security Vault Keys</a></li>
              </ul>
            </div>

            {/* Nav Links Column 3: Legal & Company */}
            <div className="col-span-1 sm:col-span-2 md:col-span-3 flex flex-col gap-3.5 text-left">
              <h4 className="text-2xs font-extrabold text-brandNavy/50 dark:text-slate-400 uppercase tracking-widest">Legal & Security</h4>
              <ul className="flex flex-col gap-2.5 text-xs text-brandNavy/75 dark:text-slate-350 font-semibold">
                <li><a href="#privacy" className="hover:text-brandNavy dark:hover:text-brandSky transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-brandNavy dark:hover:text-brandSky transition-colors">Terms & Conditions</a></li>
                <li><a href="#security" className="hover:text-brandNavy dark:hover:text-brandSky transition-colors">Vault Security Specs</a></li>
                <li><a href="#support" className="hover:text-brandNavy dark:hover:text-brandSky transition-colors flex items-center gap-1">FAQ <span className="bg-brandEmerald/10 text-brandEmerald px-1.5 py-0.5 rounded text-[8px] font-black border border-brandEmerald/20 animate-pulse">Live</span></a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Row inside card: Social links */}
          <div className="border-t border-brandNavy/10 dark:border-white/10 pt-6 flex items-center justify-end gap-5">
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-brandNavy/65 dark:text-slate-400 hover:text-brandNavy dark:hover:text-brandSky hover:scale-105 transition-all" aria-label="Instagram">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            {/* Twitter / X */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-brandNavy/65 dark:text-slate-400 hover:text-brandNavy dark:hover:text-brandSky hover:scale-105 transition-all" aria-label="Twitter">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-brandNavy/65 dark:text-slate-400 hover:text-brandNavy dark:hover:text-brandSky hover:scale-105 transition-all" aria-label="LinkedIn">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>

        </div>

        {/* Centered copyright notice outside the card */}
        <p className="text-[10px] text-brandNavy/50 dark:text-slate-500 mt-6 select-none text-center font-bold">
          Copyright © {new Date().getFullYear()} CloudStore AI Inc. All rights reserved
        </p>
      </footer>
    </div>
  )
}
