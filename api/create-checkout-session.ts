import { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

// Initialize Stripe with the secret key from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(stripeSecretKey || '')

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    if (!stripeSecretKey) {
        return res.status(500).json({ message: 'Stripe API key is not configured' })
    }

    try {
        const { lpHash } = req.body || {}

        // Construct the full URL of the originating request for redirecting
        const protocol = req.headers['x-forwarded-proto'] || 'http'
        const host = req.headers.host
        const origin = `${protocol}://${host}`

        const session = await stripe.checkout.sessions.create({
            client_reference_id: lpHash || 'unknown',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'jpy',
                        product_data: {
                            name: 'Satori Laboratory - フルレポート',
                            description: 'AIによるLPの精緻な問題分析と、行動経済学に基づく具体的な改善コピー提案。',
                        },
                        unit_amount: 4980,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // Redirect back to the report page with the session ID upon success
            success_url: `${origin}/report?session_id={CHECKOUT_SESSION_ID}`,
            // Redirect back to the top page upon cancellation
            cancel_url: `${origin}/`,
        })

        res.status(200).json({ url: session.url })
    } catch (error: any) {
        console.error('Stripe checkout error:', error)
        res.status(500).json({ message: error.message || 'Failed to create checkout session' })
    }
}
