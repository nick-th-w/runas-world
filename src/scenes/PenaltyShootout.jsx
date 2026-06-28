import { useState, useEffect } from 'react'
import { CHARACTERS } from '../characters'
import allQuestions from '../data/penalty.json'

const DIRS = ['left', 'centre', 'right']

function pickRandom(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

// ── Evil Black Bunny ──────────────────────────────────────────────────────────

function EvilBunny({ kicking }) {
  return (
    <svg viewBox="0 0 90 110" width="90" height="110"
      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))',
               transform: kicking ? 'rotate(-8deg) translateY(-8px)' : 'none',
               transition: 'transform 0.15s' }}>
      {/* ears */}
      <ellipse cx="30" cy="20" rx="9" ry="22" fill="#111" />
      <ellipse cx="60" cy="20" rx="9" ry="22" fill="#111" />
      <ellipse cx="30" cy="20" rx="5" ry="14" fill="#2d0010" />
      <ellipse cx="60" cy="20" rx="5" ry="14" fill="#2d0010" />
      {/* body */}
      <ellipse cx="45" cy="78" rx="26" ry="30" fill="#111" />
      {/* football kit stripes */}
      <rect x="26" y="68" width="38" height="5" rx="2" fill="#222" />
      <rect x="26" y="78" width="38" height="5" rx="2" fill="#222" />
      {/* head */}
      <circle cx="45" cy="44" r="22" fill="#111" />
      {/* evil red eyes */}
      <circle cx="36" cy="40" r="5" fill="#cc0000" />
      <circle cx="54" cy="40" r="5" fill="#cc0000" />
      <circle cx="37" cy="39" r="2" fill="#fff" />
      <circle cx="55" cy="39" r="2" fill="#fff" />
      <circle cx="37.5" cy="39.5" r="1" fill="#000" />
      <circle cx="55.5" cy="39.5" r="1" fill="#000" />
      {/* evil grin */}
      <path d="M32,52 Q45,62 58,52" stroke="#cc0000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* teeth */}
      <rect x="40" y="52" width="5" height="6" rx="1" fill="#fff" />
      <rect x="46" y="52" width="5" height="6" rx="1" fill="#fff" />
      {/* kicking foot */}
      <ellipse cx={kicking ? 65 : 32} cy={kicking ? 98 : 105} rx="10" ry="7" fill="#111"
        style={{ transition: 'cx 0.15s, cy 0.15s' }} />
      <ellipse cx="60" cy="105" rx="10" ry="7" fill="#111" />
    </svg>
  )
}

// ── Pitch + Goal background ───────────────────────────────────────────────────

function PitchScene() {
  return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
      viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a1a" />
          <stop offset="100%" stopColor="#0d2b0d" />
        </linearGradient>
      </defs>
      {/* night sky / pitch */}
      <rect width="800" height="520" fill="url(#skyGrad)" />
      {/* pitch stripes */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <rect key={i} x={i*100} width="100" height="520"
          fill={i%2===0 ? '#1a5c1a' : '#1e6b1e'} opacity="0.8" />
      ))}
      {/* penalty area */}
      <rect x="180" y="60" width="440" height="230" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.4" />
      {/* goal area (6-yard box) */}
      <rect x="300" y="60" width="200" height="80" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
      {/* penalty spot */}
      <circle cx="400" cy="340" r="5" fill="#fff" opacity="0.7" />
      {/* penalty arc */}
      <path d="M290,285 A120,120 0 0,1 510,285" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
      {/* crowd dots in background */}
      {[...Array(40)].map((_, i) => (
        <circle key={i}
          cx={20 + (i % 20) * 40}
          cy={8 + Math.floor(i / 20) * 14}
          r="5"
          fill={['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6'][i%5]}
          opacity="0.5" />
      ))}
      {/* stars in sky */}
      {[[50,30],[750,25],[150,20],[650,35],[400,15],[250,28],[580,22]].map(([x,y],i) => (
        <text key={i} x={x} y={y} fontSize="10" fill="#fff" opacity="0.6">✦</text>
      ))}
    </svg>
  )
}

function GoalSVG() {
  return (
    <svg viewBox="0 0 500 160" preserveAspectRatio="none"
      style={{ width:'72%', height:'auto', position:'absolute', top:'2%', left:'50%', transform:'translateX(-50%)' }}>
      {/* net grid */}
      {[1,2,3,4,5,6,7,8].map(i => (
        <line key={`v${i}`} x1={50+i*47} y1="12" x2={50+i*47} y2="148" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      ))}
      {[1,2,3,4].map(i => (
        <line key={`h${i}`} x1="52" y1={12+i*34} x2="448" y2={12+i*34} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      ))}
      {/* posts */}
      <rect x="38" y="10" width="14" height="145" fill="white" rx="4" />
      <rect x="448" y="10" width="14" height="145" fill="white" rx="4" />
      {/* crossbar */}
      <rect x="38" y="8" width="426" height="14" fill="white" rx="4" />
      {/* goal line */}
      <rect x="38" y="150" width="426" height="6" fill="rgba(255,255,255,0.5)" />
    </svg>
  )
}

