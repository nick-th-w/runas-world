import { useState, useEffect, useRef } from 'react'
import { CHARACTERS } from '../characters'
import allQuestions from '../data/penalty.json'

const DIRS = ['left', 'centre', 'right']

// No-repeat: pick 5 questions not used last session
function pickQuestions() {
  const lastUsed = new Set(JSON.parse(sessionStorage.getItem('runas-penalty-last') || '[]'))
  const available = allQuestions.map((_, i) => i).filter(i => !lastUsed.has(i))
  const pool = available.length >= 5 ? available : allQuestions.map((_, i) => i)
  const chosen = [...pool].sort(() => Math.random() - 0.5).slice(0, 5)
  sessionStorage.setItem('runas-penalty-last', JSON.stringify(chosen))
  return chosen.map(i => allQuestions[i])
}

// ── Evil Black Bunny ──────────────────────────────────────────────────────────

function EvilBunny({ kicking }) {
  return (
    <svg viewBox="0 0 90 110" width="90" height="110"
      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))',
               transform: kicking ? 'rotate(-8deg) translateY(-8px)' : 'none',
               transition: 'transform 0.15s' }}>
      <ellipse cx="30" cy="20" rx="9" ry="22" fill="#111" />
      <ellipse cx="60" cy="20" rx="9" ry="22" fill="#111" />
      <ellipse cx="30" cy="20" rx="5" ry="14" fill="#2d0010" />
      <ellipse cx="60" cy="20" rx="5" ry="14" fill="#2d0010" />
      <ellipse cx="45" cy="78" rx="26" ry="30" fill="#111" />
      <rect x="26" y="68" width="38" height="5" rx="2" fill="#222" />
      <rect x="26" y="78" width="38" height="5" rx="2" fill="#222" />
      <circle cx="45" cy="44" r="22" fill="#111" />
      <circle cx="36" cy="40" r="5" fill="#cc0000" />
      <circle cx="54" cy="40" r="5" fill="#cc0000" />
      <circle cx="37" cy="39" r="2" fill="#fff" />
      <circle cx="55" cy="39" r="2" fill="#fff" />
      <circle cx="37.5" cy="39.5" r="1" fill="#000" />
      <circle cx="55.5" cy="39.5" r="1" fill="#000" />
      <path d="M32,52 Q45,62 58,52" stroke="#cc0000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="40" y="52" width="5" height="6" rx="1" fill="#fff" />
      <rect x="46" y="52" width="5" height="6" rx="1" fill="#fff" />
      <ellipse cx={kicking ? 65 : 32} cy={kicking ? 98 : 105} rx="10" ry="7" fill="#111"
        style={{ transition: 'cx 0.15s, cy 0.15s' }} />
      <ellipse cx="60" cy="105" rx="10" ry="7" fill="#111" />
    </svg>
  )
}

// ── Forest Pitch background ───────────────────────────────────────────────────

function ForestPitchScene() {
  return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
      viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="fpSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a2010" />
          <stop offset="60%" stopColor="#1a5c1a" />
          <stop offset="100%" stopColor="#0d3b0d" />
        </linearGradient>
      </defs>
      {/* Forest sky/ground */}
      <rect width="800" height="520" fill="url(#fpSky)" />
      {/* Background trees */}
      {[[50,280],[120,300],[200,270],[310,290],[480,275],[590,285],[680,270],[760,295]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x="-7" y="60" width="14" height="70" rx="4" fill="#2d1a00" />
          <polygon points="0,-70 -38,60 38,60" fill={i%2===0?'#0d4a0d':'#0f5a0f'} />
          <polygon points="0,-40 -28,40 28,40" fill={i%2===0?'#166534':'#15803d'} />
        </g>
      ))}
      {/* Ground */}
      <path d="M0,380 Q400,360 800,380 L800,520 L0,520 Z" fill="#0d3b0d" />
      <path d="M0,400 Q400,380 800,400 L800,520 L0,520 Z" fill="#0f4a0f" />
      {/* Vines */}
      {[280,320,360,480].map((x) => (
        <path key={x} d={`M${x},0 Q${x+12},80 ${x},160`}
          stroke="#15803d" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round" />
      ))}
      {/* Stars */}
      {[[60,30],[740,25],[160,18],[640,32],[400,12],[260,26],[580,20]].map(([x,y],i) => (
        <text key={i} x={x} y={y} fontSize="10" fill="#fff" opacity="0.5">✦</text>
      ))}
      {/* Pitch lines */}
      <rect x="180" y="65" width="440" height="230" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.45" />
      <rect x="300" y="65" width="200" height="78" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
      <circle cx="400" cy="338" r="5" fill="#fff" opacity="0.7" />
      <path d="M290,295 A120,120 0 0,1 510,295" fill="none" stroke="#fff" strokeWidth="2" opacity="0.35" />
    </svg>
  )
}

