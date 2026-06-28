import { useState, useEffect, useRef, useCallback } from 'react'

const TOOTH_COLORS = ['#ff6b9d', '#a29bfe', '#74b9ff', '#00cec9', '#fdcb6e']
const HIT_Y_MIN = 76
const HIT_Y_MAX = 94
const FRAME_MS = 50
const TOTAL_TEETH = 20

// Simple tooth SVG
function Tooth({ color, isGolden, caught, y, lane }) {
  return (
    <div
      className={`rhythm-tooth ${isGolden ? 'golden-tooth' : ''} ${caught ? 'caught-tooth' : ''}`}
      style={{
        position: 'absolute',
        top: `${y}%`,
        left: '50%',
        transform: 'translateX(-50%)',
        background: isGolden ? 'linear-gradient(135deg, #ffd700, #ffec6e)' : color,
        width: isGolden ? 48 : 38,
        height: isGolden ? 54 : 44,
        borderRadius: '40% 40% 30% 30% / 30% 30% 40% 40%',
        border: `3px solid ${isGolden ? '#d4a000' : 'rgba(0,0,0,0.2)'}`,
        boxShadow: isGolden ? '0 0 16px rgba(255,215,0,0.8)' : '0 3px 8px rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isGolden ? '1.4rem' : '1.1rem',
        zIndex: 20,
        transition: caught ? 'transform 0.2s, opacity 0.2s' : 'none',
        opacity: caught ? 0 : 1,
        transform: caught ? 'translateX(-50%) scale(1.4)' : 'translateX(-50%)',
      }}
    >
      {isGolden ? '⭐' : '🦷'}
    </div>
  )
}

