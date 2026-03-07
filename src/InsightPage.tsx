import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft, ArrowRight, BookOpen, Brain, AlertTriangle,
    Wrench, ChevronRight, FileText, ExternalLink, GraduationCap,
} from 'lucide-react'
import { KNOWLEDGE_ITEMS, type Reference } from './data'

/* ═══════════════════════════════════════════════
   SVG Diagrams — visual "evidence"
   ═══════════════════════════════════════════════ */

function HeatmapDiagram() {
    return (
        <svg viewBox="0 0 400 260" className="w-full h-auto" fill="none" role="img" aria-label="ヒートマップシミュレーション">
            <rect width="400" height="260" rx="12" fill="#f8fafc" stroke="#e2e8f0" />
            <text x="200" y="20" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">HEATMAP SIMULATION — ユーザー視線密度</text>
            <rect x="20" y="32" width="360" height="50" rx="8" fill="#fee2e2" opacity="0.8" />
            <rect x="30" y="42" width="180" height="10" rx="4" fill="#ef4444" opacity="0.6" />
            <rect x="30" y="58" width="120" height="6" rx="3" fill="#f87171" opacity="0.4" />
            <circle cx="350" cy="57" r="16" fill="#fca5a5" opacity="0.5" />
            <text x="350" y="61" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="700">CTA</text>
            <rect x="20" y="90" width="170" height="70" rx="8" fill="#fef3c7" opacity="0.5" />
            <rect x="200" y="90" width="180" height="70" rx="8" fill="#fef9c3" opacity="0.3" />
            <rect x="30" y="100" width="140" height="6" rx="3" fill="#f59e0b" opacity="0.4" />
            <rect x="30" y="112" width="100" height="6" rx="3" fill="#fbbf24" opacity="0.3" />
            <rect x="210" y="100" width="160" height="50" rx="6" fill="#fde68a" opacity="0.2" />
            <rect x="20" y="170" width="360" height="70" rx="8" fill="#dbeafe" opacity="0.2" />
            <rect x="30" y="180" width="200" height="6" rx="3" fill="#93c5fd" opacity="0.2" />
            <rect x="30" y="192" width="160" height="6" rx="3" fill="#bfdbfe" opacity="0.15" />
            <rect x="30" y="204" width="180" height="6" rx="3" fill="#bfdbfe" opacity="0.1" />
            <circle cx="40" cy="250" r="5" fill="#ef4444" opacity="0.6" /><text x="50" y="253" fill="#64748b" fontSize="8">高密度</text>
            <circle cx="100" cy="250" r="5" fill="#f59e0b" opacity="0.5" /><text x="110" y="253" fill="#64748b" fontSize="8">中密度</text>
            <circle cx="160" cy="250" r="5" fill="#93c5fd" opacity="0.3" /><text x="170" y="253" fill="#64748b" fontSize="8">低密度</text>
            <text x="280" y="253" fill="#94a3b8" fontSize="7">※ F字型パターンに基づく推定モデル</text>
        </svg>
    )
}

