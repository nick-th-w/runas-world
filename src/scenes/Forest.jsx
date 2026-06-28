import { useState } from 'react'
import DialogueBox from '../components/DialogueBox'
import PuzzleSet from './puzzles'
import { CHARACTERS } from '../characters'
import dialogue from '../data/dialogue.json'

function ForestScene({ children }) {
  return (
    <div className="scene forest-scene">
      <svg className="scene-bg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice"
        style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}>
        <rect width="800" height="500" fill="#a7f3d0" />
        <rect width="800" height="500" fill="url(#forestGrad)" />
        <defs>
          <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path d="M0,360 Q200,340 400,355 Q600,370 800,345 L800,500 L0,500 Z" fill="#15803d" />
        <path d="M0,380 Q200,360 400,375 Q600,390 800,365 L800,500 L0,500 Z" fill="#166534" />
        {[[60,200],[160,220],[260,190],[360,210],[480,195],[580,215],[680,200],[760,185]].map(([x,y],i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-8" y="80" width="16" height="80" rx="4" fill="#92400e" />
            <polygon points="0,-60 -40,80 40,80" fill={i%2===0?'#16a34a':'#15803d'} />
            <polygon points="0,-30 -32,60 32,60" fill={i%2===0?'#22c55e':'#16a34a'} />
          </g>
        ))}
        {[[30,160],[680,155]].map(([x,y],i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-12" y="100" width="24" height="120" rx="5" fill="#78350f" />
            <polygon points="0,-80 -55,100 55,100" fill="#15803d" />
            <polygon points="0,-40 -42,70 42,70" fill="#22c55e" />
          </g>
        ))}
        {[[200,370],[420,362],[600,368]].map(([x,y]) => (
          <g key={`${x}${y}`} transform={`translate(${x},${y})`}>
            <rect x="-5" y="0" width="10" height="18" rx="3" fill="#fef9c3" />
            <ellipse cx="0" cy="0" rx="16" ry="10" fill="#ef4444" />
            {[[-6,-4],[2,-7],[7,-2]].map(([dx,dy],i) => (
              <circle key={i} cx={dx} cy={dy} r="2.5" fill="#fff" />
            ))}
          </g>
        ))}
        {[320,350,380,410,440].map((x) => (
          <path key={x} d={`M${x},0 Q${x+15},60 ${x},120 Q${x-15},180 ${x},260`}
            stroke="#15803d" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" />
        ))}
        <path d="M380,380 Q420,390 460,380 Q480,490 460,500 L380,500 Q360,490 380,380" fill="#a16207" opacity="0.5" />
      </svg>
      {children}
    </div>
  )
}

// ── Side quest wrappers (intro dialogue → PuzzleSet) ─────────────────────────

function ButterflyQuest({ player, speech, onComplete }) {
  const [phase, setPhase] = useState('intro') // intro | puzzle
  const lines = dialogue.forest.butterflyIntro.map((l) => l.replace(/\[NAME\]/g, player.name))

  if (phase === 'intro') {
    return (
      <ForestScene>
        {/* butterfly visual */}
        <div style={{ position:'absolute', top:'15%', left:'50%', transform:'translateX(-50%)' }}>
          <svg viewBox="0 0 120 100" width="140" height="115">
            <path d="M50,0 Q60,30 50,60 Q40,80 50,100" stroke="#15803d" strokeWidth="4" fill="none" />
            <path d="M70,0 Q60,30 70,60 Q80,80 70,100" stroke="#15803d" strokeWidth="4" fill="none" />
            <path d="M45,40 Q60,55 75,40" stroke="#15803d" strokeWidth="3" fill="none" />
            <g transform="translate(60,50)">
              <path d="M0,0 Q-30,-25 -28,5 Q-26,30 0,10 Z" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5" />
              <path d="M0,0 Q30,-25 28,5 Q26,30 0,10 Z" fill="#c084fc" stroke="#7c3aed" strokeWidth="1.5" />
              <path d="M0,10 Q-15,20 -12,35 Q-8,45 0,30 Z" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5" />
              <path d="M0,10 Q15,20 12,35 Q8,45 0,30 Z" fill="#c084fc" stroke="#7c3aed" strokeWidth="1.5" />
              <ellipse cx="0" cy="15" rx="4" ry="14" fill="#4c1d95" />
            </g>
          </svg>
        </div>
        <DialogueBox lines={lines} speak={speech.speak} speakerName="Narrator"
          onComplete={() => { speech.stop(); setPhase('puzzle') }} />
      </ForestScene>
    )
  }

  return <PuzzleSet chapterId={1} onComplete={onComplete} />
}