function GoalSVG() {
  return (
    <svg viewBox="0 0 500 160" preserveAspectRatio="none"
      style={{ width:'72%', height:'auto', position:'absolute', top:'2%', left:'50%', transform:'translateX(-50%)' }}>
      {[1,2,3,4,5,6,7,8].map(i => (
        <line key={`v${i}`} x1={50+i*47} y1="12" x2={50+i*47} y2="148" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      ))}
      {[1,2,3,4].map(i => (
        <line key={`h${i}`} x1="52" y1={12+i*34} x2="448" y2={12+i*34} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      ))}
      <rect x="38" y="10" width="14" height="145" fill="white" rx="4" />
      <rect x="448" y="10" width="14" height="145" fill="white" rx="4" />
      <rect x="38" y="8" width="426" height="14" fill="white" rx="4" />
      <rect x="38" y="150" width="426" height="6" fill="rgba(255,255,255,0.5)" />
    </svg>
  )
}

// ── Scoreboard (persistent throughout game) ───────────────────────────────────

function Scoreboard({ results, totalShots = 5, shotIdx }) {
  const saves = results.filter(Boolean).length
  const goals = results.filter(b => !b).length
  return (
    <div className="penalty-scoreboard">
      <div className="scoreboard-inner">
        <div className="scoreboard-team">
          <span className="scoreboard-label">SAVES</span>
          <span className="scoreboard-number saves-num">{saves}</span>
        </div>
        <div className="scoreboard-divider">
          <span className="scoreboard-shot-count">{results.length}/{totalShots}</span>
        </div>
        <div className="scoreboard-team">
          <span className="scoreboard-label">GOALS</span>
          <span className="scoreboard-number goals-num">{goals}</span>
        </div>
      </div>
      <div className="scoreboard-dots">
        {Array.from({ length: totalShots }, (_, i) => (
          <span key={i} className={`sdot ${
            i < results.length ? (results[i] ? 'sdot-save' : 'sdot-goal') : 'sdot-pending'
          }`}>
            {i < results.length ? (results[i] ? '🧤' : '⚽') : '○'}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Shot result card (big popup per shot) ─────────────────────────────────────

function ShotResultCard({ isSave, results }) {
  const saves = results.filter(Boolean).length
  const goals = results.filter(b => !b).length
  return (
    <div className="shot-result-card">
      <div className={`result-card-inner ${isSave ? 'card-save' : 'card-goal'}`}>
        <div className="result-card-emoji">{isSave ? '🧤' : '⚽'}</div>
        <div className="result-card-word">{isSave ? 'SAVE!' : 'GOAL!'}</div>
        <div className="result-card-score">{saves} saves · {goals} goals</div>
      </div>
    </div>
  )
}

// ── Reward art (reused from StickerBook) ─────────────────────────────────────

function GoldenGloves({ size = 70 }) {
  return (
    <svg viewBox="0 0 100 60" width={size * 1.6} height={size}>
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

function GoldTrophy({ size = 70 }) {
  return (
    <svg viewBox="0 0 60 80" width={size * 0.75} height={size}>
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

// ── Inner game ────────────────────────────────────────────────────────────────

function PenaltyGame({ player, onComplete, addReward, onRetry }) {
  const [qs] = useState(pickQuestions)
  const [idx, setIdx] = useState(0)
  const [results, setResults] = useState([])
  const [phase, setPhase] = useState('intro')
  const [keeperDir, setKeeperDir] = useState('centre')
  const [ballClass, setBallClass] = useState(null) // e.g. 'fly-left' or 'snap-right'
  const [lastSave, setLastSave] = useState(null)
  const [answerResult, setAnswerResult] = useState(null) // { chosen, correct } for colour feedback
  const [rewardsDone, setRewardsDone] = useState(false)

  const { Component } = CHARACTERS[player.character]
  const isAnimating = phase === 'animating' || phase === 'result'
  const q = qs[idx]

  useEffect(() => {
    if (phase === 'end' && !rewardsDone) {
      setRewardsDone(true)
      const saves = results.filter(Boolean).length
      if (saves >= 4) addReward('goldenGloves')
      if (saves === 5) addReward('goldTrophy')
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (choiceIdx) => {
    if (phase !== 'question') return
    const correct = choiceIdx === q.correct
    const keepDir = DIRS[choiceIdx]
    const ballDir = DIRS[q.correct]

    // Show colour feedback immediately on buttons
    setAnswerResult({ chosen: choiceIdx, correct: q.correct })

    setTimeout(() => {
      // Ball: snap to keeper (save) or fly to goal (goal)
      setBallClass(correct ? `snap-${keepDir}` : `fly-${ballDir}`)
      setKeeperDir(keepDir)
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
            setBallClass(null)
            setLastSave(null)
            setAnswerResult(null)
            setPhase('question')
          }
        }, 2000)
      }, 1200)
    }, 400)
  }

  const saves = results.filter(Boolean).length

  // ── End screen ──
  if (phase === 'end') {
    const perfect = saves === 5
    const won = saves >= 4
    return (
      <div className="penalty-screen penalty-end">
        <ForestPitchScene />
        <div className="penalty-end-content">
          {perfect && <div className="penalty-fireworks">🎆🎇🎆</div>}
          <h1 className="penalty-end-title" style={{ color: perfect ? '#fbbf24' : won ? '#4ade80' : '#fb923c' }}>
            {perfect ? '🏆 PERFECT! 5/5!' : won ? '🎉 CHAMPION! 4/5!' : `Almost! ${saves}/5`}
          </h1>
          <Scoreboard results={results} shotIdx={4} />
          {won && (
            <div className="penalty-rewards">
              <div className="reward-pop">
                <GoldenGloves size={80} />
                <p className="reward-label">Golden Gloves unlocked!</p>
              </div>
              {perfect && (
                <div className="reward-pop" style={{ animationDelay: '0.3s' }}>
                  <GoldTrophy size={80} />
                  <p className="reward-label">Gold Trophy unlocked!</p>
                </div>
              )}
            </div>
          )}
          {!won && <p className="penalty-end-msg">You need 4 saves to win. Keep practising!</p>}
          <div className="penalty-end-btns">
            {saves < 5 && <button className="btn-quest" onClick={onRetry}>Play again 🔄</button>}
            <button className="btn-primary" onClick={onComplete}>Back to Map →</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="penalty-screen">
      <ForestPitchScene />
      <GoalSVG />

      {/* Persistent scoreboard at top */}
      {phase !== 'intro' && (
        <div style={{ position:'absolute', top:'2%', left:'50%', transform:'translateX(-50%)', zIndex:60 }}>
          <Scoreboard results={results} shotIdx={idx} />
        </div>
      )}

      {/* Keeper */}
      <div className={`keeper-wrap ${isAnimating ? `dive-${keeperDir}` : ''}`}>
        <Component size={64} hasCrown={false} />
        {phase === 'result' && lastSave && <div className="save-burst">🧤</div>}
      </div>

      {/* Ball */}
      {(ballClass || phase === 'question' || phase === 'intro') && (
        <div className={`penalty-ball ${ballClass || ''}`} />
      )}

      {/* Big save/goal result card */}
      {phase === 'result' && (
        <ShotResultCard isSave={lastSave} results={results} />
      )}

      {/* Shot label */}
      {phase === 'question' && (
        <div className="penalty-shot-label">Shot {idx + 1} of 5</div>
      )}

      {/* Bunny */}
      <div className={`bunny-wrap ${isAnimating ? 'kicking' : ''}`}>
        <EvilBunny kicking={isAnimating} />
      </div>

      {/* Intro */}
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
      {phase === 'question' || (phase !== 'animating' && phase !== 'result' && phase !== 'intro' && answerResult) ? (
        <div className="penalty-question-area">
          <div className="penalty-question-bubble">
            <span className="penalty-q-num">Q{idx + 1}</span>
            {q.q}
          </div>
          <div className="penalty-answer-row">
            {q.choices.map((choice, i) => {
              let colourClass = ''
              if (answerResult) {
                if (i === answerResult.correct) colourClass = 'btn-feedback-correct'
                else if (i === answerResult.chosen) colourClass = 'btn-feedback-wrong'
                else colourClass = 'btn-feedback-dim'
              }
              return (
                <button
                  key={i}
                  className={`penalty-answer-btn ${['btn-pa-left','btn-pa-centre','btn-pa-right'][i]} ${colourClass}`}
                  onClick={() => handleAnswer(i)}
                  disabled={!!answerResult}
                >
                  <span className="btn-dir-label">{['← LEFT', 'CENTRE', 'RIGHT →'][i]}</span>
                  <span className="btn-answer-text">{choice}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

// ── Wrapper ───────────────────────────────────────────────────────────────────

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
