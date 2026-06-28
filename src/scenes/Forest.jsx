import { useState } from 'react'
import DialogueBox from '../components/DialogueBox'
import { CHARACTERS } from '../characters'
import dialogue from '../data/dialogue.json'

function ForestScene({ children }) {
  return (
    <div className="scene forest-scene">
      <svg className="scene-bg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice"
        style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}>
        {/* sky */}
        <rect width="800" height="500" fill="#a7f3d0" />
        <rect width="800" height="500" fill="url(#forestGrad)" />
        <defs>
          <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* ground */}
        <path d="M0,360 Q200,340 400,355 Q600,370 800,345 L800,500 L0,500 Z" fill="#15803d" />
        <path d="M0,380 Q200,360 400,375 Q600,390 800,365 L800,500 L0,500 Z" fill="#166534" />
        {/* background trees */}
        {[[60,200],[160,220],[260,190],[360,210],[480,195],[580,215],[680,200],[760,185]].map(([x,y],i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-8" y="80" width="16" height="80" rx="4" fill="#92400e" />
            <polygon points="0,-60 -40,80 40,80" fill={i%2===0?'#16a34a':'#15803d'} />
            <polygon points="0,-30 -32,60 32,60" fill={i%2===0?'#22c55e':'#16a34a'} />
          </g>
        ))}
        {/* foreground trees */}
        {[[30,160],[680,155]].map(([x,y],i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-12" y="100" width="24" height="120" rx="5" fill="#78350f" />
            <polygon points="0,-80 -55,100 55,100" fill="#15803d" />
            <polygon points="0,-40 -42,70 42,70" fill="#22c55e" />
          </g>
        ))}
        {/* mushrooms */}
        {[[200,370],[420,362],[600,368]].map(([x,y]) => (
          <g key={`${x}${y}`} transform={`translate(${x},${y})`}>
            <rect x="-5" y="0" width="10" height="18" rx="3" fill="#fef9c3" />
            <ellipse cx="0" cy="0" rx="16" ry="10" fill="#ef4444" />
            {[[-6,-4],[2,-7],[7,-2]].map(([dx,dy],i) => (
              <circle key={i} cx={dx} cy={dy} r="2.5" fill="#fff" />
            ))}
          </g>
        ))}
        {/* vines hanging */}
        {[320,350,380,410,440].map((x) => (
          <path key={x} d={`M${x},0 Q${x+15},60 ${x},120 Q${x-15},180 ${x},260`}
            stroke="#15803d" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" />
        ))}
        {/* path forward */}
        <path d="M380,380 Q420,390 460,380 Q480,490 460,500 L380,500 Q360,490 380,380" fill="#a16207" opacity="0.5" />
      </svg>
      {children}
    </div>
  )
}

// ── Butterfly sub-quest ──────────────────────────────────────────────────────