// ── Shot indicators ───────────────────────────────────────────────────────────

function ShotIndicators({ results, total = 5 }) {
  return (
    <div className="shot-indicators">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`shot-dot ${
          i < results.length ? (results[i] ? 'saved' : 'goal') : 'pending'
        }`}>
          {i < results.length ? (results[i] ? '🧤' : '⚽') : '○'}
        </div>
      ))}
    </div>
  )
}

// ── Sticker Art ───────────────────────────────────────────────────────────────

function GoldenGloves({ size = 70 }) {
  return (
    <svg viewBox="0 0 100 60" width={size * 1.6} height={size}>
      {/* left glove */}
      <g transform="translate(5,5)">
        <ellipse cx="22" cy="30" rx="20" ry="24" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        <rect x="4" y="20" width="36" height="14" rx="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <rect x="8" y="46" width="28" height="8" rx="3" fill="#16a34a" stroke="#166534" strokeWidth="1.5" />
        {/* thumb */}
        <ellipse cx="5" cy="18" rx="6" ry="10" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        {/* G */}
        <text x="14" y="38" fontSize="14" fill="#d97706" fontWeight="bold">G</text>
      </g>
      {/* right glove (mirrored) */}
      <g transform="translate(95,5) scale(-1,1)">
        <ellipse cx="22" cy="30" rx="20" ry="24" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        <rect x="4" y="20" width="36" height="14" rx="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <rect x="8" y="46" width="28" height="8" rx="3" fill="#16a34a" stroke="#166534" strokeWidth="1.5" />
        <ellipse cx="5" cy="18" rx="6" ry="10" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        <text x="14" y="38" fontSize="14" fill="#d97706" fontWeight="bold">G</text>
      </g>
    </svg>
  )
}

function GoldTrophySticker({ size = 70 }) {
  return (
    <svg viewBox="0 0 60 80" width={size * 0.75} height={size}>
      {/* handles */}
      <path d="M14,28 Q4,28 4,40 Q4,52 14,52" fill="none" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
      <path d="M46,28 Q56,28 56,40 Q56,52 46,52" fill="none" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
      {/* cup */}
      <path d="M14,20 L14,55 Q30,65 46,55 L46,20 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
      {/* shine */}
      <path d="M20,25 Q24,22 28,25" stroke="#fef08a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* stem */}
      <rect x="25" y="63" width="10" height="10" rx="2" fill="#d97706" />
      {/* base */}
      <rect x="18" y="72" width="24" height="6" rx="3" fill="#d97706" />
      {/* star on top */}
      <text x="30" y="18" textAnchor="middle" fontSize="16">⭐</text>
      {/* stars inside cup */}
      <text x="30" y="48" textAnchor="middle" fontSize="12">✨</text>
    </svg>
  )
}

// ── Inner game logic ──────────────────────────────────────────────────────────