function AcornQuest({ player, speech, onComplete }) {
  const [phase, setPhase] = useState('intro')
  const lines = dialogue.forest.acornsIntro.map((l) => l.replace(/\[NAME\]/g, player.name))

  if (phase === 'intro') {
    return (
      <ForestScene>
        <div style={{ position:'absolute', top:'20%', right:'8%' }}>
          <svg viewBox="0 0 80 100" width="80" height="100">
            <path d="M55,60 Q90,40 85,10 Q70,30 60,45 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
            <path d="M55,65 Q88,50 82,18 Q68,36 58,52 Z" fill="#d97706" />
            <ellipse cx="38" cy="68" rx="22" ry="28" fill="#d97706" stroke="#92400e" strokeWidth="2" />
            <ellipse cx="38" cy="72" rx="13" ry="18" fill="#fde68a" />
            <circle cx="38" cy="38" r="20" fill="#d97706" stroke="#92400e" strokeWidth="2" />
            <circle cx="30" cy="34" r="4" fill="#333" />
            <circle cx="46" cy="34" r="4" fill="#333" />
            <circle cx="31.5" cy="32.5" r="1.5" fill="#fff" />
            <circle cx="47.5" cy="32.5" r="1.5" fill="#fff" />
            <ellipse cx="38" cy="44" rx="3" ry="2" fill="#92400e" />
          </svg>
        </div>
        <DialogueBox lines={lines} speak={speech.speak} speakerName="Sammy the Squirrel"
          onComplete={() => { speech.stop(); setPhase('puzzle') }} />
      </ForestScene>
    )
  }

  return <PuzzleSet chapterId={1} onComplete={onComplete} />
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
        onComplete={(medal) => {
          completeSideQuest('butterfly', 'kindHeart', medal)
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
        onComplete={(medal) => {
          completeSideQuest('acorns', 'sharpEyes', medal)
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
        <DialogueBox lines={entryLines} speak={speech.speak} speakerName="The Forest"
          onComplete={() => setSubPhase('explore')} />
      )}

      {subPhase === 'explore' && (
        <div className="explore-panel">
          <p className="scene-prompt">What will you do?</p>
          <div className="explore-buttons">
            {!quest.butterfly ? (
              <button className="btn-quest" onClick={() => setSubPhase('butterfly')}>
                🦋 The Butterfly Challenge
                {quest.questBests?.butterfly && <span className="quest-medal">
                  {{ gold:'🥇', silver:'🥈', bronze:'🥉' }[quest.questBests.butterfly]}
                </span>}
              </button>
            ) : (
              <div className="quest-done">
                🦋 Butterfly freed! ✓ {{ gold:'🥇', silver:'🥈', bronze:'🥉' }[quest.questBests?.butterfly]}
              </div>
            )}
            {!quest.acorns ? (
              <button className="btn-quest" onClick={() => setSubPhase('acorns')}>
                🌰 The Acorn Challenge
                {quest.questBests?.acorns && <span className="quest-medal">
                  {{ gold:'🥇', silver:'🥈', bronze:'🥉' }[quest.questBests.acorns]}
                </span>}
              </button>
            ) : (
              <div className="quest-done">
                🌰 Acorns found! ✓ {{ gold:'🥇', silver:'🥈', bronze:'🥉' }[quest.questBests?.acorns]}
              </div>
            )}
            <button className="btn-primary"
              onClick={() => { speech.stop(); advance({ phase: 'sunnyhill' }); onLeave?.() }}>
              Continue to Sunny Hill →
            </button>
          </div>
        </div>
      )}

      <div className="scene-label">Whispering Forest</div>
    </ForestScene>
  )
}