function ButterflyQuest({ player, speech, onComplete }) {
  const [phase, setPhase] = useState('intro') // intro | choose | wrong | success
  const [wrongKey, setWrongKey] = useState(null)

  const introLines = dialogue.forest.butterflyIntro.map((l) => l.replace(/\[NAME\]/g, player.name))
  const wrongLines = (dialogue.forest[wrongKey] || []).map((l) => l.replace(/\[NAME\]/g, player.name))
  const successLines = dialogue.forest.butterflySuccess.map((l) => l.replace(/\[NAME\]/g, player.name))

  const choose = (choice) => {
    if (choice === 'gentle') {
      setPhase('success')
    } else {
      setWrongKey(choice === 'hard' ? 'butterflyWrong_hard' : 'butterflyWrong_away')
      setPhase('wrong')
    }
  }

  return (
    <ForestScene>
      {/* butterfly + vines visual */}
      <div style={{ position:'absolute', top:'18%', left:'50%', transform:'translateX(-50%)' }}>
        <svg viewBox="0 0 120 100" width="140" height="115">
          {/* vines */}
          <path d="M50,0 Q60,30 50,60 Q40,80 50,100" stroke="#15803d" strokeWidth="4" fill="none" />
          <path d="M70,0 Q60,30 70,60 Q80,80 70,100" stroke="#15803d" strokeWidth="4" fill="none" />
          {/* tangles */}
          <path d="M45,40 Q60,55 75,40" stroke="#15803d" strokeWidth="3" fill="none" />
          <path d="M45,55 Q60,70 75,55" stroke="#15803d" strokeWidth="3" fill="none" />
          {/* butterfly */}
          <g transform="translate(60,50)">
            <path d="M0,0 Q-30,-25 -28,5 Q-26,30 0,10 Z" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5" />
            <path d="M0,0 Q30,-25 28,5 Q26,30 0,10 Z" fill="#c084fc" stroke="#7c3aed" strokeWidth="1.5" />
            <path d="M0,10 Q-15,20 -12,35 Q-8,45 0,30 Z" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5" />
            <path d="M0,10 Q15,20 12,35 Q8,45 0,30 Z" fill="#c084fc" stroke="#7c3aed" strokeWidth="1.5" />
            <ellipse cx="0" cy="15" rx="4" ry="14" fill="#4c1d95" />
            <line x1="0" y1="2" x2="-12" y2="-10" stroke="#4c1d95" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="2" x2="12" y2="-10" stroke="#4c1d95" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {phase === 'intro' && (
        <DialogueBox lines={introLines} speak={speech.speak}
          speakerName="Narrator" onComplete={() => setPhase('choose')} />
      )}

      {phase === 'choose' && (
        <div className="choice-panel">
          <p className="choice-prompt">How will you help the butterfly?</p>
          <div className="choice-buttons">
            <button className="btn-choice btn-correct" onClick={() => choose('gentle')}>
              🤲 Pull gently
            </button>
            <button className="btn-choice btn-wrong" onClick={() => choose('hard')}>
              💪 Pull hard
            </button>
            <button className="btn-choice btn-wrong" onClick={() => choose('away')}>
              🚶 Walk away
            </button>
          </div>
        </div>
      )}

      {phase === 'wrong' && (
        <DialogueBox lines={wrongLines} speak={speech.speak}
          speakerName="Narrator" onComplete={() => setPhase('choose')} />
      )}

      {phase === 'success' && (
        <DialogueBox lines={successLines} speak={speech.speak}
          speakerName="Narrator"
          onComplete={() => onComplete()} />
      )}
    </ForestScene>
  )
}

// ── Acorns sub-quest ─────────────────────────────────────────────────────────

const ACORN_POSITIONS = [
  { x: '15%', y: '38%' }, { x: '28%', y: '55%' }, { x: '42%', y: '35%' },
  { x: '55%', y: '52%' }, { x: '68%', y: '40%' }, { x: '78%', y: '58%' },
]

function Acorn({ tapped, onTap }) {
  return (
    <button className={`acorn-btn ${tapped ? 'tapped' : ''}`} onClick={!tapped ? onTap : undefined} aria-label="Acorn">
      <svg viewBox="0 0 40 50" width="50" height="62">
        <ellipse cx="20" cy="16" rx="16" ry="12" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
        <rect x="17" y="10" width="6" height="8" rx="2" fill="#451a03" />
        {/* cap texture */}
        {[0,6,12,-6,-12].map((dx) => (
          <line key={dx} x1={20+dx} y1="10" x2={20+dx} y2="18" stroke="#451a03" strokeWidth="1" opacity="0.5" />
        ))}
        <ellipse cx="20" cy="30" rx="13" ry="16" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
        {tapped && <text x="20" y="35" textAnchor="middle" fontSize="14">✓</text>}
      </svg>
    </button>
  )
}

