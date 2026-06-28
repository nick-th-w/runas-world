import { useState } from 'react'
import rewardsData from '../data/rewards.json'

// ── Sticker art (same as before) ─────────────────────────────────────────────

function FlowerSticker() {
  return (
    <svg viewBox="0 0 60 60" width="52" height="52">
      {[0,60,120,180,240,300].map((deg) => (
        <ellipse key={deg} cx="30" cy="30" rx="8" ry="14" fill="#facc15" stroke="#d4a000" strokeWidth="1.5"
          transform={`rotate(${deg} 30 30) translate(0,-12)`} />
      ))}
      <circle cx="30" cy="30" r="10" fill="#fb923c" stroke="#d4a000" strokeWidth="2" />
      <circle cx="30" cy="30" r="5" fill="#fef08a" />
    </svg>
  )
}

function KindHeartBadge() {
  return (
    <svg viewBox="0 0 60 60" width="52" height="52">
      <circle cx="30" cy="30" r="28" fill="#fce7f3" stroke="#e879f9" strokeWidth="3" />
      <path d="M30,44 C30,44 14,34 14,22 C14,16 19,12 24,14 C27,15 30,18 30,18 C30,18 33,15 36,14 C41,12 46,16 46,22 C46,34 30,44 30,44 Z"
        fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
    </svg>
  )
}

function SharpEyesBadge() {
  return (
    <svg viewBox="0 0 60 60" width="52" height="52">
      <circle cx="30" cy="30" r="28" fill="#eff6ff" stroke="#60a5fa" strokeWidth="3" />
      <circle cx="26" cy="26" r="12" fill="none" stroke="#3b82f6" strokeWidth="3" />
      <line x1="35" y1="35" x2="46" y2="46" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <circle cx="26" cy="26" r="8" fill="#bfdbfe" opacity="0.6" />
    </svg>
  )
}

function FlowerCrownItem() {
  return (
    <svg viewBox="0 0 80 40" width="72" height="36">
      <path d="M10,20 Q20,6 30,20 Q40,6 50,20 Q60,6 70,20" stroke="#e879f9" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="14" r="7" fill="#fb923c" stroke="#d4a000" strokeWidth="1.5" />
      <circle cx="40" cy="10" r="7" fill="#facc15" stroke="#d4a000" strokeWidth="1.5" />
      <circle cx="60" cy="14" r="7" fill="#f472b6" stroke="#be185d" strokeWidth="1.5" />
      <circle cx="20" cy="14" r="3.5" fill="#fff" />
      <circle cx="40" cy="10" r="3.5" fill="#fff" />
      <circle cx="60" cy="14" r="3.5" fill="#fff" />
    </svg>
  )
}

const REWARD_ART = {
  flowerSticker: FlowerSticker,
  kindHeart:     KindHeartBadge,
  sharpEyes:     SharpEyesBadge,
  flowerCrown:   FlowerCrownItem,
}

// ── Placeholder sticker (future chapters) ────────────────────────────────────

function PlaceholderSticker({ n }) {
  return (
    <svg viewBox="0 0 60 60" width="52" height="52">
      <rect x="4" y="4" width="52" height="52" rx="8"
        fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="5 3" />
      <text x="30" y="36" textAnchor="middle" fontSize="20" fill="#d1d5db">?</text>
    </svg>
  )
}

// ── Book page flip ────────────────────────────────────────────────────────────

const SLOTS_PER_SPREAD = 20 // 10 per page × 2 pages
const TOTAL_SLOTS = 40      // 4 chapters worth of future stickers

function buildSlots(earnedSet) {
  const rewardList = Object.entries(rewardsData) // currently 4
  return Array.from({ length: TOTAL_SLOTS }, (_, i) => {
    if (i < rewardList.length) {
      const [id, reward] = rewardList[i]
      return { type: earnedSet.has(id) ? 'earned' : 'locked', id, reward }
    }
    return { type: 'placeholder', n: i }
  })
}

