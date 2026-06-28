import { useState } from 'react'
import DialogueBox from '../components/DialogueBox'
import { CHARACTERS, BeaSVG } from '../characters'
import dialogue from '../data/dialogue.json'

function MeadowScene({ children }) {
  return (
    <div className="scene meadow-scene">
      <svg className="scene-bg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice"
        style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}>
        {/* sky */}
        <rect width="800" height="500" fill="#c7e8f5" />
        {/* clouds */}
        <g opacity="0.9">
          <ellipse cx="120" cy="80" rx="55" ry="30" fill="#fff" />
          <ellipse cx="155" cy="68" rx="40" ry="28" fill="#fff" />
          <ellipse cx="90" cy="72" rx="35" ry="24" fill="#fff" />
        </g>
        <g opacity="0.9">
          <ellipse cx="580" cy="70" rx="60" ry="28" fill="#fff" />
          <ellipse cx="620" cy="58" rx="44" ry="26" fill="#fff" />
          <ellipse cx="548" cy="65" rx="38" ry="22" fill="#fff" />
        </g>
        {/* sun */}
        {[0,45,90,135,180,225,270,315].map((deg) => (
          <line key={deg} x1="700" y1="80"
            x2={700 + Math.cos(deg*Math.PI/180)*46}
            y2={80 + Math.sin(deg*Math.PI/180)*46}
            stroke="#fde047" strokeWidth="4" strokeLinecap="round" />
        ))}
        <circle cx="700" cy="80" r="34" fill="#fde047" stroke="#facc15" strokeWidth="2" />
        {/* ground */}
        <path d="M0,320 Q200,295 400,315 Q600,335 800,310 L800,500 L0,500 Z" fill="#86efac" />
        <path d="M0,340 Q200,320 400,335 Q600,350 800,330 L800,500 L0,500 Z" fill="#4ade80" />
        {/* house */}
        <rect x="560" y="230" width="130" height="100" rx="4" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
        <path d="M545,232 L625,165 L705,232 Z" fill="#ef4444" stroke="#dc2626" strokeWidth="3" />
        {/* door */}
        <rect x="608" y="285" width="34" height="45" rx="6" fill="#92400e" stroke="#78350f" strokeWidth="2" />
        <circle cx="637" cy="310" r="3" fill="#fde047" />
        {/* windows */}
        <rect x="568" y="248" width="34" height="28" rx="4" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="2" />
        <rect x="648" y="248" width="34" height="28" rx="4" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="2" />
        <line x1="585" y1="248" x2="585" y2="276" stroke="#93c5fd" strokeWidth="1.5" />
        <line x1="568" y1="262" x2="602" y2="262" stroke="#93c5fd" strokeWidth="1.5" />
        <line x1="665" y1="248" x2="665" y2="276" stroke="#93c5fd" strokeWidth="1.5" />
        <line x1="648" y1="262" x2="682" y2="262" stroke="#93c5fd" strokeWidth="1.5" />
        {/* path */}
        <path d="M625,330 Q620,380 610,450" stroke="#d97706" strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.6" />
        {/* flowers */}
        {[[80,340],[160,355],[240,335],[340,350],[440,330],[500,345]].map(([x,y],i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            {[0,72,144,216,288].map((deg) => (
              <ellipse key={deg} cx="0" cy="-10" rx="5" ry="8"
                fill={['#f472b6','#a78bfa','#fb923c','#facc15','#34d399'][i%5]}
                transform={`rotate(${deg})`} />
            ))}
            <circle r="6" fill="#fde047" />
          </g>
        ))}
        {/* bee placeholder space — component renders outside SVG */}
        {/* letter on doorstep */}
        <g transform="translate(610,328)">
          <rect x="-20" y="-14" width="40" height="28" rx="3" fill="#fef9c3" stroke="#d97706" strokeWidth="2" />
          <path d="M-20,-14 L0,4 L20,-14" stroke="#d97706" strokeWidth="1.5" fill="none" />
          <text x="0" y="20" textAnchor="middle" fontSize="10" fill="#d97706">✉</text>
        </g>
      </svg>
      {children}
    </div>
  )
}

export default function Meadow({ player, speech, advance, onLeave }) {
  const [phase, setPhase] = useState('dialogue') // dialogue | ready
  const { Component } = CHARACTERS[player.character]

  const lines = dialogue.meadow.intro.map((l) => l.replace(/\[NAME\]/g, player.name))

  return (
    <MeadowScene>
      {/* Bea the Bee — canonical component */}
      <div style={{ position:'absolute', top:'34%', left:'30%', filter:'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>
        <BeaSVG size={110} />
      </div>
      {/* player character bottom-left */}
      <div style={{ position:'absolute', bottom:'6%', left:'6%' }}>
        <Component size={100} hasCrown={false} />
        <div className="name-tag">{player.name}</div>
      </div>

      {phase === 'dialogue' && (
        <DialogueBox
          lines={lines}
          speak={speech.speak}
          speakerName="Bea the Bee"
          onComplete={() => setPhase('ready')}
        />
      )}

      {phase === 'ready' && (
        <div className="scene-action">
          <p className="scene-prompt">Ready to start the adventure?</p>
          <button className="btn-primary" onClick={() => { speech.stop(); advance({ phase: 'forest' }); onLeave?.() }}>
            Journey to the Forest! 🌿
          </button>
        </div>
      )}

      {/* scene label now in GameToolbar */}
    </MeadowScene>
  )
}
