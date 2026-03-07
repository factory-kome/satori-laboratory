import type { VercelRequest, VercelResponse } from '@vercel/node'

/* ═══════════════════════════════════════════════
   Satori Laboratory — LP Analysis API
   Vercel Serverless Function (POST /api/analyze)
   ═══════════════════════════════════════════════ */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

// Simple in-memory rate limiter (per-invocation instance, Vercel cold starts reset it)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // max requests per window
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

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
    return input
        .replace(/[<>]/g, '') // Strip HTML tags
        .trim()
        .slice(0, 5000) // Max 5000 chars
}

const SYSTEM_PROMPT = `あなたは「Satori Laboratory」のLP分析AIエンジンです。
10,000時間の現場観察データと行動経済学・認知心理学の知見を持つ、LP改善の最高峰コンサルタントとして振る舞います。

ユーザーから提供されるLP情報（ターゲット層、価格帯、コピー/URL）を分析し、以下のJSON形式で必ず回答してください。

回答ルール：
1. scoreは0-100の整数。一般的なLPは25-45程度。素晴らしいLPでも70前後。
2. 分析は行動経済学（カーネマン、チャルディーニ等）と認知心理学の術語を適切に使用すること。
3. findingは具体的で、コピーの何がなぜ問題なのかを明確にすること。
4. recommendationは実務で即座に適用可能な粒度で書くこと。
5. improvedCopyは感情に訴えかけ、ターゲットの深層心理に刺さる表現にすること。
6. relatedInsightは以下のslugから最も関連するものを1つ選ぶこと:
   cognitive-load, attention-drift, dual-process, physical-fit, trust-logic,
   frictionless-action, anchoring-effect, scarcity-principle, social-proof-design,
   narrative-transport, micro-copy, color-psychology

JSON形式（これ以外の出力は厳禁）：
{
  "score": 数値,
  "exposed": {
    "title": "公開する改善ポイントのタイトル（日本語）",
    "finding": "問題の分析（3-4文、行動経済学の術語を含む）",
    "recommendation": "改善の方向性（3-4文、具体的な施策）",
    "improvedCopy": "改善後のヘッドライン案（感情に訴えかける表現）",
    "relatedInsight": "関連するナレッジのslug"
  },
  "locked": [
    { "title": "改善ポイント2のタイトル" },
    { "title": "改善ポイント3のタイトル" },
    { "title": "改善ポイント4のタイトル" },
    { "title": "改善ポイント5のタイトル" }
  ]
}`

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    // Rate limit check
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(clientIp)) {
        return res.status(429).json({ error: '分析リクエストの上限に達しました。しばらくしてから再度お試しください。' })
    }

    // Validate request body
    const { target, price, copy } = req.body || {}
    const sanitizedCopy = sanitize(String(copy || ''))

    if (!sanitizedCopy || sanitizedCopy.length < 10) {
        return res.status(400).json({ error: 'LPのコピーを入力してください（10文字以上）。' })
    }

    // Check API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
        return res.status(500).json({ error: 'サーバー設定エラー: APIキーが構成されていません。' })
    }

    const userMessage = `以下のLPを分析してください。

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
                max_tokens: 1500,
                response_format: { type: 'json_object' },
            }),
        })

        if (!openaiRes.ok) {
            const errBody = await openaiRes.text()
            console.error('OpenAI API error:', openaiRes.status, errBody)
            return res.status(502).json({ error: 'AI分析エンジンが一時的に利用できません。しばらくしてから再度お試しください。' })
        }

        const data = await openaiRes.json()
        const content = data.choices?.[0]?.message?.content

        if (!content) {
            return res.status(502).json({ error: 'AI分析エンジンからの応答が不正です。' })
        }

        const result = JSON.parse(content)

        // Validate structure
        if (!result.score || !result.exposed || !result.locked) {
            return res.status(502).json({ error: 'AI分析結果のフォーマットが不正です。再度お試しください。' })
        }

        return res.status(200).json(result)
    } catch (err) {
        console.error('Analysis error:', err)
        return res.status(500).json({ error: '分析中にエラーが発生しました。再度お試しください。' })
    }
}
