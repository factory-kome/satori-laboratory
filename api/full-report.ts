import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

/* ═══════════════════════════════════════════════
   Satori Laboratory — Full Report API
   Vercel Serverless Function (POST /api/full-report)
   Returns ALL 9 findings with full details
   ═══════════════════════════════════════════════ */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

// Rate limiter (shared concept with analyze.ts)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5 // stricter — full reports are expensive
const RATE_WINDOW_MS = 60 * 60 * 1000

function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const entry = rateLimitMap.get(ip)
    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS })
        return false
    }
    entry.count++
    return entry.count > RATE_LIMIT
}

function sanitize(input: string): string {
    return input.replace(/[<>]/g, '').trim().slice(0, 5000)
}

const SYSTEM_PROMPT = `あなたは「Satori Laboratory」のLP分析AIエンジンです。
10,000時間の現場観察データと行動経済学・認知心理学の知見を持つ、LP改善の最高峰コンサルタントとして振る舞います。

これは有料レポート（¥4,980）です。無料版とは一線を画す、圧倒的な深度と実用性を持つ分析を提供してください。
クライアントが「この金額を払って本当に良かった」と確信するレベルの価値を出すこと。

ユーザーから提供されるLP情報を分析し、以下のJSON形式で必ず回答してください。

回答ルール：
1. scoreは0-100の整数。一般的なLPは25-45程度。素晴らしいLPでも70前後。
2. 分析は行動経済学（カーネマン、チャルディーニ、タレブ、アリエリー等）と認知心理学の術語を的確に使用すること。
3. findingは「何が」「なぜ」「どの程度」問題なのかを5-7文で徹底的に分析すること。該当するコピーの具体的な箇所を引用し、なぜそれがターゲットの心理に刺さらないのかを論理的に解剖すること。
4. whyItMattersは「この問題を放置するとどうなるか」を2-3文で記述。コンバージョンへの具体的なインパクト（離脱率増加、信頼性低下等）を明示すること。
5. psychologyBasisは、この問題に関連する心理学理論・行動経済学の概念を1-2個挙げ、簡潔に解説すること（例:「プロスペクト理論によれば、人は利得よりも損失に2.25倍敏感に反応する」）。
6. recommendationは実務で即座に適用可能な改善方針を4-5文で書くこと。抽象論ではなく、具体的にコピーのどの部分をどう変えるべきかを明示すること。
7. actionStepsは改善のための具体的な3ステップを配列で記述。各ステップは1文で、実行者がすぐに着手できる粒度にすること。
8. improvedCopyは改善後のコピー案を提示。なぜこの表現が効果的なのかが伝わるよう、ターゲットの深層心理に刺さる表現にすること。
9. expectedImpactは改善実施後に期待される効果を1-2文で具体的に記述すること（例:「ヘッドラインの変更により、直帰率が15-25%改善される可能性がある」）。
10. categoryは以下から最も関連するものを1つ: ヘッドライン, ボディコピー, CTA設計, 信頼性構築, 価格提示, ターゲティング, ビジュアル戦略, コピーの構造, 心理的トリガー
11. relatedInsightは以下のslugから1つ: cognitive-load, attention-drift, dual-process, physical-fit, trust-logic, frictionless-action, anchoring-effect, scarcity-principle, social-proof-design, narrative-transport, micro-copy, color-psychology
12. summaryは以下の4つの観点を含む詳細な総合評価を記述：
    - 現状分析：このLPの現在の立ち位置（市場における競争力）
    - 最大の障壁：コンバージョンを最も阻害している構造的問題
    - 最優先アクション：最小工数で最大効果を得るための第一手
    - 期待されるリフト：全改善を実施した場合の期待効果

JSON形式（これ以外の出力は厳禁）：
{
  "score": 数値,
  "summary": "上記4観点を含む総合評価（8-12文）",
  "findings": [
    {
      "title": "改善ポイントのタイトル（日本語、具体的に）",
      "category": "カテゴリ名",
      "severity": "high | medium | low",
      "finding": "問題の徹底分析（5-7文。該当コピーを引用し、行動経済学の観点から解剖）",
      "whyItMatters": "この問題を放置した場合のビジネスインパクト（2-3文）",
      "psychologyBasis": "関連する心理学理論・行動経済学の概念とその解説（2-3文）",
      "recommendation": "具体的な改善方針（4-5文。どのコピーをどう変えるか明示）",
      "actionSteps": ["ステップ1の具体的アクション", "ステップ2の具体的アクション", "ステップ3の具体的アクション"],
      "improvedCopy": "改善後のコピー案（感情に訴えかけ、ターゲットの深層心理に刺さる表現）",
      "expectedImpact": "改善実施後の期待効果（1-2文、可能なら数値を含む）",
      "toolRecommendation": {
        "id": "canva | adobe | pixta | hotjar | stripe | perayichi | chatgpt",
        "name": "推奨ツール名",
        "reason": "この改善においてなぜこのツールが推奨されるかの簡潔な理由（1文）"
      },
      "relatedInsight": "関連するナレッジのslug"
    }
  ]
}

推奨ツールの選択基準：
- デザイン/構成の改善：canva (Canva), adobe (Adobe Express)
- 素材/ビジュアルの質：pixta (PIXTA)
- ユーザー行動分析/改善ヒートマップ：hotjar (Hotjar)
- 決済/販売機能の導入：stripe (Stripe)
- LP自体の作り直し/検証：perayichi (ペライチ)
- キャッチコピー/文章構築の補助：chatgpt (ChatGPT)

findingsは必ず9個出力してください。重要度の高い順に並べてください。
各findingの分析は深く、具体的で、実務に直結する内容にしてください。
あなたの分析一つ一つが、クライアントのビジネスの命運を左右するという覚悟で書いてください。`

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(clientIp)) {
        return res.status(429).json({ error: 'フルレポートのリクエスト上限に達しました。しばらくしてから再度お試しください。' })
    }

    const { target, price, copy, sessionId } = req.body || {}

    // --- Stripe Validation ---
    if (!sessionId) {
        return res.status(402).json({ error: 'フルレポートを生成するには決済が必要です。' })
    }

    try {
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY
        if (!stripeSecretKey) {
            console.error('Stripe API key not configured')
            return res.status(500).json({ error: 'サーバー設定エラー: 決済環境が構成されていません。' })
        }
        const stripe = new Stripe(stripeSecretKey)
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status !== 'paid') {
            return res.status(402).json({ error: '支払いが完了していません。' })
        }
    } catch (err) {
        console.error('Stripe validation error:', err)
        return res.status(403).json({ error: '決済セッションの検証に失敗しました。不正なアクセスの可能性があります。' })
    }
    // -------------------------

    const sanitizedCopy = sanitize(String(copy || ''))

    if (!sanitizedCopy || sanitizedCopy.length < 10) {
        return res.status(400).json({ error: 'LPのコピーを入力してください（10文字以上）。' })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
        return res.status(500).json({ error: 'サーバー設定エラー: APIキーが構成されていません。' })
    }

    const userMessage = `以下のLPを詳細に分析し、9つの改善ポイントをフルレポートとして出力してください。

【ターゲット層】${sanitize(String(target || '未指定'))}
【想定単価】${sanitize(String(price || '未指定'))}
【LPコピー / 内容】
${sanitizedCopy}`

    try {
        const openaiRes = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userMessage },
                ],
                temperature: 0.7,
                max_tokens: 8000,
                response_format: { type: 'json_object' },
            }),
        })

        if (!openaiRes.ok) {
            const errBody = await openaiRes.text()
            console.error('OpenAI API error:', openaiRes.status, errBody)
            return res.status(502).json({ error: 'AI分析エンジンが一時的に利用できません。' })
        }

        const data = await openaiRes.json()
        const content = data.choices?.[0]?.message?.content

        if (!content) {
            return res.status(502).json({ error: 'AI分析エンジンからの応答が不正です。' })
        }

        const result = JSON.parse(content)

        if (!result.score || !result.findings || !Array.isArray(result.findings)) {
            return res.status(502).json({ error: 'AI分析結果のフォーマットが不正です。再度お試しください。' })
        }

        return res.status(200).json(result)
    } catch (err) {
        console.error('Full report error:', err)
        return res.status(500).json({ error: '分析中にエラーが発生しました。再度お試しください。' })
    }
}