function PenaltyGame({ player, onComplete, addReward, onRetry }) {
  const [qs] = useState(() => pickRandom(allQuestions, 5))
  const [idx, setIdx] = useState(0)
  const [results, setResults] = useState([])
  const [phase, setPhase] = useState('intro') // intro|question|animating|result|end
  const [keeperDir, setKeeperDir] = useState('centre')
  const [ballDir, setBallDir] = useState(null)
  const [lastSave, setLastSave] = useState(null)
  const [rewardsDone, setRewardsDone] = useState(false)

  const { Component } = CHARACTERS[player.character]
  const saves = results.filter(Boolean).length

  // Award rewards once on reaching end
  useEffect(() => {
    if (phase === 'end' && !rewardsDone) {
      setRewardsDone(true)
      if (saves >= 4) addReward('goldenGloves')
      if (saves === 5) addReward('goldTrophy')
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (choiceIdx) => {
    if (phase !== 'question') return
    const q = qs[idx]
    const correct = choiceIdx === q.correct
    setBallDir(DIRS[q.correct])
    setKeeperDir(DIRS[choiceIdx])
    setLastSave(correct)
    setPhase('animating')

    setTimeout(() => {
      const newResults = [...results, correct]
      setResults(newResults)
      setPhase('result')
      setTimeout(() => {
        if (idx + 1 >= 5) {
          setPhase('end')
        } else {
          setIdx(i => i + 1)
          setKeeperDir('centre')
          setBallDir(null)
          setLastSave(null)
          setPhase('question')
        }
      }, 1800)
    }, 1200)
  }

  const q = qs[idx]
  const isAnimating = phase === 'animating' || phase === 'result'

  // ── End screen ──
  if (phase === 'end') {
    const perfect = saves === 5
    const won = saves >= 4
    return (
      <div className="penalty-screen penalty-end">
        <PitchScene />
        <div className="penalty-end-content">
          {perfect && <div className="penalty-fireworks">🎆🎇🎆</div>}
          <h1 className="penalty-end-title" style={{ color: perfect ? '#fbbf24' : won ? '#4ade80' : '#fb923c' }}>
            {perfect ? '🏆 PERFECT! 5/5!' : won ? '🎉 CHAMPION! 4/5!' : `Almost! ${saves}/5`}
          </h1>
          <ShotIndicators results={results} />
          {won && (
            <div className="penalty-rewards">
              <div className="reward-pop">
                <GoldenGloves size={80} />
                <p className="reward-label">Golden Gloves unlocked!</p>
              </div>
              {perfect && (
                <div className="reward-pop" style={{ animationDelay: '0.3s' }}>
                  <GoldTrophySticker size={80} />
                  <p className="reward-label">Gold Trophy unlocked!</p>
                </div>
              )}
            </div>
          )}
          {!won && (
            <p className="penalty-end-msg">You need 4 saves to win. Keep practising!</p>
          )}
          <div className="penalty-end-btns">
            <button className="btn-quest" onClick={onRetry}>Play again 🔄</button>
            <button className="btn-primary" onClick={onComplete}>Back to Map →</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="penalty-screen">
      <PitchScene />
      <GoalSVG />

      {/* Keeper */}
      <div className={`keeper-wrap ${isAnimating ? `dive-${keeperDir}` : ''}`}>
        <Component size={64} hasCrown={false} />
        {phase === 'result' && lastSave && (
          <div className="save-burst">🧤</div>
        )}
      </div>

      {/* Ball */}
      {(ballDir || phase === 'question' || phase === 'intro') && (
        <div className={`penalty-ball ${ballDir ? `fly-${ballDir}` : ''}`} />
      )}

      {/* Shot result flash */}
      {phase === 'result' && (
        <div className={`shot-result-flash ${lastSave ? 'save' : 'goal'}`}>
          {lastSave ? '🧤 SAVE!' : '⚽ GOAL!'}
        </div>
      )}

      {/* Score + shot number */}
      <div className="penalty-hud">
        <ShotIndicators results={results} />
        {phase !== 'intro' && phase !== 'end' && (
          <div className="penalty-shot-label">Shot {idx + 1} of 5</div>
        )}
      </div>

      {/* Bunny */}
      <div className={`bunny-wrap ${isAnimating ? 'kicking' : ''}`}>
        <EvilBunny kicking={isAnimating} />
      </div>

      {/* Intro overlay */}
      {phase === 'intro' && (
        <div className="penalty-intro">
          <h2 className="penalty-intro-title">⚽ Penalty Shootout!</h2>
          <p className="penalty-intro-desc">
            Tap the button with the <strong>correct answer</strong><br />
            to make the keeper dive the right way!
          </p>
          <p className="penalty-intro-sub">Save 4 to win · Save all 5 for the trophy 🏆</p>
          <button className="btn-primary" onClick={() => setPhase('question')}>
            Ready! Let&apos;s go!
          </button>
        </div>
      )}

      {/* Question + answer buttons */}
      {phase === 'question' && (
        <div className="penalty-question-area">
          <div className="penalty-question-bubble">
            <span className="penalty-q-num">Q{idx + 1}</span>
            {q.q}
          </div>
          <div className="penalty-answer-row">
            {q.choices.map((choice, i) => (
              <button
                key={i}
                className={`penalty-answer-btn ${['btn-left','btn-centre','btn-right'][i]}`}
                onClick={() => handleAnswer(i)}
              >
                <span className="btn-dir-label">{['← LEFT', 'CENTRE', 'RIGHT →'][i]}</span>
                <span className="btn-answer-text">{choice}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Wrapper (manages retry key) ───────────────────────────────────────────────

export default function PenaltyShootout({ player, quest, onComplete, addReward }) {
  const [gameKey, setGameKey] = useState(0)
  return (
    <PenaltyGame
      key={gameKey}
      player={player}
      quest={quest}
      onComplete={onComplete}
      addReward={addReward}
      onRetry={() => setGameKey(k => k + 1)}
    />
  )
}
