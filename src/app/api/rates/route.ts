/**
 * GET /api/rates
 * Proxies currency exchange rates from an external API and caches the result.
 * Falls back gracefully if the external API is unavailable.
 *
 * To enable live rates, set EXCHANGE_RATE_API_KEY in .env.
 * Free tier available at: https://www.exchangerate-api.com/
 */

import type { GetRatesResponse } from '@/types/api'

// In-memory cache so we don't hammer the external API on every request
let cachedRates: GetRatesResponse['data'] | null = null
let cacheExpiry = 0
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

export async function GET(): Promise<Response> {
  // Return cached data if still fresh
  if (cachedRates && Date.now() < cacheExpiry) {
    return Response.json({ data: cachedRates })
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY
  if (!apiKey) {
    return Response.json({
      data: null,
      error: 'Currency conversion is not configured. Set EXCHANGE_RATE_API_KEY in .env.',
    } satisfies GetRatesResponse)
  }

  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) throw new Error(`API responded with ${res.status}`)

    const json = await res.json()
    cachedRates = {
      base: 'USD',
      rates: json.conversion_rates,
      updatedAt: new Date().toISOString(),
    }
    cacheExpiry = Date.now() + CACHE_TTL_MS

    return Response.json({ data: cachedRates } satisfies GetRatesResponse)
  } catch (err) {
    console.error('[GET /api/rates]', err)
    return Response.json(
      {
        data: cachedRates, // serve stale data if available
        error: 'Failed to fetch live rates',
      } satisfies GetRatesResponse,
      { status: cachedRates ? 200 : 503 }
    )
  }
}