export default function TeethRhythmGame({ onComplete, onCancel }) {
  const [gamePhase, setGamePhase] = useState('intro') // intro|playing|win|fail
  const [displayTeeth, setDisplayTeeth] = useState([])
  const [caught, setCaught] = useState(0)
  const [lives, setLives] = useState(3)
  const [speed, setSpeed] = useState(1.0)
  const [goldenBurst, setGoldenBurst] = useState(false)
  const [tapFlash, setTapFlash] = useState(null) // lane index

  // All mutable game state in a single ref to avoid stale closures
  const G = useRef({
    teeth: [],
    spawned: 0,
    caught: 0,
    lives: 3,
    speed: 1.0,
    goldenDone: false,
    playing: false,
  })

  const startGame = useCallback(() => {
    const g = G.current
    g.teeth = []
    g.spawned = 0
    g.caught = 0
    g.lives = 3
    g.speed = 1.0
    g.goldenDone = false
    g.playing = true
    setCaught(0)
    setLives(3)
    setSpeed(1.0)
    setDisplayTeeth([])
    setGoldenBurst(false)
    setGamePhase('playing')
  }, [])

  // Movement loop
  useEffect(() => {
    if (gamePhase !== 'playing') return
    const g = G.current

    const id = setInterval(() => {
      if (!g.playing) return
      const step = 1.4 * g.speed

      g.teeth = g.teeth.map(t => ({ ...t, y: t.y + step }))

      // Miss detection: teeth that passed exit without being caught
      const missed = g.teeth.filter(t => t.y > 100 && !t.caught)
      if (missed.length > 0) {
        g.lives = Math.max(0, g.lives - missed.length)
        setLives(g.lives)
        if (g.lives <= 0) {
          g.playing = false
          setGamePhase('fail')
          return
        }
      }
      g.teeth = g.teeth.filter(t => t.y <= 105)
      setDisplayTeeth([...g.teeth])
    }, FRAME_MS)

    return () => clearInterval(id)
  }, [gamePhase])

  // Spawn loop (recursive setTimeout for speed-adaptive timing)
  useEffect(() => {
    if (gamePhase !== 'playing') return
    const g = G.current
    let active = true

    const spawnNext = () => {
      if (!active || !g.playing || g.spawned >= TOTAL_TEETH) return

      const isGolden = !g.goldenDone && g.spawned >= 8 && Math.random() < 0.22
      const tooth = {
        id: Date.now() + Math.random(),
        lane: Math.floor(Math.random() * 4),
        y: -10,
        color: isGolden ? '#ffd700' : TOOTH_COLORS[Math.floor(Math.random() * TOOTH_COLORS.length)],
        isGolden,
        caught: false,
      }

      if (isGolden) {
        g.goldenDone = true
        g.speed = Math.min(g.speed + 0.6, 4.5)
        setSpeed(g.speed)
        setGoldenBurst(true)
        setTimeout(() => setGoldenBurst(false), 1800)
      }

      g.teeth.push(tooth)
      g.spawned++
      setDisplayTeeth([...g.teeth])

      const base = 1300 / g.speed
      const jitter = (Math.random() - 0.5) * 300
      setTimeout(spawnNext, Math.max(400, base + jitter))
    }

    setTimeout(spawnNext, 900)
    return () => { active = false }
  }, [gamePhase])

  const tapLane = (lane) => {
    const g = G.current
    if (!g.playing) return

    setTapFlash(lane)
    setTimeout(() => setTapFlash(null), 150)

    // Hittable = in this lane, in hit zone, not yet caught
    const hittable = g.teeth
      .filter(t => t.lane === lane && !t.caught && t.y >= HIT_Y_MIN && t.y <= HIT_Y_MAX)
      .sort((a, b) => b.y - a.y)

    if (hittable.length === 0) return

    const tooth = hittable[0]
    g.teeth = g.teeth.map(t => t.id === tooth.id ? { ...t, caught: true } : t)
    g.caught++
    setCaught(g.caught)

    // Speed bump every 4 non-golden catches
    if (!tooth.isGolden && g.caught % 4 === 0) {
      g.speed = Math.min(g.speed + 0.25, 4.5)
      setSpeed(g.speed)
    }

    setDisplayTeeth([...g.teeth])

    if (g.caught >= TOTAL_TEETH) {
      g.playing = false
      setTimeout(() => setGamePhase('win'), 600)
    }
  }

  const LANE_COLORS = ['#3b82f6', '#a78bfa', '#10b981', '#f59e0b']
  const LANE_LABELS = ['💧', '🌊', '🪸', '✨']

  // ── Intro ──
  if (gamePhase === 'intro') {
    return (
      <div className="rhythm-screen">
        <div className="rhythm-intro">
          <div style={{ fontSize: '3rem' }}>🦷</div>
          <h2 className="rhythm-intro-title">The Falling Teeth!</h2>
          <p className="rhythm-intro-desc">
            Catch all <strong>20 teeth</strong> by tapping the right lane!<br />
            Speed increases every 4 catches.<br />
            Watch out for the <strong>✨ Golden Tooth</strong> — speed burst!<br />
            <span style={{ color: '#ef4444' }}>3 misses and you restart!</span>
          </p>
          <button className="btn-primary" onClick={startGame}>Start! 🦷</button>
          <button className="btn-quest" style={{ marginTop: 8 }} onClick={onCancel}>Back</button>
        </div>
      </div>
    )
  }

  // ── Win ──
  if (gamePhase === 'win') {
    return (
      <div className="rhythm-screen rhythm-win">
        <div className="rhythm-result-card">
          <div style={{ fontSize: '3.5rem' }}>🌟</div>
          <h2 className="rhythm-result-title" style={{ color: '#fbbf24' }}>Amazing! You caught all 20!</h2>
          <p style={{ color: '#fff', fontSize: '1.1rem' }}>Stone 3 is yours, {'{NAME}'}!</p>
          <button className="btn-primary" onClick={onComplete}>Collect Stone 3 →</button>
        </div>
      </div>
    )
  }

  // ── Fail ──
  if (gamePhase === 'fail') {
    return (
      <div className="rhythm-screen rhythm-fail">
        <div className="rhythm-result-card">
          <div style={{ fontSize: '3rem' }}>😢</div>
          <h2 className="rhythm-result-title" style={{ color: '#fb923c' }}>3 Misses! Try again!</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>You caught {caught} / 20 teeth</p>
          <button className="btn-primary" onClick={startGame}>Try Again! 🦷</button>
          <button className="btn-quest" style={{ marginTop: 8 }} onClick={onCancel}>Back</button>
        </div>
      </div>
    )
  }

  // ── Playing ──
  return (
    <div className="rhythm-screen">
      {/* Golden burst flash */}
      {goldenBurst && <div className="golden-burst">✨ SPEED BURST! ✨</div>}

      {/* HUD */}
      <div className="rhythm-hud">
        <div className="rhythm-lives">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
        <div className="rhythm-score">{caught} / {TOTAL_TEETH} 🦷</div>
        <div className="rhythm-speed">Speed: {speed.toFixed(1)}x</div>
      </div>

      {/* 4 lanes */}
      <div className="rhythm-lanes">
        {[0, 1, 2, 3].map(lane => (
          <div
            key={lane}
            className={`rhythm-lane ${tapFlash === lane ? 'lane-flash' : ''}`}
            style={{ borderColor: LANE_COLORS[lane] }}
            onClick={() => tapLane(lane)}
          >
            {/* falling teeth in this lane */}
            {displayTeeth.filter(t => t.lane === lane).map(tooth => (
              <Tooth key={tooth.id} {...tooth} />
            ))}
            {/* hit zone */}
            <div className="rhythm-hit-zone" style={{ borderColor: LANE_COLORS[lane] }} />
            {/* tap button at bottom */}
            <div className="rhythm-tap-btn" style={{ background: LANE_COLORS[lane] }}>
              {LANE_LABELS[lane]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
