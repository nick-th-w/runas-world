// Solly the baby Sausage Dog — appears after every chapter to hint at secret games

function SollySVG() {
  return (
    <svg viewBox="0 0 120 90" width="130" height="97" aria-label="Solly the Sausage Dog">
      {/* Long sausage body */}
      <ellipse cx="60" cy="68" rx="50" ry="19" fill="#cd853f" stroke="#8b4513" strokeWidth="2.5" />
      {/* Long droopy ears */}
      <ellipse cx="34" cy="42" rx="12" ry="20" fill="#a0522d" stroke="#8b4513" strokeWidth="2"
        transform="rotate(-12 34 42)" />
      <ellipse cx="86" cy="42" rx="12" ry="20" fill="#a0522d" stroke="#8b4513" strokeWidth="2"
        transform="rotate(12 86 42)" />
      {/* Head */}
      <circle cx="60" cy="36" r="26" fill="#cd853f" stroke="#8b4513" strokeWidth="2.5" />
      {/* Rosy cheeks */}
      <circle cx="42" cy="42" r="7" fill="#ef9090" opacity="0.4" />
      <circle cx="78" cy="42" r="7" fill="#ef9090" opacity="0.4" />
      {/* Snout */}
      <ellipse cx="60" cy="48" rx="11" ry="9" fill="#d2691e" stroke="#8b4513" strokeWidth="1.5" />
      {/* Nose */}
      <ellipse cx="60" cy="43" rx="4.5" ry="3.5" fill="#2d0f00" />
      {/* Eyes */}
      <circle cx="49" cy="31" r="6" fill="#1a0800" />
      <circle cx="71" cy="31" r="6" fill="#1a0800" />
      <circle cx="50.5" cy="29.5" r="2.2" fill="#fff" />
      <circle cx="72.5" cy="29.5" r="2.2" fill="#fff" />
      {/* Happy smile */}
      <path d="M52,52 Q60,59 68,52" stroke="#8b4513" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Short stubby legs */}
      <rect x="18" y="80" width="14" height="11" rx="6" fill="#a0522d" stroke="#8b4513" strokeWidth="1.5" />
      <rect x="38" y="82" width="14" height="9" rx="5" fill="#a0522d" stroke="#8b4513" strokeWidth="1.5" />
      <rect x="68" y="82" width="14" height="9" rx="5" fill="#a0522d" stroke="#8b4513" strokeWidth="1.5" />
      <rect x="88" y="80" width="14" height="11" rx="6" fill="#a0522d" stroke="#8b4513" strokeWidth="1.5" />
      {/* Wagging tail */}
      <path d="M106,56 Q116,44 112,32" stroke="#8b4513" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function SollyPopup({ playerName, onClose }) {
  return (
    <div className="solly-overlay">
      <div className="solly-popup">
        <div className="solly-header">
          <span className="solly-brand">⚽ Solly&apos;s Secret Games</span>
        </div>

        <div className="solly-body">
          <div className="solly-character">
            <SollySVG />
          </div>
          <div className="solly-bubble">
            <p className="solly-text">
              Psssst, <strong>{playerName}</strong>! I&apos;m Solly! 🐾
            </p>
            <p className="solly-text">
              I hide secret games on the adventure map. Can you spot the ⚽ between Chapter 1 and Chapter 2?
            </p>
            <p className="solly-text">
              Tap it to play my <strong>Penalty Shootout</strong>! More secret games are waiting ahead…
            </p>
          </div>
        </div>

        <button className="btn-primary" onClick={onClose}>
          Let&apos;s find it! 🗺️
        </button>
      </div>
    </div>
  )
}
