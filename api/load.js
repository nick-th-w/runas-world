import { list } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { pin } = req.query
  if (!pin || !/^\d{4}$/.test(String(pin))) {
    return res.status(400).json({ error: 'pin must be 4 digits' })
  }

  try {
    const { blobs } = await list({
      prefix: `saves/${pin}.json`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    const match = blobs.find(b => b.pathname === `saves/${pin}.json`)
    if (!match) return res.status(404).json({ error: 'no save found for this PIN' })

    // Public blob — fetch directly by URL
    const response = await fetch(match.url)
    if (!response.ok) return res.status(502).json({ error: 'blob fetch failed' })

    const state = await response.json()
    res.json({ state })
  } catch (err) {
    console.error('load error', err)
    res.status(500).json({ error: 'load failed' })
  }
}
