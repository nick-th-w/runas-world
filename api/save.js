import { put } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  let body
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body }
  catch { return res.status(400).json({ error: 'bad json' }) }

  const { pin, state } = body || {}
  if (!pin || !state) return res.status(400).json({ error: 'missing pin or state' })
  if (!/^\d{4}$/.test(String(pin))) return res.status(400).json({ error: 'pin must be 4 digits' })

  try {
    const { url } = await put(`saves/${pin}.json`, JSON.stringify(state), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    res.json({ ok: true, url })
  } catch (err) {
    console.error('save error', err)
    res.status(500).json({ error: 'save failed' })
  }
}
