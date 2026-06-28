import { useState } from 'react'
import rewardsData from '../data/rewards.json'
import chapters from '../data/chapters.json'

// ── Sticker art ───────────────────────────────────────────────────────────────

function FlowerSticker() {
  return (
    <svg viewBox="0 0 60 60" width="64" height="64">
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
    <svg viewBox="0 0 60 60" width="64" height="64">
      <circle cx="30" cy="30" r="28" fill="#fce7f3" stroke="#e879f9" strokeWidth="3" />
      <path d="M30,44 C30,44 14,34 14,22 C14,16 19,12 24,14 C27,15 30,18 30,18 C30,18 33,15 36,14 C41,12 46,16 46,22 C46,34 30,44 30,44 Z"
        fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
    </svg>
  )
}

function SharpEyesBadge() {
  return (
    <svg viewBox="0 0 60 60" width="64" height="64">
      <circle cx="30" cy="30" r="28" fill="#eff6ff" stroke="#60a5fa" strokeWidth="3" />
      <circle cx="26" cy="26" r="12" fill="none" stroke="#3b82f6" strokeWidth="3" />
      <line x1="35" y1="35" x2="46" y2="46" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <circle cx="26" cy="26" r="8" fill="#bfdbfe" opacity="0.6" />
    </svg>
  )
}