function GazeFlowDiagram() {
    return (
        <svg viewBox="0 0 400 260" className="w-full h-auto" fill="none" role="img" aria-label="視線誘導パス">
            <rect width="400" height="260" rx="12" fill="#f8fafc" stroke="#e2e8f0" />
            <text x="200" y="20" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">GAZE FLOW — 理想的な視線誘導パス</text>
            <rect x="40" y="35" width="320" height="200" rx="8" fill="white" stroke="#e2e8f0" />
            <rect x="55" y="48" width="120" height="8" rx="3" fill="#0f172a" />
            <rect x="55" y="62" width="80" height="5" rx="2" fill="#cbd5e1" />
            <rect x="220" y="45" width="120" height="60" rx="6" fill="#f1f5f9" stroke="#e2e8f0" />
            <rect x="55" y="85" width="290" height="4" rx="2" fill="#e2e8f0" />
            <rect x="55" y="95" width="250" height="4" rx="2" fill="#e2e8f0" />
            <rect x="55" y="105" width="270" height="4" rx="2" fill="#e2e8f0" />
            <rect x="55" y="125" width="85" height="30" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
            <rect x="150" y="125" width="85" height="30" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
            <rect x="245" y="125" width="85" height="30" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
            <rect x="130" y="175" width="140" height="36" rx="10" fill="#6366f1" />
            <text x="200" y="197" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">CTA</text>
            <path d="M 65 52 Q 130 50 175 52 Q 220 45 260 70 Q 200 90 65 90 Q 150 110 200 140 Q 200 160 200 180" stroke="#f43f5e" strokeWidth="2" strokeDasharray="6 3" fill="none" markerEnd="url(#ah)" />
            <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0 0 L8 3 L0 6" fill="#f43f5e" /></marker></defs>
            <circle cx="65" cy="52" r="6" fill="#f43f5e" opacity="0.8" /><text x="65" y="55" textAnchor="middle" fill="white" fontSize="6" fontWeight="800">1</text>
            <circle cx="260" cy="70" r="6" fill="#f43f5e" opacity="0.7" /><text x="260" y="73" textAnchor="middle" fill="white" fontSize="6" fontWeight="800">2</text>
            <circle cx="65" cy="90" r="6" fill="#f43f5e" opacity="0.6" /><text x="65" y="93" textAnchor="middle" fill="white" fontSize="6" fontWeight="800">3</text>
            <circle cx="200" cy="140" r="6" fill="#f43f5e" opacity="0.5" /><text x="200" y="143" textAnchor="middle" fill="white" fontSize="6" fontWeight="800">4</text>
            <circle cx="200" cy="193" r="8" fill="#f43f5e" opacity="0.9" /><text x="200" y="196" textAnchor="middle" fill="white" fontSize="7" fontWeight="800">5</text>
            <text x="40" y="250" fill="#f43f5e" fontSize="8" fontWeight="600">● 視線の着地点（時系列順）</text>
            <text x="260" y="250" fill="#94a3b8" fontSize="7">赤線 = 理想的な視線パス</text>
        </svg>
    )
}

function FoggModelDiagram() {
    return (
        <svg viewBox="0 0 400 240" className="w-full h-auto" fill="none" role="img" aria-label="Fogg行動モデル">
            <rect width="400" height="240" rx="12" fill="#f8fafc" stroke="#e2e8f0" />
            <text x="200" y="20" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">FOGG BEHAVIOR MODEL — B = M × A × P</text>
            <line x1="60" y1="200" x2="360" y2="200" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="60" y1="200" x2="60" y2="40" stroke="#cbd5e1" strokeWidth="1" />
            <text x="210" y="220" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="500">Ability（行動の簡便さ）→ 高い</text>
            <text x="25" y="120" fill="#64748b" fontSize="9" fontWeight="500" transform="rotate(-90 25 120)">Motivation →</text>
            <path d="M 80 50 Q 120 55 160 80 Q 200 110 240 160 Q 280 185 340 195" stroke="#6366f1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <text x="170" y="70" fill="#6366f1" fontSize="8" fontWeight="700">行動の閾値ライン</text>
            <text x="120" y="100" fill="#10b981" fontSize="10" fontWeight="700">行動が発生 ✓</text>
            <text x="250" y="175" fill="#f43f5e" fontSize="10" fontWeight="700">行動しない ✗</text>
            <circle cx="100" cy="70" r="6" fill="#10b981" opacity="0.7" />
            <text x="100" y="60" textAnchor="middle" fill="#10b981" fontSize="7">「無料で試す」</text>
            <circle cx="300" cy="185" r="6" fill="#f43f5e" opacity="0.7" />
            <text x="300" y="195" textAnchor="middle" fill="#f43f5e" fontSize="7">「11項目入力」</text>
            <circle cx="200" cy="130" r="6" fill="#f59e0b" opacity="0.7" />
            <text x="200" y="120" textAnchor="middle" fill="#f59e0b" fontSize="7">「メールだけ入力」</text>
        </svg>
    )
}

