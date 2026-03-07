import { useState, useEffect, useCallback, useRef } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, Lock, BarChart3, Search,
  ArrowRight, TrendingUp, BookOpen,
} from 'lucide-react'
import { KNOWLEDGE_ITEMS, SCAN_MESSAGES, MOCK_SCORE, MOCK_RESULT, NAV_ITEMS } from './data'
import InsightPage from './InsightPage'
import FullReportPage from './FullReportPage'

/* ══════════════════════════════════════════════════
   Carousel (infinite loop, auto-scroll, hover-pause)
   ══════════════════════════════════════════════════ */

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return isMobile
}

function KnowledgeCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const animRef = useRef<number>(0)
  const posRef = useRef(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) return // Mobile: no auto-scroll
    const track = trackRef.current
    if (!track) return
    const speed = 0.5
    const totalWidth = track.scrollWidth / 2
    const animate = () => {
      if (!isPaused) {
        posRef.current += speed
        if (posRef.current >= totalWidth) posRef.current = 0
        track.style.transform = `translateX(-${posRef.current}px)`
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [isPaused, isMobile])

  const items = isMobile ? KNOWLEDGE_ITEMS : [...KNOWLEDGE_ITEMS, ...KNOWLEDGE_ITEMS]

  const renderKnowledgeCard = (item: typeof KNOWLEDGE_ITEMS[0], i: number) => (
    <Link key={`${item.slug}-${i}`} to={`/insights/${item.slug}`}
      className={`card group cursor-pointer flex-shrink-0 !p-7 ${isMobile ? 'w-[85vw] snap-center' : 'w-[340px]'}`}
      style={{
        opacity: hoveredSlug && hoveredSlug !== item.slug ? 0.5 : 1,
        filter: hoveredSlug && hoveredSlug !== item.slug ? 'blur(4px)' : 'blur(0px)',
        transform: hoveredSlug === item.slug ? 'scale(1.03)' : 'scale(1)',
        borderColor: hoveredSlug === item.slug ? 'rgba(99,102,241,0.3)' : undefined,
        boxShadow: hoveredSlug === item.slug
          ? '0 20px 50px rgba(99,102,241,0.12), 0 4px 16px rgba(15,23,42,0.06)'
          : '0 1px 3px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.03)',
        transition: 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
      }}
      onMouseEnter={() => { setIsPaused(true); setHoveredSlug(item.slug) }}
      onMouseLeave={() => { setIsPaused(false); setHoveredSlug(null) }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-10 h-10 rounded-xl ${item.color} border flex items-center justify-center`}>
          <item.icon className="w-4 h-4" />
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
      </div>
      <h3 className="text-[16px] font-bold text-base mb-1">{item.title}</h3>
      <p className="text-[12px] text-gray-400 mb-3 font-medium">{item.subtitle}</p>
      <p className="text-[13px] text-gray-500 leading-relaxed">{item.description}</p>
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
        <BookOpen className="w-3.5 h-3.5 text-accent" />
        <span className="text-[11px] font-semibold text-accent tracking-wide">記事を読む</span>
      </div>
    </Link>
  )

  return (
    <div className={isMobile ? 'overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 -mx-4' : 'overflow-hidden'}>
      <div ref={isMobile ? undefined : trackRef} className={`flex gap-6 ${isMobile ? '' : 'will-change-transform'}`} style={isMobile ? undefined : { width: 'max-content' }}>
        {items.map(renderKnowledgeCard)}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   Pattern Parallax — 2-tier infinite scroll
   ══════════════════════════════════════════════════ */

function PatternParallax({ items }: { items: typeof KNOWLEDGE_ITEMS }) {
  const topRef = useRef<HTMLDivElement>(null)
  const btmRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const animRef = useRef<number>(0)
  const topPos = useRef(0)
  const btmPos = useRef(0)
  const isMobile = useIsMobile()

  // Split items into 2 rows — staggered
  const mid = Math.ceil(items.length / 2)
  const topItems = items.slice(0, mid)
  const btmItems = items.slice(mid)

  useEffect(() => {
    if (isMobile) return // Mobile: no auto-scroll
    const top = topRef.current
    const btm = btmRef.current
    if (!top || !btm) return
    const topSpeed = 0.4
    const btmSpeed = 0.25
    const animate = () => {
      if (!isPaused) {
        const topW = top.scrollWidth / 2
        const btmW = btm.scrollWidth / 2
        topPos.current += topSpeed
        btmPos.current += btmSpeed
        if (topPos.current >= topW) topPos.current = 0
        if (btmPos.current >= btmW) btmPos.current = 0
        top.style.transform = `translateX(-${topPos.current}px)`
        btm.style.transform = `translateX(-${btmPos.current}px)`
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [isPaused, isMobile])

  const topDisplay = isMobile ? topItems : [...topItems, ...topItems, ...topItems]
  const btmDisplay = isMobile ? btmItems : [...btmItems, ...btmItems, ...btmItems]

  const renderCard = (card: (typeof items)[0], i: number) => (
    <Link
      key={`${card.slug}-${i}`}
      to={`/insights/${card.slug}`}
      className={`pattern-card group cursor-pointer flex-shrink-0 !p-7 block ${isMobile ? 'w-[85vw] snap-center' : 'w-[340px]'}`}
      style={{
        opacity: hoveredSlug && hoveredSlug !== card.slug ? 0.5 : 1,
        filter: hoveredSlug && hoveredSlug !== card.slug ? 'blur(4px)' : 'blur(0px)',
        transform: hoveredSlug === card.slug ? 'scale(1.03)' : 'scale(1)',
        transition: 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
        borderColor: hoveredSlug === card.slug ? 'rgba(99,102,241,0.3)' : undefined,
        boxShadow: hoveredSlug === card.slug
          ? '0 20px 50px rgba(99,102,241,0.12), 0 4px 16px rgba(15,23,42,0.06)'
          : '0 1px 3px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.03)',
      }}
      onMouseEnter={() => { setIsPaused(true); setHoveredSlug(card.slug) }}
      onMouseLeave={() => { setIsPaused(false); setHoveredSlug(null) }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-11 h-11 rounded-xl bg-base text-white flex items-center justify-center">
          <card.icon className="w-5 h-5" />
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
      </div>
      <h3 className="text-[16px] font-bold text-base mb-1">{card.title}</h3>
      <p className="text-[12px] text-gray-400 mb-3 font-medium">{card.subtitle}</p>
      <p className="text-[13px] text-gray-500 leading-relaxed mb-5">{card.description}</p>
      {card.metrics && (
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mb-3">
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          <span className="text-[13px] font-bold text-emerald-600">{card.metrics}</span>
        </div>
      )}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <BookOpen className="w-3.5 h-3.5 text-accent" />
        <span className="text-[11px] font-semibold text-accent tracking-wide">解剖レポートを読む</span>
      </div>
    </Link>
  )

  return (
    <div className="space-y-6">
      {/* Top tier — faster */}
      <div className={isMobile ? 'overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 -mx-4' : 'overflow-hidden'}>
        <div ref={isMobile ? undefined : topRef} className={`flex gap-6 ${isMobile ? '' : 'will-change-transform'}`} style={isMobile ? undefined : { width: 'max-content' }}>
          {topDisplay.map(renderCard)}
        </div>
      </div>
      {/* Bottom tier — slower, staggered start */}
      <div className={isMobile ? 'overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 -mx-4' : 'overflow-hidden'}>
        <div ref={isMobile ? undefined : btmRef} className={`flex gap-6 ${isMobile ? '' : 'will-change-transform'}`} style={isMobile ? undefined : { width: 'max-content', transform: 'translateX(-120px)' }}>
          {btmDisplay.map(renderCard)}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   Shared components
   ══════════════════════════════════════════════════ */

function SectionHeader({ badge, title, description }: { badge: string; title: string; description: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-16">
      <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-4">{badge}</span>
      <h2 className="text-[32px] md:text-[40px] font-bold text-base leading-tight mb-5 tracking-tight">{title}</h2>
      <p className="text-gray-500 text-[16px] max-w-2xl mx-auto leading-relaxed">{description}</p>
    </motion.div>
  )
}

type Phase = 'idle' | 'scanning' | 'scoring' | 'result'

type AnalysisResult = {
  score: number
  exposed: {
    title: string
    finding: string
    recommendation: string
    improvedCopy: string
    relatedInsight: string
  }
  locked: { title: string }[]
}

/* ══════════════════════════════════════════════════
   HOME PAGE
   ══════════════════════════════════════════════════ */

function HomePage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('idle')
  const [targetDemo, setTargetDemo] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [lpCopy, setLpCopy] = useState('')
  const [scanIndex, setScanIndex] = useState(0)
  const [displayScore, setDisplayScore] = useState(0)
  const [activeNav, setActiveNav] = useState('insights')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const apiPromiseRef = useRef<Promise<AnalysisResult | null> | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveNav(e.target.id) }) },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0.1 }
    )
    Object.values(sectionRefs.current).forEach((ref) => { if (ref) observer.observe(ref) })
    return () => observer.disconnect()
  }, [])

  // When scanning completes, wait for API then move to scoring
  useEffect(() => {
    if (phase !== 'scanning') return
    if (scanIndex >= SCAN_MESSAGES.length) {
      // Scanning animation done — wait for API response
      const waitForApi = async () => {
        if (apiPromiseRef.current) {
          const result = await apiPromiseRef.current
          if (result) {
            setAnalysisResult(result)
          }
        }
        setPhase('scoring')
      }
      waitForApi()
      return
    }
    const t = setTimeout(() => setScanIndex((i) => i + 1), 700)
    return () => clearTimeout(t)
  }, [phase, scanIndex])

  useEffect(() => {
    if (phase !== 'scoring') return
    const targetScore = analysisResult?.score ?? MOCK_SCORE
    if (displayScore >= targetScore) { const t = setTimeout(() => setPhase('result'), 1600); return () => clearTimeout(t) }
    const step = displayScore < 10 ? 70 : displayScore < 20 ? 50 : 35
    const t = setTimeout(() => setDisplayScore((s) => s + 1), step)
    return () => clearTimeout(t)
  }, [phase, displayScore, analysisResult])

  const handleScan = useCallback(() => {
    if (!lpCopy.trim()) return
    setScanIndex(0); setDisplayScore(0); setAnalysisResult(null); setApiError(null)
    setPhase('scanning')

    // Fire API call in parallel with scanning animation
    apiPromiseRef.current = fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: targetDemo, price: priceRange, copy: lpCopy }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Unknown error' }))
          setApiError(err.error || 'サーバーエラーが発生しました')
          return null
        }
        return res.json()
      })
      .catch(() => {
        setApiError(null) // Silently fall back to mock
        return null
      })
  }, [lpCopy, targetDemo, priceRange])

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
  const patternItems = KNOWLEDGE_ITEMS.filter(k => k.metrics)

  // Use API result, or fall back to mock
  const result = analysisResult || MOCK_RESULT
  const finalScore = analysisResult?.score ?? MOCK_SCORE
  const targetLabel = targetDemo || 'パーソナルジム市場における30代女性層'

  return (
    <div className="min-h-screen bg-bg text-gray-700">
      {/* NAV */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-200/60">
        <div className="max-w-[1120px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-[15px] font-bold text-base tracking-[-0.01em]">Satori Laboratory</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-accent/10 text-[10px] uppercase tracking-[0.15em] font-bold text-accent">v2.2</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-300 ${activeNav === item.id ? 'bg-base text-white shadow-sm' : 'text-gray-400 hover:text-base hover:bg-gray-100'}`}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-36 pb-[100px] px-8 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-bg to-bg pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 shadow-sm mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">Insight Analysis Available</span>
            </div>
            <h1 className="text-[32px] sm:text-[40px] md:text-[52px] lg:text-[60px] font-extrabold text-base leading-[1.15] tracking-[-0.03em] mb-6" style={{ overflowWrap: 'break-word', wordBreak: 'keep-all' }}>
              データは沈黙し、<br />
              <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">現場が叫ぶ。</span>
            </h1>
            <p className="text-[15px] md:text-[17px] text-gray-500 leading-[1.8] mb-10 max-w-lg">
              10,000時間の現場観察から抽出した購買心理モデルを、AIに統合。あなたのLPが0.3秒で見逃されている理由を、客観的なデータで特定します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => scrollTo('diagnosis')} className="px-8 py-3.5 bg-accent text-white rounded-xl text-[14px] font-semibold hover:bg-accent-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5">
                無料で診断する <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => scrollTo('insights')} className="px-8 py-3.5 bg-white text-gray-600 rounded-xl text-[14px] font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm text-center">
                ナレッジを探索する
              </button>
            </div>
          </motion.div>
          {/* Product UI */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="hidden lg:block">
            <div className="relative">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/60 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                  <div className="w-3 h-3 rounded-full bg-gray-200" /><div className="w-3 h-3 rounded-full bg-gray-200" /><div className="w-3 h-3 rounded-full bg-gray-200" />
                  <div className="flex-1 mx-4"><div className="w-48 h-5 rounded-md bg-gray-100 mx-auto" /></div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100">
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Performance Score</p><p className="text-3xl font-extrabold text-base tracking-tight">32<span className="text-gray-300 text-lg font-normal">/100</span></p></div>
                    <div className="w-16 h-16"><svg viewBox="0 0 36 36" className="w-full h-full"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" /><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="32, 100" strokeLinecap="round" /></svg></div>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200"><div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-rose-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Finding #1</span></div><div className="w-full h-2 rounded-full bg-gray-100 mb-2" /><div className="w-4/5 h-2 rounded-full bg-gray-100 mb-2" /><div className="w-3/5 h-2 rounded-full bg-gray-100" /></div>
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50"><div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Recommendation</span></div><div className="w-full h-2 rounded-full bg-emerald-100 mb-2" /><div className="w-3/4 h-2 rounded-full bg-emerald-100" /></div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl border border-gray-200 shadow-lg px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-accent" /></div>
                <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">改善余地</p><p className="text-sm font-bold text-accent">+68% 成長可能</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INSIGHTS CAROUSEL */}
      <section id="insights" ref={(el) => { sectionRefs.current['insights'] = el }} className="py-[100px] bg-white border-y border-gray-200/60">
        <div className="max-w-[1120px] mx-auto px-6 mb-16">
          <SectionHeader badge="Knowledge Library" title="LP設計の知識体系" description="行動経済学・認知心理学・実店舗データに基づく、LP改善のためのナレッジベース。各カードをクリックすると解剖レポートを読むことができます。" />
        </div>
        <KnowledgeCarousel />
      </section>

      {/* PATTERNS — 2-tier parallax infinite scroll */}
      <section id="patterns" ref={(el) => { sectionRefs.current['patterns'] = el }} className="py-[100px] overflow-hidden">
        <div className="max-w-[1120px] mx-auto px-6 mb-16">
          <SectionHeader badge="Best Practices" title={`成約率を高める、${patternItems.length}つの設計パターン`} description="現場の観察データとA/Bテストから導出した、実証済みのLP設計フレームワーク。行動経済学と認知心理学のエビデンスに裏付けられた黄金律。" />
        </div>
        <PatternParallax items={patternItems} />
      </section>

      {/* SCANNER */}
      <section id="diagnosis" ref={(el) => { sectionRefs.current['diagnosis'] = el }} className="py-[100px] px-6 bg-white border-y border-gray-200/60">
        <div className="max-w-[1120px] mx-auto"><SectionHeader badge="Insight Scanner" title="あなたのLPを、客観的に評価します" description="LPの情報を入力してください。現場の購買心理モデルに基づいた改善レポートを生成します。" /></div>
        <div className="max-w-[680px] mx-auto">
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="card !p-8 md:!p-10 !shadow-xl !shadow-gray-200/40">
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-2">ターゲットの年齢・性別</label><input type="text" value={targetDemo} onChange={(e) => setTargetDemo(e.target.value)} placeholder="例: 30代女性" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-[14px]" /></div>
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-2">想定単価</label><input type="text" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="例: ¥15,000/月" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-[14px]" /></div>
                </div>
                <div className="mb-8"><label className="block text-[13px] font-semibold text-gray-700 mb-2">LPのコピー / URL</label><textarea value={lpCopy} onChange={(e) => setLpCopy(e.target.value)} placeholder="LPのヘッドラインや主要なコピーを貼り付けてください..." className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all min-h-[140px] text-[14px] leading-relaxed resize-none" /></div>
                <button onClick={handleScan} disabled={!lpCopy.trim()} className="w-full py-4 bg-accent text-white rounded-xl text-[14px] font-bold tracking-wide hover:bg-accent-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"><Search className="w-4 h-4" />解析プロトコル：SATORI を実行</button>
              </motion.div>
            )}
            {phase === 'scanning' && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card !p-10 md:!p-14 !shadow-xl !shadow-gray-200/40">
                {/* SVG Scanner — precision instrument */}
                <div className="w-28 h-28 mx-auto mb-10 relative">
                  <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
                    {/* Outer ring — slow pulse */}
                    <circle cx="60" cy="60" r="56" stroke="#e2e8f0" strokeWidth="1.5" />
                    <circle cx="60" cy="60" r="56" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="88 264" strokeLinecap="round" className="origin-center" style={{ animation: 'spin 3s linear infinite' }} />
                    {/* Inner ring — fast reverse */}
                    <circle cx="60" cy="60" r="42" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="60" cy="60" r="42" stroke="#818cf8" strokeWidth="1" strokeDasharray="44 220" strokeLinecap="round" className="origin-center" style={{ animation: 'spin 2s linear infinite reverse' }} />
                    {/* Cross-hairs */}
                    <line x1="60" y1="28" x2="60" y2="38" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="60" y1="82" x2="60" y2="92" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="28" y1="60" x2="38" y2="60" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="82" y1="60" x2="92" y2="60" stroke="#94a3b8" strokeWidth="1" />
                    {/* Center dot — pulse */}
                    <circle cx="60" cy="60" r="4" fill="#6366f1" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                    <circle cx="60" cy="60" r="8" stroke="#6366f1" strokeWidth="0.5" opacity="0.3" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                    {/* Scan line sweep */}
                    <line x1="60" y1="60" x2="60" y2="20" stroke="#6366f1" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" className="origin-center" style={{ animation: 'spin 1.2s linear infinite', transformOrigin: '60px 60px' }} />
                  </svg>
                </div>
                {/* Terminal-like log output */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 min-h-[120px] font-mono">
                  {SCAN_MESSAGES.slice(0, scanIndex + 1).map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                      className={`flex items-start gap-2 py-1 ${i === scanIndex ? 'text-accent font-medium' : 'text-gray-400'}`}>
                      <span className="text-[10px] mt-0.5 flex-shrink-0">{i < scanIndex ? '✓' : '▸'}</span>
                      <span className="text-[11px] leading-relaxed">{msg}</span>
                    </motion.div>
                  ))}
                </div>
                {/* Progress bar with glow */}
                <div className="relative w-full max-w-sm mx-auto">
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((scanIndex + 1) / SCAN_MESSAGES.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-center text-[10px] text-gray-400 mt-3 tracking-wider uppercase font-bold">
                    解析エンジン稼働中 — {Math.round(((scanIndex + 1) / SCAN_MESSAGES.length) * 100)}%
                  </p>
                </div>
              </motion.div>
            )}
            {phase === 'scoring' && (
              <motion.div key="scoring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card !p-12 md:!p-16 text-center !shadow-xl !shadow-gray-200/40">
                <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-8">Performance Score</p>
                <div className="flex items-baseline justify-center gap-2"><span className="text-[80px] sm:text-[96px] md:text-[120px] font-extrabold text-base tracking-[-0.04em] leading-none">{displayScore}</span><span className="text-[24px] sm:text-[28px] text-gray-300 font-light">/100</span></div>
                <p className="text-gray-400 text-[13px] mt-6">解析結果を統合しています...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" ref={(el) => { sectionRefs.current['results'] = el }} className="py-[100px] px-6">
        <div className="max-w-[680px] mx-auto">
          {phase === 'result' ? (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 pb-12 border-b border-gray-200">
                <div><h2 className="text-[24px] sm:text-[28px] font-bold text-base mb-2 tracking-tight">市場適応性レポート</h2><p className="text-[13px] text-gray-400 font-medium">対象：{targetLabel}</p></div>
                <div className="flex items-center gap-4 bg-rose-50 border border-rose-200 rounded-2xl py-3 px-6 flex-shrink-0"><div className="flex items-baseline gap-1"><span className="text-[36px] font-extrabold text-rose-500 tracking-tight">{finalScore}</span><span className="text-[13px] text-rose-300">/100</span></div><div className="w-px h-10 bg-rose-200" /><span className="text-[10px] uppercase tracking-[0.15em] font-bold text-rose-500 leading-tight">改善余地<br />あり</span></div>
              </motion.div>
              {apiError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-[13px] text-amber-700">
                  <p className="font-medium">⚠ デモモードで表示しています</p>
                  <p className="text-amber-500 mt-1">{apiError}</p>
                </motion.div>
              )}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card !p-0 !shadow-xl !shadow-gray-200/40 overflow-hidden mb-8">
                <div className="bg-gray-50 px-6 sm:px-7 py-4 border-b border-gray-200 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-rose-400" /><span className="text-[11px] uppercase tracking-[0.15em] font-bold text-gray-500">Finding #1 — 公開レポート</span></div>
                <div className="p-6 sm:p-7 md:p-8">
                  <h3 className="text-[18px] sm:text-[20px] font-bold text-base mb-5 leading-snug tracking-tight">{result.exposed.title}</h3>
                  <p className="text-[14px] text-gray-500 leading-[1.8] mb-7">{result.exposed.finding}</p>
                  <div className="h-px bg-gray-100 mb-7" />
                  <div className="flex items-center gap-2 mb-4"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[11px] uppercase tracking-[0.15em] font-bold text-emerald-600">Recommendation</span></div>
                  <p className="text-[14px] text-gray-500 leading-[1.8] mb-7">{result.exposed.recommendation}</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6 mb-6"><span className="text-[11px] uppercase tracking-[0.15em] font-bold text-gray-400 block mb-3">改善後のコピー案</span><p className="text-[16px] sm:text-[18px] font-bold text-base leading-snug">{result.exposed.improvedCopy}</p></div>
                  <Link to={`/insights/${result.exposed.relatedInsight}`} className="inline-flex items-center gap-2 text-[13px] font-semibold text-accent hover:text-accent-dark transition-colors">
                    <BookOpen className="w-4 h-4" />関連するナレッジを読む<ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>

              {/* ═══ Unlock CTA — directly after Finding #1 ═══ */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="card !p-8 sm:!p-10 !shadow-xl !shadow-gray-200/40 text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5 border border-gray-200"><Lock className="w-5 h-5 text-gray-400" /></div>
                <h3 className="text-[20px] sm:text-[24px] font-bold text-base mb-3 tracking-tight">残り{result.locked.length}件の改善ポイントが見つかりました</h3>
                <p className="text-[14px] text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">すべての分析結果と最適化コピー案を含む、フルレポートのロックを解除します。</p>
                <button onClick={() => navigate('/report', { state: { target: targetDemo, price: priceRange, copy: lpCopy } })} className="group px-8 sm:px-10 py-4 bg-accent text-white rounded-xl text-[14px] font-bold tracking-wide hover:bg-accent-dark transition-all inline-flex items-center gap-3 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5">
                  フルレポートをアンロック — ¥4,980<ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <br />
                <button onClick={() => setPhase('idle')} className="mt-5 text-[13px] text-gray-400 hover:text-gray-600 transition-colors font-medium">別のコピーで再診断する</button>
              </motion.div>

              {/* ═══ Locked Findings Teaser (3 items only) ═══ */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="relative">
                <div className="mosaic-lock space-y-4">
                  {result.locked.slice(0, 3).map((item, i) => (
                    <div key={i} className="card"><div className="flex items-center gap-3 mb-4"><div className="w-2 h-2 rounded-full bg-gray-300" /><span className="text-[11px] uppercase tracking-[0.15em] font-bold text-gray-400">Finding #{i + 2}</span></div><h4 className="text-[16px] font-bold text-gray-700 mb-4">{item.title}</h4><div className="space-y-2"><div className="w-full h-2 rounded-full bg-gray-100" /><div className="w-4/5 h-2 rounded-full bg-gray-100" /><div className="w-3/5 h-2 rounded-full bg-gray-100" /></div></div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/95 to-bg/60 flex items-end justify-center pb-6">
                  <span className="text-[13px] text-gray-400 font-medium">...他 {result.locked.length - 3}件の改善ポイント</span>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6 border border-gray-200"><BarChart3 className="w-5 h-5 text-gray-400" /></div>
              <h3 className="text-[20px] sm:text-[22px] font-bold text-base mb-3 tracking-tight">レポートが表示される場所です</h3>
              <p className="text-[14px] text-gray-400 max-w-md mx-auto leading-relaxed">上の「Insight Scanner」でLPの情報を入力し、解析を実行すると、ここに詳細なレポートが生成されます。</p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-gray-200/60">
        <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[14px] font-bold text-gray-400">Satori Laboratory</span>
          <p className="text-[11px] text-gray-300 tracking-[0.2em] uppercase font-medium">Tokyo — 2026</p>
        </div>
      </footer>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   APP ROOT
   ══════════════════════════════════════════════════ */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/insights/:slug" element={<InsightPage />} />
      <Route path="/report" element={<FullReportPage />} />
    </Routes>
  )
}