function FlowerCrownItem() {
  return (
    <svg viewBox="0 0 80 40" width="80" height="40">
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

function GoldenGlovesSticker() {
  return (
    <svg viewBox="0 0 100 60" width="80" height="48">
      <g transform="translate(5,5)">
        <ellipse cx="22" cy="28" rx="20" ry="22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        <rect x="4" y="20" width="36" height="12" rx="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <rect x="8" y="42" width="28" height="7" rx="3" fill="#16a34a" stroke="#166534" strokeWidth="1.5" />
        <ellipse cx="5" cy="16" rx="6" ry="9" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        <text x="14" y="36" fontSize="13" fill="#d97706" fontWeight="bold">G</text>
      </g>
      <g transform="translate(95,5) scale(-1,1)">
        <ellipse cx="22" cy="28" rx="20" ry="22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        <rect x="4" y="20" width="36" height="12" rx="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <rect x="8" y="42" width="28" height="7" rx="3" fill="#16a34a" stroke="#166534" strokeWidth="1.5" />
        <ellipse cx="5" cy="16" rx="6" ry="9" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        <text x="14" y="36" fontSize="13" fill="#d97706" fontWeight="bold">G</text>
      </g>
    </svg>
  )
}

function GoldTrophySticker() {
  return (
    <svg viewBox="0 0 60 80" width="48" height="64">
      <path d="M14,20 L14,52 Q30,62 46,52 L46,20 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
      <path d="M14,26 Q4,26 4,38 Q4,50 14,50" fill="none" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
      <path d="M46,26 Q56,26 56,38 Q56,50 46,50" fill="none" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
      <path d="M20,24 Q24,21 28,24" stroke="#fef08a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="25" y="60" width="10" height="9" rx="2" fill="#d97706" />
      <rect x="18" y="68" width="24" height="6" rx="3" fill="#d97706" />
      <text x="30" y="17" textAnchor="middle" fontSize="14">⭐</text>
      <text x="30" y="48" textAnchor="middle" fontSize="11">✨</text>
    </svg>
  )
}

function ToothSticker() {
  return <svg viewBox="0 0 60 70" width="52" height="60">
    <path d="M10,10 Q10,0 20,0 L40,0 Q50,0 50,10 L52,35 Q55,55 45,65 Q38,72 30,65 Q22,72 15,65 Q5,55 8,35 Z" fill="#fff" stroke="#d1d5db" strokeWidth="2" />
    <path d="M28,40 Q30,50 32,40" stroke="#e5e7eb" strokeWidth="1.5" fill="none" />
  </svg>
}

function FishBadge() {
  return <svg viewBox="0 0 60 60" width="56" height="56">
    <circle cx="30" cy="30" r="28" fill="#dbeafe" stroke="#60a5fa" strokeWidth="3" />
    <ellipse cx="30" cy="30" rx="14" ry="8" fill="#fb923c" />
    <path d="M14,30 L4,22 L4,38 Z" fill="#ea580c" />
    <circle cx="38" cy="27" r="3" fill="#fff" /><circle cx="38" cy="27" r="1.5" fill="#333" />
  </svg>
}

function WandSticker() {
  return <svg viewBox="0 0 50 70" width="40" height="56">
    <line x1="10" y1="60" x2="40" y2="15" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
    <text x="28" y="18" fontSize="20">⭐</text>
    {[[8,50],[16,38],[30,28]].map(([x,y],i)=><text key={i} x={x} y={y} fontSize="8" fill="#fde047">✦</text>)}
  </svg>
}

function MoonBadge() {
  return <svg viewBox="0 0 60 60" width="56" height="56">
    <circle cx="30" cy="30" r="28" fill="#fef3c7" stroke="#fbbf24" strokeWidth="3" />
    <circle cx="30" cy="30" r="18" fill="#fde047" stroke="#d97706" strokeWidth="1.5" />
    <circle cx="38" cy="24" r="12" fill="#fef3c7" stroke="#fef3c7" strokeWidth="1" />
    <text x="22" y="36" fontSize="12" fill="#d97706">🌙</text>
  </svg>
}

function FairyCoinSticker() {
  return <svg viewBox="0 0 60 60" width="56" height="56">
    <circle cx="30" cy="30" r="26" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
    <circle cx="30" cy="30" r="20" fill="#fde047" />
    <text x="22" y="36" fontSize="16" fill="#d97706">🪙</text>
    {[[10,10],[50,10],[10,50],[50,50]].map(([x,y],i)=><text key={i} x={x} y={y} fontSize="8" fill="#fbbf24" opacity="0.7">✨</text>)}
  </svg>
}

function MoonTiaraSticker() {
  return <svg viewBox="0 0 80 40" width="72" height="36">
    <path d="M10,30 Q20,8 30,20 Q40,8 50,20 Q60,8 70,30" stroke="#a78bfa" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="20" cy="16" r="6" fill="#fde047" stroke="#d97706" strokeWidth="1.5" />
    <circle cx="40" cy="10" r="7" fill="#c084fc" stroke="#9333ea" strokeWidth="1.5" />
    <circle cx="60" cy="16" r="6" fill="#fde047" stroke="#d97706" strokeWidth="1.5" />
    <text x="37" y="14" fontSize="8" fill="#fff">🌙</text>
  </svg>
}

const REWARD_ART = {
  flowerSticker:  FlowerSticker,
  kindHeart:      KindHeartBadge,
  sharpEyes:      SharpEyesBadge,
  flowerCrown:    FlowerCrownItem,
  goldenGloves:   GoldenGlovesSticker,
  goldTrophy:     GoldTrophySticker,
  ch2ToothBadge:  ToothSticker,
  ch2FishBadge:   FishBadge,
  ch2WandSticker: WandSticker,
  ch2MoonBadge:   MoonBadge,
  ch2FairyCoin:   FairyCoinSticker,
  ch2MoonTiara:   MoonTiaraSticker,
}

// ── Chapter → sticker mapping (add new chapters here as they ship) ────────────

const CHAPTER_STICKERS = {
  1: ['kindHeart', 'sharpEyes', 'flowerSticker', 'flowerCrown'],
  2: ['ch2ToothBadge', 'ch2FishBadge', 'ch2WandSticker', 'ch2MoonBadge', 'ch2FairyCoin', 'ch2MoonTiara'],
}

const SOLLY_STICKERS = {
  1: ['goldenGloves', 'goldTrophy'],
}

const SOLLY_GAMES = {
  1: { title: 'Penalty Shootout', emoji: '⚽' },
}

const SLOTS_PER_PAGE = 6

function buildSlots(ids, earnedSet) {
  const slots = (ids || []).map(id => ({
    type: earnedSet.has(id) ? 'earned' : 'locked',
    id,
    name: rewardsData[id]?.name || id,
  }))
  while (slots.length < SLOTS_PER_PAGE) {
    slots.push({ type: 'placeholder' })
  }
  return slots
}

// ── Sticker slot ──────────────────────────────────────────────────────────────

function StickerSlot({ slot, isDark }) {
  if (slot.type === 'earned') {
    const Art = REWARD_ART[slot.id]
    return (
      <div className="sb-slot sb-earned">
        <div className="sb-art">{Art && <Art />}</div>
        <p className="sb-name">{slot.name}</p>
      </div>
    )
  }
  if (slot.type === 'locked') {
    const Art = REWARD_ART[slot.id]
    return (
      <div className="sb-slot sb-locked">
        <div className="sb-art" style={{ opacity: 0.18 }}>{Art && <Art />}</div>
        <p className="sb-name" style={{ opacity: 0.3 }}>?</p>
      </div>
    )
  }
  return (
    <div className="sb-slot sb-placeholder">
      <svg viewBox="0 0 70 70" width="52" height="52">
        <rect x="4" y="4" width="62" height="62" rx="10"
          fill="none" stroke={isDark ? '#a78bfa' : '#d1d5db'}
          strokeWidth="2.5" strokeDasharray="6 4" opacity="0.4" />
        <text x="35" y="42" textAnchor="middle" fontSize="22"
          fill={isDark ? '#a78bfa' : '#d1d5db'} opacity="0.35">?</text>
      </svg>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const CHAPTER_COUNT = chapters.length // 11

export default function StickerBook({ quest, playerName, onBack }) {
  const earnedSet = new Set(quest.rewards)
  const [spread, setSpread] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [flipDir, setFlipDir] = useState('forward')

  const goSpread = (dir) => {
    const next = spread + (dir === 'forward' ? 1 : -1)
    if (next < 0 || next >= CHAPTER_COUNT) return
    setFlipDir(dir)
    setFlipping(true)
    setTimeout(() => { setSpread(next); setFlipping(false) }, 400)
  }

  const chNum = spread + 1
  const chapter = chapters[spread]
  const chSlots = buildSlots(CHAPTER_STICKERS[chNum], earnedSet)
  const sollySlots = buildSlots(SOLLY_STICKERS[chNum], earnedSet)
  const sollyGame = SOLLY_GAMES[chNum] || { title: 'Coming soon…', emoji: '🎮' }

  return (
    <div className="screen sticker-book-screen">
      {/* Top bar */}
      <div className="book-topbar">
        <button className="btn-back" onClick={onBack}>← Back to Map</button>
        <h1 className="book-title">📖 Sticker Book</h1>
        <span className="book-count">{earnedSet.size} stickers earned</span>
      </div>

      {/* Book */}
      <div className="book-container">
        <div className={`book-spread ${flipping ? `flipping-${flipDir}` : ''}`}>

          {/* LEFT — Chapter page */}
          <div className="book-page left-page ch-page">
            <div className="sb-page-header ch-header">
              <span className="sb-ch-num">Chapter {chNum}</span>
              <span className="sb-ch-title">{chapter.title}</span>
            </div>
            <div className="sb-grid">
              {chSlots.map((slot, i) => <StickerSlot key={i} slot={slot} isDark={false} />)}
            </div>
            <div className="page-number">p. {spread * 2 + 1}</div>
          </div>

          {/* Spine */}
          <div className="book-spine" />

          {/* RIGHT — Solly's game page */}
          <div className="book-page right-page solly-pg">
            <div className="sb-page-header solly-header">
              <span className="sb-solly-emoji">{sollyGame.emoji}</span>
              <span className="sb-solly-label">Solly&apos;s Secret Game</span>
              <span className="sb-solly-sub">{sollyGame.title}</span>
            </div>
            <div className="sb-grid">
              {sollySlots.map((slot, i) => <StickerSlot key={i} slot={slot} isDark={true} />)}
            </div>
            <div className="page-number" style={{ color: '#a78bfa' }}>p. {spread * 2 + 2}</div>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <div className="book-nav">
        <button className="btn-page-turn" onClick={() => goSpread('back')} disabled={spread === 0}>
          ◀ Previous
        </button>
        <span className="spread-indicator">
          {Array.from({ length: CHAPTER_COUNT }, (_, i) => (
            <span key={i} className={`spread-dot ${i === spread ? 'active' : ''}`} />
          ))}
        </span>
        <button className="btn-page-turn" onClick={() => goSpread('forward')} disabled={spread === CHAPTER_COUNT - 1}>
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