function StickerSlot({ slot, index }) {
  if (slot.type === 'earned') {
    const Art = REWARD_ART[slot.id]
    return (
      <div className="sticker-slot earned" title={slot.reward.name}>
        <div className="sticker-art">{Art && <Art />}</div>
        <p className="sticker-slot-name">{slot.reward.name}</p>
      </div>
    )
  }
  if (slot.type === 'locked') {
    const Art = REWARD_ART[slot.id]
    return (
      <div className="sticker-slot locked" title={`Earn: ${slot.reward.name}`}>
        <div className="sticker-art" style={{ opacity: 0.18 }}>{Art && <Art />}</div>
        <p className="sticker-slot-name" style={{ opacity: 0.3 }}>?</p>
      </div>
    )
  }
  return (
    <div className="sticker-slot placeholder">
      <PlaceholderSticker n={index} />
    </div>
  )
}

// ── Main StickerBook ──────────────────────────────────────────────────────────

export default function StickerBook({ quest, playerName, onBack }) {
  const earnedSet = new Set(quest.rewards)
  const slots = buildSlots(earnedSet)
  const totalSpreads = Math.ceil(slots.length / SLOTS_PER_SPREAD)

  const [spread, setSpread] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [flipDir, setFlipDir] = useState('forward')

  const goSpread = (dir) => {
    const next = spread + (dir === 'forward' ? 1 : -1)
    if (next < 0 || next >= totalSpreads) return
    setFlipDir(dir)
    setFlipping(true)
    setTimeout(() => { setSpread(next); setFlipping(false) }, 400)
  }

  const spreadSlots = slots.slice(spread * SLOTS_PER_SPREAD, (spread + 1) * SLOTS_PER_SPREAD)
  const leftSlots  = spreadSlots.slice(0, 10)
  const rightSlots = spreadSlots.slice(10, 20)
  const earnedCount = quest.rewards.length

  return (
    <div className="screen sticker-book-screen">
      <div className="book-topbar">
        <button className="btn-back" onClick={onBack}>← Back to Map</button>
        <h1 className="book-title">📖 Sticker Book</h1>
        <span className="book-count">{earnedCount} / {TOTAL_SLOTS} stickers</span>
      </div>

      {/* Book container */}
      <div className="book-container">
        <div className={`book-spread ${flipping ? `flipping-${flipDir}` : ''}`}>
          {/* Left page */}
          <div className="book-page left-page">
            <div className="page-corner-label">Runa&apos;s Collection</div>
            <div className="sticker-page-grid">
              {leftSlots.map((slot, i) => (
                <StickerSlot key={i} slot={slot} index={spread * SLOTS_PER_SPREAD + i} />
              ))}
            </div>
            <div className="page-number">p. {spread * 2 + 1}</div>
          </div>

          {/* Spine */}
          <div className="book-spine" />

          {/* Right page */}
          <div className="book-page right-page">
            <div className="page-corner-label">Chapter {spread + 1} onwards</div>
            <div className="sticker-page-grid">
              {rightSlots.map((slot, i) => (
                <StickerSlot key={i} slot={slot} index={spread * SLOTS_PER_SPREAD + 10 + i} />
              ))}
            </div>
            <div className="page-number">p. {spread * 2 + 2}</div>
          </div>
        </div>
      </div>

      {/* Page navigation */}
      <div className="book-nav">
        <button className="btn-page-turn" onClick={() => goSpread('back')} disabled={spread === 0}>
          ◀ Previous
        </button>
        <span className="spread-indicator">
          {Array.from({ length: totalSpreads }, (_, i) => (
            <span key={i} className={`spread-dot ${i === spread ? 'active' : ''}`} />
          ))}
        </span>
        <button className="btn-page-turn" onClick={() => goSpread('forward')} disabled={spread === totalSpreads - 1}>
          Next ▶
        </button>
      </div>

      {/* Medal summary */}
      <div className="book-medal-row">
        <span>🥉 {quest.medalTotals.bronze} bronze</span>
        <span>🥈 {quest.medalTotals.silver} silver</span>
        <span>🥇 {quest.medalTotals.gold} gold</span>
      </div>
    </div>
  )
}
