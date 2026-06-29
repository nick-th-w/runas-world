import { useState, useEffect, useRef } from 'react'
import puzzleDB from '../data/puzzles.json'

// ── Helpers ───────────────────────────────────────────────────────────────────

function pickRandom(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

function pickPuzzleTypes() {
  return [...['math', 'pattern', 'spelling', 'memory']].sort(() => Math.random() - 0.5).slice(0, 3)
}

// stars: 0 | 1 | 2  (per puzzle)
// medal: total across 3 puzzles (max 6 stars)
function calcMedal(scores) {
  const total = scores.reduce((a, b) => a + b, 0)
  if (total >= 5) return 'gold'
  if (total >= 3) return 'silver'
  if (total >= 1) return 'bronze'
  return null
}

// ── Shared UI ────────────────────────────────────────────────────────────────

function Timer({ seconds, running, onTimeout }) {
  const [left, setLeft] = useState(seconds)
  const fired = useRef(false)

  // Keep a ref to onTimeout so we never capture a stale closure
  const onTimeoutRef = useRef(onTimeout)
  onTimeoutRef.current = onTimeout

  useEffect(() => {
    fired.current = false
    setLeft(seconds)
  }, [seconds])

  // Decrement timer
  useEffect(() => {
    if (!running || left <= 0) return
    const id = setInterval(() => setLeft(p => Math.max(0, p - 1)), 1000)
    return () => clearInterval(id)
  }, [running, seconds]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fire timeout in its own effect so it never runs inside a setState call
  useEffect(() => {
    if (left <= 0 && running && !fired.current) {
      fired.current = true
      onTimeoutRef.current()
    }
  }, [left, running])

  const pct = (left / seconds) * 100
  const color = pct > 60 ? '#4ade80' : pct > 25 ? '#fb923c' : '#ef4444'

  return (
    <div className="timer-wrap">
      <div className="timer-bar">
        <div className="timer-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="timer-num" style={{ color }}>{left}s</span>
    </div>
  )
}

function PuzzleHeader({ title, qi, total, score }) {
  return (
    <div className="puzzle-header">
      <span className="puzzle-title">{title}</span>
      <div className="puzzle-progress">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`pdot ${i < qi ? 'done' : i === qi ? 'active' : ''}`} />
        ))}
      </div>
      <span className="puzzle-score">⭐ {score}/{total}</span>
    </div>
  )
}

function MedalIcon({ medal, size = 64 }) {
  const cfg = {
    gold:   { fill: '#fbbf24', stroke: '#d97706', label: '🥇' },
    silver: { fill: '#cbd5e1', stroke: '#94a3b8', label: '🥈' },
    bronze: { fill: '#d97706', stroke: '#92400e', label: '🥉' },
  }
  if (!medal) return null
  const { fill, stroke, label } = cfg[medal]
  return (
    <svg viewBox="0 0 60 72" width={size} height={size * 1.2}>
      <line x1="30" y1="0" x2="30" y2="20" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <circle cx="30" cy="46" r="24" fill={fill} stroke={stroke} strokeWidth="3" />
      <text x="30" y="54" textAnchor="middle" fontSize="22">{label}</text>
    </svg>
  )
}

// ── Math Puzzle ───────────────────────────────────────────────────────────────

