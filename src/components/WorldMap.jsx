import chapters from '../data/chapters.json'

// Converts mapX/mapY (0–100) to SVG coordinates in a 900×520 canvas
const W = 900, H = 520
const px = (x) => (x / 100) * W
const py = (y) => (y / 100) * H

// Winding path points (in SVG coords), matching chapter order
const PATH_D = (() => {
  const pts = chapters.map((c) => [px(c.mapX), py(c.mapY)])
  let d = `M ${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const cx1 = x0 + (x1 - x0) * 0.5
    const cy1 = y0
    const cx2 = x0 + (x1 - x0) * 0.5
    const cy2 = y1
    d += ` C ${cx1},${cy1} ${cx2},${cy2} ${x1},${y1}`
  }
  return d
})()

const BIOME_COLORS = {
  forest: '#bbf7d0', lake: '#bae6fd', cave: '#ddd6fe',
  desert: '#fde68a', ocean: '#7dd3fc', mountain: '#e2e8f0',
  tundra: '#e0f2fe', ruins: '#fef3c7', lava: '#fee2e2',
  sky: '#ede9fe', stars: '#1e1b4b',
}

function MedalBadge({ medal }) {
  if (!medal) return null
  const emoji = { gold: '🥇', silver: '🥈', bronze: '🥉' }[medal]
  return <span className="node-medal">{emoji}</span>
}

export default function WorldMap({ quest, onPlayChapter, onStickerBook }) {
  const { chaptersCompleted, questBests, medalTotals } = quest

  // Chapter 1 is always unlocked; each subsequent chapter unlocks when previous is complete
  const isUnlocked = (i) => i === 0 || chaptersCompleted[i - 1]
  const isComplete = (i) => chaptersCompleted[i]

  const handleClick = (ch, idx) => {
    if (!isUnlocked(idx)) return
    if (ch.id !== 1) return // only ch1 playable for now
    onPlayChapter(ch.id)
  }

  return (
    <div className="world-map-screen">
      {/* Medal bar */}
      <div className="map-medal-bar">
        <span className="map-title">✨ Runa&apos;s World</span>
        <div className="medal-counts">
          <span>🥉 {medalTotals.bronze}</span>
          <span>🥈 {medalTotals.silver}</span>
          <span>🥇 {medalTotals.gold}</span>
        </div>
        <button className="btn-book" onClick={onStickerBook}>📖 Sticker Book</button>
      </div>

      {/* Map SVG */}
      <div className="map-svg-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block' }}>
          {/* Sky/ground gradient background */}
          <defs>
            <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#1e1b4b" />
              <stop offset="35%"  stopColor="#818cf8" />
              <stop offset="65%"  stopColor="#86efac" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
            </filter>
          </defs>

          <rect width={W} height={H} fill="url(#mapBg)" rx="12" />

          {/* Parchment texture overlay */}
          <rect width={W} height={H} fill="#fdf6e3" opacity="0.18" rx="12" />

          {/* Geographic doodles */}
          {/* Forest trees near ch1 */}
          {[[40,420],[60,430],[75,415]].map(([x,y],i) => (
            <g key={i} transform={`translate(${x},${y})`}>
              <polygon points="0,-28 -16,0 16,0" fill="#16a34a" opacity="0.7" />
              <rect x="-4" y="0" width="8" height="14" fill="#78350f" opacity="0.7" />
            </g>
          ))}
          {/* Desert dunes near ch4 */}
          {[[420,400],[470,390],[510,405]].map(([x,y],i) => (
            <ellipse key={i} cx={x} cy={y} rx="35" ry="16" fill="#fde68a" opacity="0.5" />
          ))}
          {/* Ocean waves near ch5 */}
          <path d="M530,330 Q555,318 580,330 Q605,342 630,330" stroke="#38bdf8" strokeWidth="3" fill="none" opacity="0.6" />
          <path d="M535,344 Q560,332 585,344 Q610,356 635,344" stroke="#38bdf8" strokeWidth="3" fill="none" opacity="0.6" />
          {/* Mountain peaks near ch6 */}
          <polygon points="410,240 430,200 450,240" fill="#94a3b8" opacity="0.6" />
          <polygon points="425,240 450,195 475,240" fill="#cbd5e1" opacity="0.6" />
          {/* Stars near ch11 */}
          {[[820,50],[840,70],[860,45],[875,65],[855,35]].map(([x,y],i) => (
            <text key={i} x={x} y={y} fontSize="12" fill="#fbbf24" opacity="0.8">✦</text>
          ))}

          {/* Winding path */}
          <path d={PATH_D} stroke="#d97706" strokeWidth="6" fill="none"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.7"
            strokeDasharray="12 6" />
          <path d={PATH_D} stroke="#fef9c3" strokeWidth="2" fill="none"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.5"
            strokeDasharray="12 6" />

          {/* Chapter nodes */}
          {chapters.map((ch, idx) => {
            const x = px(ch.mapX)
            const y = py(ch.mapY)
            const unlocked = isUnlocked(idx)
            const complete = isComplete(idx)
            const current = unlocked && !complete

            return (
              <g key={ch.id}
                transform={`translate(${x},${y})`}
                style={{ cursor: unlocked && ch.id === 1 ? 'pointer' : 'default' }}
                onClick={() => handleClick(ch, idx)}
              >
                {/* Pulse ring for current chapter */}
                {current && ch.id === 1 && (
                  <circle r="32" fill="none" stroke={ch.color} strokeWidth="3" opacity="0.5"
                    style={{ animation: 'pulse 1.4s ease-in-out infinite' }} />
                )}
                {/* Node circle */}
                <circle r="24"
                  fill={unlocked ? ch.color : '#cbd5e1'}
                  stroke={complete ? '#fbbf24' : unlocked ? '#3b1f0a' : '#94a3b8'}
                  strokeWidth={complete ? 4 : 3}
                  filter="url(#shadow)"
                  opacity={unlocked ? 1 : 0.6}
                />
                {/* Icon or lock */}
                <text x="0" y="8" textAnchor="middle" fontSize="18">
                  {unlocked ? ch.icon : '🔒'}
                </text>
                {/* Completion tick */}
                {complete && (
                  <text x="18" y="-14" fontSize="14">✅</text>
                )}
                {/* Chapter number */}
                <rect x="-14" y="28" width="28" height="16" rx="8"
                  fill={unlocked ? ch.color : '#e2e8f0'} opacity="0.9" />
                <text x="0" y="40" textAnchor="middle" fontSize="10" fill="#1c1917" fontWeight="bold">
                  Ch {ch.id}
                </text>
                {/* Title below (only if unlocked) */}
                {unlocked && (
                  <text x="0" y="58" textAnchor="middle" fontSize="8.5" fill="#fff"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                    {ch.title.length > 18 ? ch.title.slice(0, 16) + '…' : ch.title}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Chapter 1 status bar at bottom */}
      <div className="map-bottom-bar">
        {chaptersCompleted[0] ? (
          <span>Chapter 1 complete! 🎉 <button className="btn-replay" onClick={() => onPlayChapter(1)}>Replay Ch 1</button></span>
        ) : (
          <button className="btn-primary" onClick={() => onPlayChapter(1)}>
            {quest.phase !== 'meadow' ? 'Continue Chapter 1 →' : 'Begin Chapter 1 →'}
          </button>
        )}
      </div>
    </div>
  )
}