function AnchoringDiagram() {
    return (
        <svg viewBox="0 0 400 200" className="w-full h-auto" fill="none" role="img" aria-label="アンカリング効果">
            <rect width="400" height="200" rx="12" fill="#f8fafc" stroke="#e2e8f0" />
            <text x="200" y="20" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">ANCHORING EFFECT — 価格知覚の変化</text>
            {/* Without anchor */}
            <rect x="30" y="40" width="160" height="130" rx="8" fill="white" stroke="#e2e8f0" />
            <text x="110" y="58" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="600">アンカーなし</text>
            <text x="110" y="100" textAnchor="middle" fill="#0f172a" fontSize="22" fontWeight="800">¥2,980</text>
            <text x="110" y="120" textAnchor="middle" fill="#f43f5e" fontSize="9" fontWeight="600">「高い…？安い…？」</text>
            <text x="110" y="140" textAnchor="middle" fill="#94a3b8" fontSize="8">判断基準なし → 離脱</text>
            <circle cx="110" cy="158" r="4" fill="#f43f5e" opacity="0.6" />
            {/* With anchor */}
            <rect x="210" y="40" width="160" height="130" rx="8" fill="white" stroke="#e2e8f0" />
            <text x="290" y="58" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="600">アンカーあり</text>
            <text x="290" y="82" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="500" textDecoration="line-through">¥9,800</text>
            <text x="290" y="108" textAnchor="middle" fill="#10b981" fontSize="22" fontWeight="800">¥2,980</text>
            <text x="290" y="128" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="600">「70%OFFはお得！」</text>
            <text x="290" y="148" textAnchor="middle" fill="#94a3b8" fontSize="8">比較基準あり → 行動</text>
            <circle cx="290" cy="158" r="4" fill="#10b981" opacity="0.6" />
            {/* Arrow */}
            <text x="200" y="190" textAnchor="middle" fill="#64748b" fontSize="8">※ 同一価格でも「最初に見る数字」で知覚が変わる</text>
        </svg>
    )
}

const DIAGRAM_MAP: Record<string, () => React.ReactElement> = {
    'attention-drift': HeatmapDiagram,
    'physical-fit': GazeFlowDiagram,
    'trust-logic': GazeFlowDiagram,
    'frictionless-action': FoggModelDiagram,
    'anchoring-effect': AnchoringDiagram,
}

/* ═══════════════════════════════════════════════
   Reference card component
   ═══════════════════════════════════════════════ */

function ReferenceCard({ reference, index }: { reference: Reference; index: number }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
            <span className="flex-shrink-0 w-5 h-5 rounded bg-gray-100 text-gray-400 text-[9px] font-bold flex items-center justify-center mt-0.5">
                {index + 1}
            </span>
            <div className="min-w-0">
                <p className="text-[13px] text-gray-700 leading-snug font-medium">
                    {reference.authors} ({reference.year}). <em>{reference.title}</em>.
                </p>
                <p className="text-[12px] text-gray-400 mt-0.5">{reference.source}</p>
                {reference.url && (
                    <a
                        href={reference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-accent-dark transition-colors mt-1 font-semibold"
                    >
                        <ExternalLink className="w-3 h-3" />
                        論文を読む
                    </a>
                )}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════
   Detail page nav
   ═══════════════════════════════════════════════ */

function DetailNav() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-200/60">
            <div className="max-w-[1120px] mx-auto px-8 md:px-12 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <span className="text-[15px] font-bold text-base tracking-[-0.01em]">Satori Laboratory</span>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-accent/10 text-[10px] uppercase tracking-[0.15em] font-bold text-accent">v2.2</span>
                </Link>
            </div>
        </header>
    )
}