function MathPuzzle({ data, onComplete }) {
  const { timePerQuestion, questions } = data
  const [qs] = useState(() => pickRandom(questions, 3))
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [started, setStarted] = useState(false)
  const [result, setResult] = useState(null) // null | 'correct' | 'wrong'
  const busy = useRef(false)

  const q = qs[qi]

  const finish = (finalScore) => {
    const stars = finalScore === 3 ? 2 : finalScore >= 2 ? 1 : 0
    onComplete(stars)
  }

  const advance = (newScore) => {
    const next = qi + 1
    if (next >= qs.length) {
      setTimeout(() => finish(newScore), 700)
    } else {
      setTimeout(() => { setQi(next); setResult(null); busy.current = false }, 700)
    }
  }

  const choose = (choice) => {
    if (busy.current || result) return
    busy.current = true
    const correct = choice === q.answer
    const newScore = correct ? score + 1 : score
    setScore(newScore)
    setResult(correct ? 'correct' : 'wrong')
    advance(newScore)
  }

  const handleTimeout = () => {
    if (busy.current || result) return
    busy.current = true
    setResult('wrong')
    advance(score)
  }

  if (!started) {
    return (
      <div className="puzzle-screen">
        <div className="puzzle-start">
          <div style={{ fontSize: '3rem' }}>🔢</div>
          <h2 className="puzzle-start-title">Maths Challenge!</h2>
          <p className="puzzle-start-desc">3 questions · {timePerQuestion} seconds each<br />How many can you get right?</p>
          <button className="btn-primary" onClick={() => setStarted(true)}>Start!</button>
        </div>
      </div>
    )
  }

  return (
    <div className="puzzle-screen">
      <PuzzleHeader title="🔢 Maths" qi={qi} total={3} score={score} />
      <Timer key={`math-${qi}`} seconds={timePerQuestion} running={!result} onTimeout={handleTimeout} />
      <div className="math-question">
        {q.a} {q.op} {q.b} = <span className="math-unknown">?</span>
      </div>
      <div className="choice-grid">
        {q.choices.map((c) => (
          <button
            key={c}
            className={`choice-btn ${result ? (c === q.answer ? 'correct' : result === 'wrong' && busy.current ? 'dim' : '') : ''}`}
            onClick={() => choose(c)}
            disabled={!!result}
          >
            {c}
          </button>
        ))}
      </div>
      {result && (
        <div className={`result-flash ${result}`}>
          {result === 'correct' ? '✓ Correct!' : '✗ Not quite!'}
        </div>
      )}
    </div>
  )
}

// ── Pattern Puzzle ────────────────────────────────────────────────────────────

const COLOR_MAP = {
  red: '#ef4444', blue: '#60a5fa', green: '#4ade80',
  yellow: '#fde047', pink: '#f472b6', purple: '#a78bfa',
  orange: '#fb923c', white: '#f9fafb',
}

function ColorDot({ color, size = 44, border = true }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: COLOR_MAP[color] || color,
      border: border ? '2.5px solid rgba(0,0,0,0.18)' : 'none',
      flexShrink: 0,
    }} />
  )
}

