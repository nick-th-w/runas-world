import rewardsData from '../data/rewards.json'

// CSS/SVG reward illustrations
function FlowerSticker() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      {[0,60,120,180,240,300].map((deg) => (
        <ellipse key={deg} cx="30" cy="30" rx="8" ry="14"
          fill="#facc15" stroke="#d4a000" strokeWidth="1.5"
          transform={`rotate(${deg} 30 30) translate(0,-12)`} />
      ))}
      <circle cx="30" cy="30" r="10" fill="#fb923c" stroke="#d4a000" strokeWidth="2" />
      <circle cx="30" cy="30" r="5" fill="#fef08a" />
    </svg>
  )
}

function KindHeartBadge() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <circle cx="30" cy="30" r="28" fill="#fce7f3" stroke="#e879f9" strokeWidth="3" />
      <path d="M30,44 C30,44 14,34 14,22 C14,16 19,12 24,14 C27,15 30,18 30,18 C30,18 33,15 36,14 C41,12 46,16 46,22 C46,34 30,44 30,44 Z"
        fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
    </svg>
  )
}

function SharpEyesBadge() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <circle cx="30" cy="30" r="28" fill="#eff6ff" stroke="#60a5fa" strokeWidth="3" />
      {/* magnifying glass */}
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

const REWARD_ART = {
  flowerSticker: FlowerSticker,
  kindHeart: KindHeartBadge,
  sharpEyes: SharpEyesBadge,
  flowerCrown: FlowerCrownItem,
}

export default function StickerBook({ quest, onBack, playerName }) {
  const earned = quest.rewards

  return (
    <div className="screen sticker-book">
      <h1 className="game-title">Sticker Book</h1>
      <p className="subtitle">{playerName}&apos;s collection</p>

      <div className="sticker-grid">
        {Object.values(rewardsData).map((reward) => {
          const Art = REWARD_ART[reward.id]
          const has = earned.includes(reward.id)
          return (
            <div key={reward.id} className={`sticker-slot ${has ? 'earned' : 'locked'}`}>
              <div className="sticker-art" style={{ opacity: has ? 1 : 0.25 }}>
                {Art && <Art />}
              </div>
              <p className="sticker-name">{reward.name}</p>
              {!has && <p className="sticker-locked">🔒</p>}
            </div>
          )
        })}
      </div>

      <button className="btn-primary" onClick={onBack}>
        Back to Adventure
      </button>
    </div>
  )
}