function AcornQuest({ player, speech, onComplete }) {
  const [tapped, setTapped] = useState([])
  const [phase, setPhase] = useState('intro') // intro | count | success

  const introLines = dialogue.forest.acornsIntro.map((l) => l.replace(/\[NAME\]/g, player.name))
  const successLines = dialogue.forest.acornsSuccess.map((l) => l.replace(/\[NAME\]/g, player.name))

  const tapAcorn = (i) => {
    const next = [...tapped, i]
    setTapped(next)
    if (next.length === 6) setPhase('success')
  }

  return (
    <ForestScene>
      {/* squirrel */}
      <div style={{ position:'absolute', top:'22%', right:'8%' }}>
        <svg viewBox="0 0 80 100" width="80" height="100">
          {/* bushy tail */}
          <path d="M55,60 Q90,40 85,10 Q70,30 60,45 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
          <path d="M55,65 Q88,50 82,18 Q68,36 58,52 Z" fill="#d97706" />
          {/* body */}
          <ellipse cx="38" cy="68" rx="22" ry="28" fill="#d97706" stroke="#92400e" strokeWidth="2" />
          {/* belly */}
          <ellipse cx="38" cy="72" rx="13" ry="18" fill="#fde68a" />
          {/* head */}
          <circle cx="38" cy="38" r="20" fill="#d97706" stroke="#92400e" strokeWidth="2" />
          {/* ears */}
          <path d="M24,24 Q18,10 26,12 Q28,20 30,22 Z" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
          <path d="M52,24 Q58,10 50,12 Q48,20 46,22 Z" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
          {/* eyes */}
          <circle cx="30" cy="34" r="4" fill="#333" />
          <circle cx="46" cy="34" r="4" fill="#333" />
          <circle cx="31.5" cy="32.5" r="1.5" fill="#fff" />
          <circle cx="47.5" cy="32.5" r="1.5" fill="#fff" />
          {/* nose */}
          <ellipse cx="38" cy="44" rx="3" ry="2" fill="#92400e" />
          {/* worry face */}
          <path d="M30,50 Q38,46 46,50" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* acorn counter */}
      {phase === 'count' && (
        <div className="acorn-counter">
          🌰 {tapped.length} / 6
        </div>
      )}

      {/* scattered acorns */}
      {phase === 'count' && ACORN_POSITIONS.map((pos, i) => (
        <div key={i} style={{ position:'absolute', left:pos.x, top:pos.y }}>
          <Acorn tapped={tapped.includes(i)} onTap={() => tapAcorn(i)} />
        </div>
      ))}

      {phase === 'intro' && (
        <DialogueBox lines={introLines} speak={speech.speak}
          speakerName="Sammy the Squirrel" onComplete={() => setPhase('count')} />
      )}

      {phase === 'success' && (
        <DialogueBox lines={successLines} speak={speech.speak}
          speakerName="Sammy the Squirrel" onComplete={() => onComplete()} />
      )}
    </ForestScene>
  )
}

// ── Main Forest scene ─────────────────────────────────────────────────────────

export default function Forest({ player, quest, speech, advance, completeSideQuest, onLeave }) {
  const [subPhase, setSubPhase] = useState('entry') // entry | explore | butterfly | acorns
  const { Component } = CHARACTERS[player.character]

  const entryLines = dialogue.forest.entry.map((l) => l.replace(/\[NAME\]/g, player.name))

  if (subPhase === 'butterfly') {
    return (
      <ButterflyQuest
        player={player}
        speech={speech}
        onComplete={() => {
          completeSideQuest('butterfly', 'kindHeart')
          setSubPhase('explore')
        }}
      />
    )
  }

  if (subPhase === 'acorns') {
    return (
      <AcornQuest
        player={player}
        speech={speech}
        onComplete={() => {
          completeSideQuest('acorns', 'sharpEyes')
          setSubPhase('explore')
        }}
      />
    )
  }

  return (
    <ForestScene>
      <div style={{ position:'absolute', bottom:'6%', left:'6%' }}>
        <Component size={100} hasCrown={false} />
        <div className="name-tag">{player.name}</div>
      </div>

      {subPhase === 'entry' && (
        <DialogueBox
          lines={entryLines}
          speak={speech.speak}
          speakerName="The Forest"
          onComplete={() => setSubPhase('explore')}
        />
      )}

      {subPhase === 'explore' && (
        <div className="explore-panel">
          <p className="scene-prompt">What will you do?</p>
          <div className="explore-buttons">
            {!quest.butterfly && (
              <button className="btn-quest" onClick={() => setSubPhase('butterfly')}>
                🦋 Help the stuck butterfly
              </button>
            )}
            {quest.butterfly && (
              <div className="quest-done">🦋 Butterfly freed! ✓</div>
            )}
            {!quest.acorns && (
              <button className="btn-quest" onClick={() => setSubPhase('acorns')}>
                🌰 Help find the acorns
              </button>
            )}
            {quest.acorns && (
              <div className="quest-done">🌰 Acorns counted! ✓</div>
            )}
            <button className="btn-primary" onClick={() => { speech.stop(); advance({ phase: 'sunnyhill' }); onLeave?.() }}>
              Continue to Sunny Hill →
            </button>
          </div>
        </div>
      )}

      <div className="scene-label">Whispering Forest</div>
    </ForestScene>
  )
}