function PatternPuzzle({ data, onComplete }) {
  const { timePerQuestion, questions } = data
  const [qs] = useState(() => pickRandom(questions, 3))
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [started, setStarted] = useState(false)
  const [result, setResult] = useState(null)
  const [dualAnsweredStep, setDualAnsweredStep] = useState(-1)
  const [dualRowResults, setDualRowResults] = useState([])
  const busy = useRef(false)

  const q = qs[qi]
  const isDual = q?.type === 'dual'

  const finish = (s) => onComplete(s === 3 ? 2 : s >= 2 ? 1 : 0)

  const advanceQ = (newScore) => {
    const next = qi + 1
    if (next >= qs.length) setTimeout(() => finish(newScore), 700)
    else setTimeout(() => {
      setQi(next); setResult(null)
      setDualAnsweredStep(-1); setDualRowResults([])
      busy.current = false
    }, 700)
  }

  const choose = (choice) => {
    if (busy.current || result) return

    if (isDual) {
      const stepAnswering = dualAnsweredStep + 1
      const currentRow = q.rows[stepAnswering]
      const isCorrect = choice === currentRow.answer

      if (stepAnswering === 0) {
        setDualAnsweredStep(0)
        setDualRowResults([isCorrect ? 'correct' : 'wrong'])
      } else {
        busy.current = true
        const allResults = [...dualRowResults, isCorrect ? 'correct' : 'wrong']
        setDualRowResults(allResults)
        const allCorrect = allResults.every(r => r === 'correct')
        const newScore = allCorrect ? score + 1 : score
        setScore(newScore)
        setResult(allCorrect ? 'correct' : 'wrong')
        advanceQ(newScore)
      }
    } else {
      busy.current = true
      const correct = choice === q.answer
      const newScore = correct ? score + 1 : score
      setScore(newScore)
      setResult(correct ? 'correct' : 'wrong')
      advanceQ(newScore)
    }
  }

  const handleTimeout = () => {
    if (busy.current || result) return
    busy.current = true
    setResult('wrong')
    advanceQ(score)
  }

  if (!started) {
    return (
      <div className="puzzle-screen">
        <div className="puzzle-start">
          <div style={{ fontSize: '3rem' }}>🎨</div>
          <h2 className="puzzle-start-title">Pattern Puzzle!</h2>
          <p className="puzzle-start-desc">3 patterns · {timePerQuestion} seconds each<br />What colour comes next?</p>
          <button className="btn-primary" onClick={() => setStarted(true)}>Start!</button>
        </div>
      </div>
    )
  }

  const timerRunning = isDual ? (dualAnsweredStep < 1 && !result) : !result

  return (
    <div className="puzzle-screen">
      <PuzzleHeader title="🎨 Patterns" qi={qi} total={3} score={score} />
      <Timer key={`pat-${qi}`} seconds={timePerQuestion} running={timerRunning} onTimeout={handleTimeout} />

      {isDual ? (
        <>
          <p className="puzzle-question-text">What colours come next? (2 rows!)</p>
          <div className="dual-pattern-rows">
            {q.rows.map((row, rowIdx) => {
              const rowAnswered = rowIdx <= dualAnsweredStep
              const rowActive = !result && rowIdx === dualAnsweredStep + 1
              const rowResult = dualRowResults[rowIdx] || null
              return (
                <div key={rowIdx} className={`pattern-row${rowActive ? ' active-row' : rowAnswered ? ' answered-row' : ''}`}>
                  <div className="pattern-sequence" style={{ justifyContent: 'center' }}>
                    {row.items.map((c, i) => <ColorDot key={i} color={c} size={40} />)}
                    <div className={`pattern-question-mark${rowResult ? ` ${rowResult}` : ''}`}>
                      {rowAnswered ? (rowResult === 'correct' ? '✓' : '✗') : '?'}
                    </div>
                  </div>
                  {rowActive && <p className="dual-row-label">↑ Pick the next colour for Row {rowIdx + 1}</p>}
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <>
          <p className="puzzle-question-text">{q.question}</p>
          <div className="pattern-sequence">
            {q.items.map((c, i) => <ColorDot key={i} color={c} size={48} />)}
            <div className="pattern-question-mark">?</div>
          </div>
        </>
      )}

      <div className="pattern-choices">
        {q.choices.map((c) => {
          const isAnswer = isDual
            ? q.rows.some(r => r.answer === c)
            : c === q.answer
          return (
            <button
              key={c}
              className={`color-choice-btn ${result ? (isAnswer ? 'correct' : 'dim') : ''}`}
              onClick={() => choose(c)}
              disabled={!!result}
            >
              <ColorDot color={c} size={52} border={false} />
              <span className="color-label">{c}</span>
            </button>
          )
        })}
      </div>
      {result && <div className={`result-flash ${result}`}>{result === 'correct' ? '✓ Correct!' : '✗ Not quite!'}</div>}
    </div>
  )
}

// ── Spelling Puzzle ───────────────────────────────────────────────────────────

function SpellingPuzzle({ data, onComplete }) {
  const { timePerQuestion, questions } = data
  const [qs] = useState(() => pickRandom(questions, 3))
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [started, setStarted] = useState(false)
  const [result, setResult] = useState(null) // null | 'correct' | 'wrong'
  const busy = useRef(false)

  const q = qs[qi]
  const finish = (s) => onComplete(s === 3 ? 2 : s >= 2 ? 1 : 0)

  const choose = (choiceIdx) => {
    if (busy.current || result) return
    busy.current = true
    const correct = choiceIdx === q.correct
    const newScore = correct ? score + 1 : score
    setScore(newScore)
    setResult(correct ? 'correct' : 'wrong')
    const next = qi + 1
    if (next >= qs.length) setTimeout(() => finish(newScore), 900)
    else setTimeout(() => { setQi(next); setResult(null); busy.current = false }, 900)
  }

  const handleTimeout = () => {
    if (busy.current || result) return
    busy.current = true
    setResult('wrong')
    const next = qi + 1
    if (next >= qs.length) setTimeout(() => finish(score), 900)
    else setTimeout(() => { setQi(next); setResult(null); busy.current = false }, 900)
  }

  if (!started) {
    return (
      <div className="puzzle-screen">
        <div className="puzzle-start">
          <div style={{ fontSize: '3rem' }}>📝</div>
          <h2 className="puzzle-start-title">Spelling Challenge!</h2>
          <p className="puzzle-start-desc">3 spelling questions · {timePerQuestion} seconds each<br />Pick the correct spelling!</p>
          <button className="btn-primary" onClick={() => setStarted(true)}>Start!</button>
        </div>
      </div>
    )
  }

  return (
    <div className="puzzle-screen">
      <PuzzleHeader title="📝 Spelling" qi={qi} total={3} score={score} />
      <Timer key={`spell-${qi}`} seconds={timePerQuestion} running={!result} onTimeout={handleTimeout} />
      <div className="riddle-text">{q.question}</div>
      <div className="riddle-choices">
        {q.choices.map((c, i) => (
          <button
            key={i}
            className={`choice-btn riddle-btn ${result ? (i === q.correct ? 'correct' : 'dim') : ''}`}
            onClick={() => choose(i)}
            disabled={!!result}
          >
            {c}
          </button>
        ))}
      </div>
      {result && (
        <div className={`result-flash ${result}`}>
          {result === 'correct' ? '✓ Correct!' : `✗ It was: ${q.choices[q.correct]}`}
        </div>
      )}
    </div>
  )
}

// ── Memory Puzzle ─────────────────────────────────────────────────────────────

function MemoryPuzzle({ data, onComplete }) {
  const { timeLimit, goldFlips, silverFlips, pairs } = data
  const [cards] = useState(() =>
    [...pairs, ...pairs]
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5)
  )
  // Pre-compute a slight random tilt per card for the scattered-on-table look
  const [rotations] = useState(() =>
    Array.from({ length: pairs.length * 2 }, () => (Math.random() - 0.5) * 10)
  )
  const [cardState, setCardState] = useState(cards)
  const [selected, setSelected] = useState([])
  const [flipCount, setFlipCount] = useState(0)
  const [matchCount, setMatchCount] = useState(0)
  const [checking, setChecking] = useState(false)
  const [started, setStarted] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    if (matchCount === pairs.length && matchCount > 0 && !doneRef.current) {
      doneRef.current = true
      const stars = flipCount <= goldFlips ? 2 : flipCount <= silverFlips ? 1 : 1
      setTimeout(() => onComplete(stars), 600)
    }
  }, [matchCount]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTimeout = () => {
    if (!doneRef.current) {
      doneRef.current = true
      setTimedOut(true)
      setTimeout(() => onComplete(0), 1200)
    }
  }

  const flip = (card) => {
    if (checking || card.flipped || card.matched || !started || timedOut) return
    const newFlipCount = flipCount + 1
    setFlipCount(newFlipCount)
    setCardState((prev) => prev.map((c) => (c.id === card.id ? { ...c, flipped: true } : c)))

    const newSelected = [...selected, card.id]
    if (newSelected.length === 2) {
      setSelected([])
      setChecking(true)
      const [id1, id2] = newSelected
      const c1 = cardState.find((c) => c.id === id1)
      const c2 = card
      if (c1.emoji === c2.emoji) {
        setTimeout(() => {
          setCardState((prev) => prev.map((c) => ([id1, id2].includes(c.id) ? { ...c, matched: true } : c)))
          setMatchCount((m) => m + 1)
          setChecking(false)
        }, 500)
      } else {
        setTimeout(() => {
          setCardState((prev) => prev.map((c) => ([id1, id2].includes(c.id) ? { ...c, flipped: false } : c)))
          setChecking(false)
        }, 800)
      }
    } else {
      setSelected(newSelected)
    }
  }

  if (!started) {
    return (
      <div className="puzzle-screen">
        <div className="puzzle-start">
          <div style={{ fontSize: '3rem' }}>🃏</div>
          <h2 className="puzzle-start-title">Memory Match!</h2>
          <p className="puzzle-start-desc">Find all {pairs.length} pairs<br />{timeLimit} seconds · Fewer flips = better medal</p>
          <button className="btn-primary" onClick={() => setStarted(true)}>Start!</button>
        </div>
      </div>
    )
  }

  return (
    <div className="puzzle-screen">
      <div className="puzzle-header">
        <span className="puzzle-title">🃏 Memory Match</span>
        <span className="puzzle-score">✓ {matchCount}/{pairs.length} pairs</span>
        <span className="puzzle-score">👆 {flipCount} flips</span>
      </div>
      <Timer key="memory" seconds={timeLimit} running={!timedOut && matchCount < pairs.length} onTimeout={handleTimeout} />
      {timedOut && <div className="result-flash wrong">Time's up! Keep practising!</div>}
      <div className="memory-grid" style={{ gridTemplateColumns: `repeat(${Math.ceil(cardState.length / 2)}, 1fr)` }}>
        {cardState.map((card, idx) => (
          <button
            key={card.id}
            className={`memory-card ${card.flipped || card.matched ? 'face-up' : ''} ${card.matched ? 'matched' : ''}`}
            style={{ '--rot': `${rotations[idx]}deg` }}
            onClick={() => flip(card)}
            aria-label={card.flipped || card.matched ? card.emoji : 'Hidden card'}
          >
            <span className="card-back">★</span>
            <span className="card-front">{card.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Puzzle Result ─────────────────────────────────────────────────────────────

function PuzzleResult({ scores, onAccept, onRetry }) {
  const medal = calcMedal(scores)
  const total = scores.reduce((a, b) => a + b, 0)
  const messages = {
    gold:   ['🌟 Amazing!',    "You're a genius! Perfect score!"],
    silver: ['✨ Great job!',   "Really well done! Can you get gold?"],
    bronze: ['⭐ Good try!',    "Nice effort! Try again for a better medal!"],
    null:   ['💪 Keep going!', "Don't give up — you can do it!"],
  }
  const [title, body] = messages[medal] ?? messages.null

  return (
    <div className="puzzle-screen">
      <div className="puzzle-result">
        <MedalIcon medal={medal} size={90} />
        <h2 className="result-title">{title}</h2>
        <p className="result-body">{body}</p>
        <p className="result-score">Score: {total} / 6 stars</p>
        <div className="result-buttons">
          {medal !== 'gold' && (
            <button className="btn-quest" onClick={onRetry}>Try again for Gold! 🔄</button>
          )}
          <button className="btn-primary" onClick={() => onAccept(medal)}>
            {medal ? 'Collect medal →' : 'Continue anyway →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Puzzle Set (orchestrator) ─────────────────────────────────────────────────

const PUZZLE_COMPONENTS = { math: MathPuzzle, pattern: PatternPuzzle, spelling: SpellingPuzzle, memory: MemoryPuzzle }

export default function PuzzleSet({ chapterId = 1, questId = 'butterfly', onComplete }) {
  const pool = puzzleDB[`chapter${chapterId}`][questId]
  const [types, setTypes] = useState(() => pickPuzzleTypes())
  const [current, setCurrent] = useState(0) // 0-2 = puzzle index, 3 = results
  const [scores, setScores] = useState([])

  const handlePuzzleDone = (stars) => {
    const newScores = [...scores, stars]
    setScores(newScores)
    if (current >= 2) setCurrent(3)
    else setCurrent((c) => c + 1)
  }

  const retry = () => {
    setTypes(pickPuzzleTypes())
    setScores([])
    setCurrent(0)
  }

  if (current === 3) {
    return <PuzzleResult scores={scores} onAccept={onComplete} onRetry={retry} />
  }

  const type = types[current]
  const Component = PUZZLE_COMPONENTS[type]
  const typeData = pool[type]

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 150, background: 'rgba(253,246,227,0.97)', display:'flex', flexDirection:'column' }}>
      <div className="puzzle-progress-bar">
        Puzzle {current + 1} of 3 —{' '}
        {types.map((t, i) => (
          <span key={t} className={`type-dot ${i < current ? 'done' : i === current ? 'active' : ''}`}>
            {{ math: '🔢', pattern: '🎨', spelling: '📝', memory: '🃏' }[t]}
          </span>
        ))}
      </div>
      <Component key={`${type}-${current}`} data={typeData} onComplete={handlePuzzleDone} />
    </div>
  )
}
