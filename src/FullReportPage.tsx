import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ChevronRight, ChevronDown, ChevronUp, BookOpen, BarChart3,
    AlertTriangle, AlertCircle, Info, ArrowLeft, Download, RefreshCw
} from 'lucide-react'
import { SCAN_MESSAGES } from './data'

/* ══════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════ */

type Finding = {
    title: string
    category: string
    severity: 'high' | 'medium' | 'low'
    finding: string
    recommendation: string
    improvedCopy: string
    relatedInsight: string
}

type FullReport = {
    score: number
    summary: string
    findings: Finding[]
}

/* ══════════════════════════════════════════════════
   Severity Badge
   ══════════════════════════════════════════════════ */

function SeverityBadge({ severity }: { severity: string }) {
    const config = {
        high: { label: '重要度: 高', color: 'bg-rose-50 text-rose-600 border-rose-200', icon: AlertTriangle },
        medium: { label: '重要度: 中', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: AlertCircle },
        low: { label: '重要度: 低', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: Info },
    }
    const c = config[severity as keyof typeof config] || config.medium
    const Icon = c.icon
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-bold tracking-wide ${c.color}`}>
            <Icon className="w-3 h-3" />{c.label}
        </span>
    )
}

/* ══════════════════════════════════════════════════
   Finding Card (Accordion)
   ══════════════════════════════════════════════════ */

function FindingCard({ finding, index, defaultOpen }: { finding: Finding; index: number; defaultOpen: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
            {/* Header — always visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-6 sm:px-7 py-5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
            >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${finding.severity === 'high' ? 'bg-rose-100 text-rose-600' :
                        finding.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                            'bg-blue-100 text-blue-600'
                    }`}>
                    <span className="text-[14px] font-extrabold">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-800 truncate">{finding.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-gray-400 font-medium">{finding.category}</span>
                        <SeverityBadge severity={finding.severity} />
                    </div>
                </div>
                {isOpen
                    ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                }
            </button>

            {/* Body — collapsible */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-6 sm:px-7 pb-6 sm:pb-7 border-t border-gray-100"
                >
                    {/* Finding */}
                    <div className="mt-5 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-rose-400" />
                            <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-gray-500">問題分析</span>
                        </div>
                        <p className="text-[14px] text-gray-600 leading-[1.8]">{finding.finding}</p>
                    </div>

                    {/* Recommendation */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-emerald-600">改善施策</span>
                        </div>
                        <p className="text-[14px] text-gray-600 leading-[1.8]">{finding.recommendation}</p>
                    </div>

                    {/* Improved Copy */}
                    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-5 sm:p-6 mb-5">
                        <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-indigo-400 block mb-3">改善後のコピー案</span>
                        <p className="text-[16px] sm:text-[18px] font-bold text-gray-800 leading-snug">{finding.improvedCopy}</p>
                    </div>

                    {/* Related Insight Link */}
                    <Link
                        to={`/insights/${finding.relatedInsight}`}
                        className="inline-flex items-center gap-2 text-[13px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
                    >
                        <BookOpen className="w-4 h-4" />関連するナレッジを読む<ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </motion.div>
            )}
        </motion.div>
    )
}

/* ══════════════════════════════════════════════════
   Score Ring
   ══════════════════════════════════════════════════ */