/* ═══════════════════════════════════════════════
   CX Flow Progress Indicator
   ═══════════════════════════════════════════════ */

const CX_STEPS = [
    { icon: Brain, label: '驚き', desc: '概念を理解する' },
    { icon: AlertTriangle, label: '納得', desc: '失敗例で気づく' },
    { icon: Wrench, label: '実践', desc: '処方箋を得る' },
    { icon: GraduationCap, label: '確信', desc: 'エビデンスで裏付け' },
]

function CxFlowIndicator({ activeStep }: { activeStep: number }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-12">
            {CX_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${i <= activeStep
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'bg-gray-50 text-gray-300 border border-gray-100'
                        }`}>
                        <step.icon className="w-3 h-3" />
                        {step.label}
                    </div>
                    {i < CX_STEPS.length - 1 && (
                        <ChevronRight className={`w-3 h-3 ${i < activeStep ? 'text-accent' : 'text-gray-200'}`} />
                    )}
                </div>
            ))}
        </div>
    )
}

/* ═══════════════════════════════════════════════
   INSIGHT PAGE — main component
   ═══════════════════════════════════════════════ */

export default function InsightPage() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const item = KNOWLEDGE_ITEMS.find((k) => k.slug === slug)

    useEffect(() => { window.scrollTo(0, 0) }, [slug])

    if (!item) return (
        <div className="min-h-screen bg-bg flex items-center justify-center">
            <p className="text-gray-400">記事が見つかりませんでした。</p>
        </div>
    )

    const related = KNOWLEDGE_ITEMS.filter((k) => k.slug !== slug).slice(0, 3)
    const DiagramComponent = DIAGRAM_MAP[item.slug]

    return (
        <div className="min-h-screen bg-bg text-gray-700">
            <DetailNav />

            <article className="pt-32 pb-[100px] px-8 md:px-12">
                <div className="max-w-[680px] mx-auto">

                    {/* Breadcrumb */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[13px] text-gray-400 hover:text-accent transition-colors font-medium">
                            <ArrowLeft className="w-4 h-4" /> ホームに戻る
                        </button>
                    </motion.div>

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className={`w-14 h-14 rounded-2xl ${item.color} border flex items-center justify-center mb-6`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h1 className="text-[36px] md:text-[44px] font-extrabold text-base leading-tight tracking-[-0.02em] mb-3">{item.title}</h1>
                        <p className="text-[17px] text-gray-400 font-medium mb-8">{item.subtitle}</p>
                        <div className="h-px bg-gray-200 mb-10" />
                    </motion.div>

                    {/* CX Flow indicator */}
                    <CxFlowIndicator activeStep={0} />

                    {/* ═══ Section 1: 脳の仕組み (驚き) ═══ */}
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                <Brain className="w-4 h-4 text-indigo-600" />
                            </div>
                            <h2 className="text-[20px] font-bold text-base">{item.article.brain.heading}</h2>
                        </div>
                        <div className="article-body">
                            {item.article.brain.paragraphs.map((p, i) => (
                                <p key={i} className="text-[15px] text-gray-600 leading-[1.95]">{p}</p>
                            ))}
                        </div>
                    </motion.section>

                    {/* ═══ Diagram ═══ */}
                    {DiagramComponent && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="mb-16 card-static !p-4">
                            <DiagramComponent />
                        </motion.div>
                    )}

                    {/* CX Flow step 2 */}
                    <CxFlowIndicator activeStep={1} />

                    {/* ═══ Section 2: よくある失敗 (納得) ═══ */}
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-rose-500" />
                            </div>
                            <h2 className="text-[20px] font-bold text-base">{item.article.failures.heading}</h2>
                        </div>
                        <div className="space-y-4">
                            {item.article.failures.items.map((f, i) => (
                                <div key={i} className="card-static !p-6 border-l-[3px] border-l-rose-300">
                                    <h4 className="text-[15px] font-bold text-base mb-2 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded bg-rose-50 text-rose-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                                        {f.label}
                                    </h4>
                                    <p className="text-[14px] text-gray-500 leading-[1.9]">{f.detail}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* CX Flow step 3 */}
                    <CxFlowIndicator activeStep={2} />

                    {/* ═══ Section 3: 現場の処方箋 (実践) ═══ */}
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <Wrench className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h2 className="text-[20px] font-bold text-base">{item.article.prescription.heading}</h2>
                        </div>
                        <div className="space-y-3">
                            {item.article.prescription.items.map((rx, i) => (
                                <div key={i} className="flex items-start gap-4 card-static !p-5 border-l-[3px] border-l-emerald-300">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 text-[12px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                                    <p className="text-[14px] text-gray-600 leading-[1.9]">{rx}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* CX Flow step 4 */}
                    <CxFlowIndicator activeStep={3} />

                    {/* ═══ Section 4: エビデンス (確信) ═══ */}
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-amber-600" />
                            </div>
                            <h2 className="text-[20px] font-bold text-base">エビデンス：裏付け文献</h2>
                        </div>
                        <p className="text-[14px] text-gray-400 mb-6 leading-relaxed">
                            この記事の内容は、以下の査読付き論文・学術書に基づいています。詳細な研究結果を確認することで、実践への確信をさらに深めてください。
                        </p>
                        <div className="card-static !p-6">
                            {item.article.references.map((r, i) => (
                                <ReferenceCard key={i} reference={r} index={i} />
                            ))}
                        </div>
                    </motion.section>

                    {/* ═══ Further Reading (外部リンク→行動) ═══ */}
                    {item.article.furtherReading && item.article.furtherReading.length > 0 && (
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-16">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-gray-500" />
                                </div>
                                <h2 className="text-[20px] font-bold text-base">さらに深く学ぶ</h2>
                            </div>
                            <div className="space-y-3">
                                {item.article.furtherReading.map((fr, i) => (
                                    <a
                                        key={i}
                                        href={fr.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="card group !p-5 flex items-center gap-4 hover:!border-accent/30"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
                                            <ExternalLink className="w-4 h-4 text-accent" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[14px] font-bold text-base group-hover:text-accent transition-colors">{fr.label}</p>
                                            <p className="text-[12px] text-gray-400 mt-0.5">{fr.description}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-accent flex-shrink-0 ml-auto transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* ═══ CTA ═══ */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
                        className="p-8 md:p-10 bg-white border border-gray-200 rounded-2xl text-center shadow-sm mb-16">
                        <h3 className="text-[20px] font-bold text-base mb-3">この知識を、あなたのLPで検証しませんか？</h3>
                        <p className="text-[14px] text-gray-500 mb-6 leading-relaxed max-w-md mx-auto">
                            Satori Scannerが、あなたのLPの改善ポイントを具体的に特定します。
                        </p>
                        <Link to="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-xl text-[14px] font-semibold hover:bg-accent-dark transition-all shadow-lg shadow-accent/20">
                            無料で診断する <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    {/* ═══ Related ═══ */}
                    <div>
                        <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">関連するナレッジ</h3>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {related.map((r) => (
                                <Link key={r.slug} to={`/insights/${r.slug}`} className="card group !p-5 hover:!border-gray-300">
                                    <div className={`w-8 h-8 rounded-lg ${r.color} border flex items-center justify-center mb-3`}>
                                        <r.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <h4 className="text-[14px] font-bold text-base mb-1">{r.title}</h4>
                                    <p className="text-[12px] text-gray-400">{r.subtitle}</p>
                                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                                        <BookOpen className="w-3 h-3 text-accent" />
                                        <span className="text-[10px] font-semibold text-accent">読む</span>
                                        <ChevronRight className="w-3 h-3 text-accent" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}
