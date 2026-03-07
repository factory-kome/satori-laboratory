import type { VercelRequest, VercelResponse } from '@vercel/node'

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

ユーザーから提供されるLP情報（ターゲット層、価格帯、コピー/URL）を分析し、以下のJSON形式で必ず回答してください。

回答ルール：
1. scoreは0-100の整数。一般的なLPは25-45程度。素晴らしいLPでも70前後。
2. 分析は行動経済学（カーネマン、チャルディーニ等）と認知心理学の術語を適切に使用すること。
3. 9つの改善ポイントそれぞれにfinding, recommendation, improvedCopyを含めること。
4. findingは具体的で、コピーの何がなぜ問題なのかを明確にすること。
5. recommendationは実務で即座に適用可能な粒度で書くこと。
6. improvedCopyは感情に訴えかけ、ターゲットの深層心理に刺さる表現にすること。
7. categoryは以下から最も関連するものを1つ選ぶこと:
   ヘッドライン, ボディコピー, CTA設計, 信頼性構築, 価格提示, ターゲティング, ビジュアル戦略, コピーの構造, 心理的トリガー
8. relatedInsightは以下のslugから最も関連するものを1つ選ぶこと:
   cognitive-load, attention-drift, dual-process, physical-fit, trust-logic,
   frictionless-action, anchoring-effect, scarcity-principle, social-proof-design,
   narrative-transport, micro-copy, color-psychology
9. summaryはLP全体の総合評価を3-4文で記述すること。

JSON形式（これ以外の出力は厳禁）：
{
  "score": 数値,
  "summary": "LP全体の総合評価（3-4文）",
  "findings": [
    {
      "title": "改善ポイントのタイトル（日本語）",
      "category": "カテゴリ名",
      "severity": "high | medium | low",
      "finding": "問題の分析（3-4文、行動経済学の術語を含む）",
      "recommendation": "改善の方向性（3-4文、具体的な施策）",
      "improvedCopy": "改善後のコピー案（感情に訴えかける表現）",
      "relatedInsight": "関連するナレッジのslug"
    }
  ]
}

findingsは必ず9個出力してください。重要度の高い順に並べてください。`

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

    const { target, price, copy } = req.body || {}
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
                max_tokens: 4000,
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