function ScoreRing({ score }: { score: number }) {
    const circumference = 2 * Math.PI * 54
    const offset = circumference - (score / 100) * circumference
    const color = score >= 60 ? '#10b981' : score >= 40 ? '#f59e0b' : '#f43f5e'

    return (
        <div className="relative w-32 h-32">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                <motion.circle
                    cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={circumference}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[32px] font-extrabold text-gray-800 tracking-tight">{score}</span>
                <span className="text-[11px] text-gray-400 font-medium">/100</span>
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════════
   FULL REPORT PAGE
   ══════════════════════════════════════════════════ */

export default function FullReportPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [report, setReport] = useState<FullReport | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [scanIndex, setScanIndex] = useState(0)
    const hasFetched = useRef(false)

    // Get the LP data passed from the diagnosis page via location.state
    const lpData = location.state as { target?: string; price?: string; copy?: string } | null

    useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true

        if (!lpData?.copy) {
            setError('診断データが見つかりません。トップページから再度診断を行ってください。')
            setLoading(false)
            return
        }

        // Start scan animation
        const scanTimer = setInterval(() => {
            setScanIndex(prev => {
                if (prev >= SCAN_MESSAGES.length - 1) {
                    clearInterval(scanTimer)
                    return prev
                }
                return prev + 1
            })
        }, 500)

        // Fetch full report
        fetch('/api/full-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lpData),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
                    throw new Error(err.error || 'サーバーエラーが発生しました')
                }
                return res.json()
            })
            .then((data) => {
                clearInterval(scanTimer)
                setScanIndex(SCAN_MESSAGES.length)
                // Small delay for dramatic effect
                setTimeout(() => {
                    setReport(data)
                    setLoading(false)
                }, 800)
            })
            .catch((err) => {
                clearInterval(scanTimer)
                setError(err.message)
                setLoading(false)
            })

        return () => clearInterval(scanTimer)
    }, [lpData])

    const targetLabel = lpData?.target || '未指定'
    const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })

    // Count severities
    const highCount = report?.findings.filter(f => f.severity === 'high').length ?? 0
    const medCount = report?.findings.filter(f => f.severity === 'medium').length ?? 0
    const lowCount = report?.findings.filter(f => f.severity === 'low').length ?? 0

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-200/60">
                <div className="max-w-[900px] mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        <span className="text-[16px] font-bold text-gray-800 tracking-tight">Satori Laboratory</span>
                    </Link>
                    <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-indigo-500">Full Report</span>
                </div>
            </header>

            <main className="max-w-[900px] mx-auto px-6 pt-28 pb-20">
                {/* Loading State */}
                {loading && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-gray-200 p-10 md:p-14 shadow-lg shadow-gray-200/40"
                    >
                        {/* Scanner animation */}
                        <div className="w-24 h-24 mx-auto mb-8 relative">
                            <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
                                <circle cx="60" cy="60" r="56" stroke="#e2e8f0" strokeWidth="1.5" />
                                <circle cx="60" cy="60" r="56" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="88 264" strokeLinecap="round" className="origin-center" style={{ animation: 'spin 3s linear infinite' }} />
                                <circle cx="60" cy="60" r="42" stroke="#e2e8f0" strokeWidth="1" />
                                <circle cx="60" cy="60" r="42" stroke="#818cf8" strokeWidth="1" strokeDasharray="44 220" strokeLinecap="round" className="origin-center" style={{ animation: 'spin 2s linear infinite reverse' }} />
                                <circle cx="60" cy="60" r="4" fill="#6366f1" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                            </svg>
                        </div>

                        {/* Terminal log */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 min-h-[100px] font-mono">
                            {SCAN_MESSAGES.slice(0, scanIndex + 1).map((msg, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                                    className={`flex items-start gap-2 py-1 ${i === scanIndex ? 'text-indigo-500 font-medium' : 'text-gray-400'}`}>
                                    <span className="text-[10px] mt-0.5 flex-shrink-0">{i < scanIndex ? '✓' : '▸'}</span>
                                    <span className="text-[11px] leading-relaxed">{msg}</span>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-center text-[13px] text-gray-400 font-medium">
                            フルレポートを生成中...（約10〜15秒）
                        </p>
                    </motion.div>
                )}

                {/* Error State */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-gray-200 p-10 md:p-14 shadow-lg text-center"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-6 h-6 text-rose-500" />
                        </div>
                        <h2 className="text-[20px] font-bold text-gray-800 mb-3">エラーが発生しました</h2>
                        <p className="text-[14px] text-gray-500 mb-8 max-w-md mx-auto">{error}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-indigo-500 text-white rounded-xl text-[14px] font-bold hover:bg-indigo-600 transition-colors"
                        >
                            トップページに戻る
                        </button>
                    </motion.div>
                )}

                {/* Report Content */}
                {report && (
                    <>
                        {/* Report Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 shadow-lg shadow-gray-200/40 mb-6"
                        >
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                                <ScoreRing score={report.score} />
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                                        <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-indigo-500">Satori Laboratory</span>
                                        <span className="text-[11px] text-gray-300">|</span>
                                        <span className="text-[11px] text-gray-400 font-medium">{today}</span>
                                    </div>
                                    <h1 className="text-[22px] sm:text-[26px] font-bold text-gray-800 tracking-tight mb-3">市場適応性フルレポート</h1>
                                    <p className="text-[13px] text-gray-400 font-medium mb-4">対象：{targetLabel}</p>

                                    {/* Severity summary */}
                                    <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
                                        {highCount > 0 && <span className="text-[12px] font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-lg">重要度 高: {highCount}件</span>}
                                        {medCount > 0 && <span className="text-[12px] font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-lg">重要度 中: {medCount}件</span>}
                                        {lowCount > 0 && <span className="text-[12px] font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-lg">重要度 低: {lowCount}件</span>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-7 sm:p-8 mb-8"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <BarChart3 className="w-4 h-4 text-indigo-500" />
                                <span className="text-[12px] uppercase tracking-[0.15em] font-bold text-indigo-500">総合評価</span>
                            </div>
                            <p className="text-[15px] text-gray-700 leading-[1.9]">{report.summary}</p>
                        </motion.div>

                        {/* Findings */}
                        <div className="space-y-4 mb-12">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[12px] uppercase tracking-[0.15em] font-bold text-gray-500">改善ポイント一覧</span>
                                <span className="text-[11px] text-gray-300 font-medium">— 重要度順</span>
                            </div>
                            {report.findings.map((finding, i) => (
                                <FindingCard key={i} finding={finding} index={i} defaultOpen={i === 0} />
                            ))}
                        </div>

                        {/* Footer Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm"
                        >
                            <h3 className="text-[18px] font-bold text-gray-800 mb-3">レポートの活用について</h3>
                            <p className="text-[14px] text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed">
                                各改善ポイントの「改善後のコピー案」をそのままあなたのLPに適用することで、
                                コンバージョン率の改善が期待できます。
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="group px-8 py-3.5 bg-indigo-500 text-white rounded-xl text-[14px] font-bold hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                                >
                                    <RefreshCw className="w-4 h-4" />別のLPを診断する
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="px-8 py-3.5 bg-gray-100 text-gray-600 rounded-xl text-[14px] font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />レポートを保存
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </main>
        </div>
    )
}
