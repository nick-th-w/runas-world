import { useState } from 'react'
import DialogueBox from '../components/DialogueBox'
import PuzzleSet from './puzzles'
import TeethRhythmGame from './TeethRhythmGame'
import { CHARACTERS, BeaSVG } from '../characters'
import dialogue from '../data/dialogue.json'

const d2 = dialogue.ch2

function sub(lines, name) {
  return lines.map(l => l.replace(/\[NAME\]/g, name))
}

// ── Scene SVG backgrounds ─────────────────────────────────────────────────────

function BedroomMorningScene({ children }) {
  return (
    <div className="scene ch2-bedroom-morning">
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}
        viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        {/* warm sunrise sky */}
        <defs>
          <linearGradient id="sunriseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="60%" stopColor="#fef9c3" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#sunriseGrad)" />
        {/* bedroom wall */}
        <rect width="800" height="500" fill="#fef3c7" opacity="0.4" />
        {/* window with sunrise */}
        <rect x="560" y="60" width="180" height="140" rx="8" fill="#bae6fd" stroke="#92400e" strokeWidth="4" />
        <line x1="650" y1="60" x2="650" y2="200" stroke="#92400e" strokeWidth="3" />
        <line x1="560" y1="130" x2="740" y2="130" stroke="#92400e" strokeWidth="3" />
        {/* sun through window */}
        {[0,45,90,135,180,225,270,315].map(deg => (
          <line key={deg} x1="650" y1="130"
            x2={650+Math.cos(deg*Math.PI/180)*55} y2={130+Math.sin(deg*Math.PI/180)*55}
            stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        ))}
        <circle cx="650" cy="130" r="28" fill="#fde047" />
        {/* curtains */}
        <path d="M555,55 Q540,130 545,200 L560,200 L560,60 Z" fill="#fca5a5" />
        <path d="M745,55 Q760,130 755,200 L740,200 L740,60 Z" fill="#fca5a5" />
        {/* bed frame */}
        <rect x="60" y="300" width="280" height="165" rx="12" fill="#dbeafe" stroke="#93c5fd" strokeWidth="3" />
        {/* headboard */}
        <rect x="60" y="278" width="280" height="44" rx="10" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="3" />
        {/* pillow */}
        <ellipse cx="200" cy="300" rx="78" ry="26" fill="#fff" stroke="#93c5fd" strokeWidth="2" />
        {/* single blanket */}
        <rect x="65" y="328" width="270" height="128" rx="10" fill="#93c5fd" opacity="0.55" />
        <path d="M65,352 Q200,342 335,352" stroke="#7dd3fc" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
        <path d="M65,378 Q200,368 335,378" stroke="#7dd3fc" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
        {/* bedside table */}
        <rect x="380" y="320" width="80" height="90" rx="6" fill="#d97706" />
        <rect x="375" y="315" width="90" height="15" rx="4" fill="#b45309" />
        {/* lamp */}
        <rect x="410" y="280" width="8" height="40" fill="#78350f" />
        <polygon points="395,280 425,280 418,252 402,252" fill="#fde68a" />
        {/* stars/sparkles from Bea */}
        {[[180,80],[220,70],[260,90],[300,75]].map(([x,y],i) => (
          <text key={i} x={x} y={y} fontSize="16" fill="#fbbf24" opacity="0.8">✦</text>
        ))}
      </svg>
      {children}
    </div>
  )
}

function VillagePathScene({ children }) {
  return (
    <div className="scene ch2-village-path">
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}
        viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        {/* sky */}
        <rect width="800" height="500" fill="#bae6fd" />
        {/* clouds */}
        {[[100,60,60,28],[280,50,50,24],[540,70,65,28],[680,55,55,24]].map(([x,y,rx,ry],i) => (
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#fff" opacity="0.9" />
        ))}
        {/* hills */}
        <path d="M0,320 Q200,240 400,280 Q600,320 800,260 L800,500 L0,500 Z" fill="#bbf7d0" />
        <path d="M0,360 Q200,300 400,320 Q600,340 800,300 L800,500 L0,500 Z" fill="#86efac" />
        <path d="M0,400 Q400,370 800,390 L800,500 L0,500 Z" fill="#4ade80" />
        {/* path winding to lake */}
        <path d="M360,500 Q380,400 340,320 Q300,250 380,180" stroke="#d97706" strokeWidth="32" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M360,500 Q380,400 340,320 Q300,250 380,180" stroke="#fef9c3" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.4" />
        {/* houses */}
        {[[80,320],[620,300]].map(([x,y],i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="0" y="0" width="100" height="80" rx="4" fill={i===0?'#fbbf24':'#f9a8d4'} stroke="#d97706" strokeWidth="2" />
            <polygon points="-10,-10 50,-60 110,-10" fill={i===0?'#ef4444':'#ec4899'} stroke="#dc2626" strokeWidth="2" />
            <rect x="35" y="30" width="30" height="50" rx="4" fill="#78350f" />
            <rect x="8" y="12" width="28" height="22" rx="3" fill="#bfdbfe" />
          </g>
        ))}
        {/* flowers along path */}
        {[[200,380],[280,370],[440,390],[540,375]].map(([x,y],i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            {[0,72,144,216,288].map(deg => (
              <ellipse key={deg} cx="0" cy="-8" rx="4" ry="7"
                fill={['#fb923c','#f472b6','#a78bfa','#facc15'][i%4]}
                transform={`rotate(${deg})`} />
            ))}
            <circle r="5" fill="#fde047" />
          </g>
        ))}
        {/* lake hint in distance */}
        <ellipse cx="400" cy="188" rx="60" ry="18" fill="#60a5fa" opacity="0.6" />
      </svg>
      {children}
    </div>
  )
}

function LakeshoreScene({ children }) {
  return (
    <div className="scene ch2-lakeshore">
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}
        viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lakeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="50%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {/* sky */}
        <rect width="800" height="260" fill="#bae6fd" />
        {/* lake */}
        <rect y="200" width="800" height="300" fill="url(#lakeGrad)" />
        {/* shore */}
        <path d="M0,210 Q200,195 400,205 Q600,215 800,200 L800,240 Q600,255 400,245 Q200,235 0,250 Z" fill="#86efac" />
        {/* sparkle on water */}
        {[[120,260],[300,270],[500,255],[650,265]].map(([x,y],i)=>(
          <text key={i} x={x} y={y} fontSize="14" fill="#fff" opacity="0.5">✦</text>
        ))}
        {/* lily pads */}
        {[[180,310],[260,330],[380,295],[500,320],[620,308]].map(([x,y],i)=>(
          <g key={i} transform={`translate(${x},${y})`}>
            <ellipse cx="0" cy="0" rx="22" ry="14" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />
            {i%2===0 && <ellipse cx="0" cy="-16" rx="5" ry="6" fill="#f472b6" stroke="#be185d" strokeWidth="1" />}
          </g>
        ))}
        {/* reeds */}
        {[[680,200],[700,195],[720,205],[740,198]].map(([x,y],i)=>(
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y+90} stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx={x} cy={y} rx="5" ry="12" fill="#d97706" />
          </g>
        ))}
        {/* trees on shore */}
        {[[30,160],[80,180],[700,165],[760,175]].map(([x,y],i)=>(
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-6" y="50" width="12" height="50" rx="4" fill="#78350f" />
            <circle cx="0" cy="20" r="34" fill="#16a34a" />
            <circle cx="0" cy="8" r="24" fill="#22c55e" />
          </g>
        ))}
      </svg>
      {children}
    </div>
  )
}

function LakeShallowsScene({ children }) {
  return (
    <div className="scene ch2-lake-shallows">
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}
        viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="shallowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#shallowGrad)" />
        {/* water ripples */}
        {[[160,80],[400,60],[620,90],[240,160],[560,150]].map(([x,y],i)=>(
          <ellipse key={i} cx={x} cy={y} rx="50" ry="12" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.3" />
        ))}
        {/* sandy bottom */}
        <path d="M0,400 Q400,380 800,400 L800,500 L0,500 Z" fill="#fde68a" opacity="0.6" />
        <path d="M0,430 Q400,415 800,430 L800,500 L0,500 Z" fill="#fbbf24" opacity="0.4" />
        {/* fish */}
        {[[120,200,1],[280,280,-1],[450,170,1],[600,250,-1],[720,310,1]].map(([x,y,dir],i)=>(
          <g key={i} transform={`translate(${x},${y}) scale(${dir},1)`}>
            <ellipse cx="0" cy="0" rx="22" ry="12" fill={['#f87171','#fb923c','#fbbf24','#4ade80','#60a5fa'][i]} />
            <path d="M-18,0 L-28,-10 L-28,10 Z" fill={['#dc2626','#ea580c','#d97706','#16a34a','#2563eb'][i]} />
            <circle cx="14" cy="-3" r="3" fill="#fff" />
            <circle cx="14" cy="-3" r="1.5" fill="#1a1a1a" />
          </g>
        ))}
        {/* bubbles */}
        {[[200,100],[350,140],[500,90],[650,120]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={4+i*2} fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.4" />
        ))}
        {/* seaweed */}
        {[[100,450],[300,440],[500,455],[700,448]].map(([x,y],i)=>(
          <path key={i} d={`M${x},${y} Q${x+15},${y-40} ${x},${y-70} Q${x-15},${y-100} ${x},${y-130}`}
            stroke="#16a34a" strokeWidth="4" fill="none" strokeLinecap="round" />
        ))}
      </svg>
      {children}
    </div>
  )
}

function DeepLakeScene({ children }) {
  return (
    <div className="scene ch2-deep-lake">
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}
        viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="deepGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
          <radialGradient id="ringGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="500" fill="url(#deepGrad)" />
        {/* stars/sparkles */}
        {[[60,40],[180,25],[340,50],[520,30],[680,45],[140,90],[420,80],[700,100]].map(([x,y],i)=>(
          <text key={i} x={x} y={y} fontSize={10+i%4*3} fill="#a78bfa" opacity="0.6">✦</text>
        ))}
        {/* fairy ring glow */}
        <circle cx="400" cy="300" r="140" fill="url(#ringGlow)" />
        {/* fairy ring mushrooms */}
        {Array.from({length: 10}, (_,i) => {
          const angle = (i / 10) * Math.PI * 2
          const x = 400 + Math.cos(angle) * 120
          const y = 300 + Math.sin(angle) * 60
          return (
            <g key={i} transform={`translate(${x},${y})`}>
              <rect x="-5" y="0" width="10" height="18" rx="3" fill="#fef9c3" />
              <ellipse cx="0" cy="0" rx="14" ry="9" fill="#ef4444" />
              {[[-5,-4],[2,-6],[6,-2]].map(([dx,dy],j) => (
                <circle key={j} cx={dx} cy={dy} r="2" fill="#fff" />
              ))}
            </g>
          )
        })}
        {/* glowing ring */}
        <ellipse cx="400" cy="300" rx="120" ry="60" fill="none" stroke="#818cf8" strokeWidth="3" opacity="0.6" strokeDasharray="8 4" />
        {/* mystical bubbles */}
        {[[180,200],[300,280],[500,190],[620,260],[740,220]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={8+i*3} fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.35" />
        ))}
        {/* ground glow */}
        <path d="M0,420 Q400,400 800,420 L800,500 L0,500 Z" fill="#0e7490" opacity="0.6" />
      </svg>
      {children}
    </div>
  )
}

function BedroomNightScene({ children, showFairy }) {
  return (
    <div className="scene ch2-bedroom-night">
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}
        viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        {/* dark room */}
        <rect width="800" height="500" fill="#0d1b2a" />
        {/* night sky through window */}
        <rect x="560" y="60" width="180" height="140" rx="8" fill="#1e3a5f" />
        {/* moon */}
        <circle cx="640" cy="115" r="28" fill="#fef9c3" />
        <circle cx="655" cy="108" r="22" fill="#1e3a5f" />
        {/* stars outside */}
        {[[570,70],[600,85],[660,75],[700,90],[720,68],[580,100]].map(([x,y],i)=>(
          <text key={i} x={x} y={y} fontSize="10" fill="#fde68a" opacity="0.8">✦</text>
        ))}
        {/* window frame */}
        <rect x="557" y="57" width="186" height="146" rx="8" fill="none" stroke="#78350f" strokeWidth="4" />
        <line x1="650" y1="57" x2="650" y2="203" stroke="#78350f" strokeWidth="3" />
        <line x1="557" y1="130" x2="743" y2="130" stroke="#78350f" strokeWidth="3" />
        {/* moonlight beam */}
        <path d="M560,200 L400,380 L280,380 L440,200 Z" fill="#fef9c3" opacity="0.05" />
        {/* bed */}
        <rect x="40" y="290" width="360" height="190" rx="10" fill="#1e3a5f" />
        <rect x="40" y="270" width="360" height="50" rx="8" fill="#1e3a5f" />
        <ellipse cx="220" cy="295" rx="90" ry="30" fill="#0f2744" />
        {/* sleeping character hint */}
        <path d="M160,300 Q220,290 280,300" stroke="#60a5fa" strokeWidth="2" fill="none" opacity="0.5" />
        {/* pillow with tooth outline */}
        <rect x="130" y="278" width="60" height="25" rx="5" fill="#fff" opacity="0.15" />
        <text x="148" y="296" fontSize="14">🦷</text>
        {/* lamp glow */}
        <circle cx="450" cy="280" r="60" fill="#fde68a" opacity="0.05" />
        <rect x="438" y="280" width="8" height="50" fill="#78350f" />
        <polygon points="424,280 464,280 458,254 430,254" fill="#fde68a" opacity="0.8" />
        {/* fairy sparkles (shown after arrival) */}
        {showFairy && [
          [200,150],[160,120],[240,130],[180,160],[220,110]
        ].map(([x,y],i)=>(
          <text key={i} x={x} y={y} fontSize={12+i*4} fill="#fbbf24"
            style={{ animation: `twinkle ${0.5+i*0.2}s ease-in-out infinite alternate` }}>✨</text>
        ))}
      </svg>
      {children}
    </div>
  )
}

// ── Tooth Fairy SVG character ────────────────────────────────────────────────

function ToothFairy({ size = 100 }) {
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} aria-label="Tooth Fairy">
      {/* sparkle aura */}
      {[0,60,120,180,240,300].map(deg=>(
        <line key={deg}
          x1={50+Math.cos(deg*Math.PI/180)*28} y1={45+Math.sin(deg*Math.PI/180)*28}
          x2={50+Math.cos(deg*Math.PI/180)*38} y2={45+Math.sin(deg*Math.PI/180)*38}
          stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      ))}
      {/* wings */}
      <path d="M50,55 Q20,20 10,45 Q20,70 50,60 Z" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1.5" opacity="0.85" />
      <path d="M50,55 Q80,20 90,45 Q80,70 50,60 Z" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1.5" opacity="0.85" />
      <path d="M50,65 Q28,55 22,72 Q30,82 50,72 Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" opacity="0.7" />
      <path d="M50,65 Q72,55 78,72 Q70,82 50,72 Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" opacity="0.7" />
      {/* dress */}
      <path d="M34,70 Q40,110 50,115 Q60,110 66,70 Z" fill="#f9a8d4" stroke="#ec4899" strokeWidth="1.5" />
      {/* body */}
      <ellipse cx="50" cy="65" rx="16" ry="14" fill="#fce7f3" stroke="#ec4899" strokeWidth="1.5" />
      {/* head */}
      <circle cx="50" cy="42" r="18" fill="#fce7f3" stroke="#ec4899" strokeWidth="1.5" />
      {/* hair */}
      <ellipse cx="50" cy="28" rx="18" ry="10" fill="#fbbf24" />
      <path d="M32,34 Q26,18 34,10 Q42,26 50,24" fill="#fbbf24" />
      <path d="M68,34 Q74,18 66,10 Q58,26 50,24" fill="#fbbf24" />
      {/* crown */}
      <path d="M36,28 L40,20 L44,27 L50,16 L56,27 L60,20 L64,28" stroke="#fde047" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* face */}
      <circle cx="44" cy="40" r="3.5" fill="#333" />
      <circle cx="56" cy="40" r="3.5" fill="#333" />
      <circle cx="45.5" cy="38.5" r="1.3" fill="#fff" />
      <circle cx="57.5" cy="38.5" r="1.3" fill="#fff" />
      <path d="M44,48 Q50,54 56,48" stroke="#ec4899" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="44" cy="44" r="4" fill="#fbcfe8" opacity="0.5" />
      <circle cx="56" cy="44" r="4" fill="#fbcfe8" opacity="0.5" />
      {/* wand */}
      <line x1="68" y1="55" x2="84" y2="38" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
      <text x="78" y="38" fontSize="18">⭐</text>
    </svg>
  )
}

// ── Lake Spirit mini-boss ─────────────────────────────────────────────────────

function LakeSpirit({ size = 120 }) {
  return (
    <svg viewBox="0 0 120 150" width={size} height={size * 1.25} aria-label="Lake Spirit">
      {/* glow */}
      <ellipse cx="60" cy="75" rx="55" ry="65" fill="#60a5fa" opacity="0.12" />
      {/* wispy tentacles */}
      {[-40,-20,0,20,40].map((offset,i)=>(
        <path key={i} d={`M${60+offset},120 Q${60+offset+10},140 ${60+offset},155`}
          stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
      ))}
      {/* main body */}
      <ellipse cx="60" cy="75" rx="40" ry="50" fill="#0ea5e9" stroke="#38bdf8" strokeWidth="2.5" opacity="0.9" />
      {/* inner glow */}
      <ellipse cx="60" cy="65" rx="28" ry="36" fill="#7dd3fc" opacity="0.4" />
      {/* face */}
      <circle cx="46" cy="62" r="7" fill="#1e3a5f" />
      <circle cx="74" cy="62" r="7" fill="#1e3a5f" />
      <circle cx="47" cy="60" r="3" fill="#bfdbfe" opacity="0.8" />
      <circle cx="75" cy="60" r="3" fill="#bfdbfe" opacity="0.8" />
      {/* stern expression */}
      <path d="M46,82 L74,82" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" />
      {/* crown of water */}
      {[-30,-15,0,15,30].map((x,i)=>(
        <path key={i} d={`M${60+x},30 Q${60+x+6},18 ${60+x+12},26`}
          stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />
      ))}
      {/* sparkles around spirit */}
      {[[15,40],[105,35],[10,90],[110,85]].map(([x,y],i)=>(
        <text key={i} x={x} y={y} fontSize="12" fill="#7dd3fc" opacity="0.6">✦</text>
      ))}
    </svg>
  )
}

// ── Lake Spirit Challenge (mini-boss) ────────────────────────────────────────

const PATTERN_COLORS = ['#ef4444','#3b82f6','#22c55e','#fbbf24']

function LakeSpiritChallenge({ playerName, speech, onWin }) {
  const [bossPhase, setBossPhase] = useState('intro') // intro|show|input|wrong|success
  const [pattern] = useState(() => Array.from({length:4}, ()=>Math.floor(Math.random()*4)))
  const [shown, setShown] = useState(false)
  const [input, setInput] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [showPattern, setShowPattern] = useState(null) // index being shown

  const introLines = sub(d2.lakeSpiritIntro, playerName)
  const wrongLines = sub(d2.lakeSpiritWrong, playerName)
  const successLines = sub(d2.lakeSpiritSuccess, playerName)

  const revealPattern = () => {
    setBossPhase('show')
    setShown(false)
    let i = 0
    const next = () => {
      if (i < pattern.length) {
        setShowPattern(i)
        setTimeout(() => { setShowPattern(null); i++; setTimeout(next, 300) }, 800)
      } else {
        setShown(true)
        setBossPhase('input')
        setInput([])
      }
    }
    setTimeout(next, 500)
  }

  const tapColor = (colorIdx) => {
    if (bossPhase !== 'input') return
    const newInput = [...input, colorIdx]
    setInput(newInput)

    if (newInput[newInput.length-1] !== pattern[newInput.length-1]) {
      // Wrong
      setAttempts(a => a+1)
      setBossPhase('wrong')
      return
    }

    if (newInput.length === pattern.length) {
      setBossPhase('success')
    }
  }

  return (
    <DeepLakeScene>
      {/* Lake Spirit */}
      <div style={{ position:'absolute', top:'5%', left:'50%', transform:'translateX(-50%)' }}>
        <LakeSpirit size={100} />
      </div>

      {bossPhase === 'intro' && (
        <DialogueBox lines={introLines} speak={speech.speak} speakerName="Lake Spirit"
          onComplete={() => revealPattern()} />
      )}

      {(bossPhase === 'show' || bossPhase === 'input') && (
        <div className="spirit-challenge">
          <div className="spirit-pattern-grid">
            {PATTERN_COLORS.map((color, i) => (
              <div key={i} className={`spirit-orb ${showPattern === i ? 'orb-lit' : ''}`}
                style={{ background: color, boxShadow: showPattern === i ? `0 0 24px ${color}` : 'none' }}
                onClick={() => bossPhase === 'input' && tapColor(i)} />
            ))}
          </div>
          {bossPhase === 'show' && (
            <p className="spirit-hint">Watch the pattern carefully...</p>
          )}
          {bossPhase === 'input' && (
            <p className="spirit-hint">Now tap the same colours in order! ({input.length}/{pattern.length})</p>
          )}
        </div>
      )}

      {bossPhase === 'wrong' && (
        <DialogueBox lines={wrongLines} speak={speech.speak} speakerName="Lake Spirit"
          onComplete={() => revealPattern()} />
      )}

      {bossPhase === 'success' && (
        <DialogueBox lines={successLines} speak={speech.speak} speakerName="Lake Spirit"
          onComplete={onWin} />
      )}
    </DeepLakeScene>
  )
}

// ── Main Chapter 2 component ──────────────────────────────────────────────────

export default function Chapter2({ player, quest, speech, advanceCh2, completeSideQuest, completeMain: completeCh2Main, onComplete }) {
  // Use quest.ch2Phase as source of truth so external nav arrows work
  const subPhase = quest.ch2Phase || 'bedroom-morning'
  const { Component } = CHARACTERS[player.character]

  const advance = (next) => advanceCh2({ ch2Phase: next })

  // ── Bedroom Morning ──
  if (subPhase === 'bedroom-morning') {
    return (
      <BedroomMorningScene>
        {/* character sitting up in bed — bigger, on the bed */}
        <div style={{ position:'absolute', bottom:'20%', left:'4%' }}>
          <Component size={130} hasCrown={false} />
          <div className="name-tag">{player.name}</div>
        </div>
        {/* Bea the Bee — canonical component */}
        <div style={{ position:'absolute', top:'14%', right:'10%', filter:'drop-shadow(0 3px 6px rgba(0,0,0,0.12))' }}>
          <BeaSVG size={100} />
        </div>
        <DialogueBox lines={sub(d2.bedroomMorning, player.name)} speak={speech.speak}
          speakerName="Bea the Bee" onComplete={() => advance('village-path')} />
      </BedroomMorningScene>
    )
  }

  // ── Village Path ──
  if (subPhase === 'village-path') {
    return (
      <VillagePathScene>
        <div style={{ position:'absolute', bottom:'6%', left:'6%' }}>
          <Component size={90} hasCrown={false} />
          <div className="name-tag">{player.name}</div>
        </div>
        <DialogueBox lines={sub(d2.villagePath, player.name)} speak={speech.speak}
          speakerName="Bea the Bee" onComplete={() => advance('lakeshore')} />
      </VillagePathScene>
    )
  }

  // ── Quest: Lily Pads puzzle ──
  if (subPhase === 'lily-pads-puzzle') {
    return (
      <PuzzleSet chapterId={2} questId="lily-pads"
        onComplete={(medal) => {
          completeSideQuest('ch2LilyPads', 'ch2ToothBadge', medal)
          advance('lily-pads-success')
        }} />
    )
  }

  if (subPhase === 'lily-pads-success') {
    return (
      <LakeshoreScene>
        <DialogueBox lines={sub(d2.lilyPadsSuccess, player.name)} speak={speech.speak}
          speakerName="Narrator" onComplete={() => advance('lake-shallows')} />
      </LakeshoreScene>
    )
  }

  // ── Lakeshore ──
  if (subPhase === 'lakeshore') {
    return (
      <LakeshoreScene>
        <div style={{ position:'absolute', bottom:'6%', left:'6%' }}>
          <Component size={90} hasCrown={false} />
          <div className="name-tag">{player.name}</div>
        </div>
        <div className="explore-panel">
          <p className="scene-prompt">The first trial stone is here!</p>
          <div className="explore-buttons">
            <button className="btn-quest" onClick={() => { speech.stop(); advance('lily-pads-puzzle') }}>
              🌸 The Lost Lily Pads
            </button>
          </div>
        </div>
        <div className="scene-label">Tooth Fairy&apos;s Lake — Shore</div>
      </LakeshoreScene>
    )
  }

  // ── Quest: Baby Fish puzzle ──
  if (subPhase === 'baby-fish-puzzle') {
    return (
      <PuzzleSet chapterId={2} questId="baby-fish"
        onComplete={(medal) => {
          completeSideQuest('ch2BabyFish', 'ch2FishBadge', medal)
          advance('baby-fish-success')
        }} />
    )
  }

  if (subPhase === 'baby-fish-success') {
    return (
      <LakeShallowsScene>
        <DialogueBox lines={sub(d2.babyFishSuccess, player.name)} speak={speech.speak}
          speakerName="Narrator" onComplete={() => advance('lake-shallows')} />
      </LakeShallowsScene>
    )
  }

  // ── Quest: Falling Teeth rhythm game ──
  if (subPhase === 'falling-teeth') {
    return (
      <TeethRhythmGame
        onComplete={() => {
          completeSideQuest('ch2FallingTeeth', 'ch2WandSticker', 'gold')
          advance('lake-shallows')
        }}
        onCancel={() => advance('lake-shallows')}
      />
    )
  }

  // ── Lake Shallows ──
  if (subPhase === 'lake-shallows') {
    const canAdvance = quest.ch2BabyFish && quest.ch2FallingTeeth
    return (
      <LakeShallowsScene>
        <div style={{ position:'absolute', bottom:'6%', left:'6%' }}>
          <Component size={90} hasCrown={false} />
          <div className="name-tag">{player.name}</div>
        </div>
        <div className="explore-panel">
          <p className="scene-prompt">The shallows hold 2 trial stones!</p>
          <div className="explore-buttons">
            {!quest.ch2BabyFish ? (
              <button className="btn-quest" onClick={() => { speech.stop(); advance('baby-fish-puzzle') }}>
                🐟 The Baby Fish Count
              </button>
            ) : (
              <div className="quest-done">🐟 Baby fish helped! Stone 2 ✓</div>
            )}
            {!quest.ch2FallingTeeth ? (
              <button className="btn-quest" onClick={() => { speech.stop(); advance('falling-teeth') }}>
                🦷 The Falling Teeth
              </button>
            ) : (
              <div className="quest-done">🦷 Teeth caught! Stone 3 ✓</div>
            )}
            {canAdvance && (
              <button className="btn-primary" onClick={() => { speech.stop(); advance('deep-lake') }}>
                Dive to the Deep Lake →
              </button>
            )}
          </div>
        </div>
        <div className="scene-label">Lake Shallows</div>
      </LakeShallowsScene>
    )
  }

  // ── Quest: Fairy Ring puzzle ──
  if (subPhase === 'fairy-ring-puzzle') {
    return (
      <PuzzleSet chapterId={2} questId="fairy-ring"
        onComplete={(medal) => {
          completeSideQuest('ch2FairyRing', 'ch2MoonBadge', medal)
          advance('fairy-ring-success')
        }} />
    )
  }

  if (subPhase === 'fairy-ring-success') {
    return (
      <DeepLakeScene>
        <DialogueBox lines={sub(d2.fairyRingSuccess, player.name)} speak={speech.speak}
          speakerName="Narrator" onComplete={() => advance('lake-spirit')} />
      </DeepLakeScene>
    )
  }

  // ── Mini-boss: Lake Spirit ──
  if (subPhase === 'lake-spirit') {
    return (
      <LakeSpiritChallenge
        playerName={player.name}
        speech={speech}
        onWin={() => {
          advanceCh2({ ch2MiniBoss: true })
          advance('bedroom-night')
        }}
      />
    )
  }

  // ── Deep Lake ──
  if (subPhase === 'deep-lake') {
    return (
      <DeepLakeScene>
        <div style={{ position:'absolute', bottom:'6%', left:'6%' }}>
          <Component size={90} hasCrown={false} />
          <div className="name-tag">{player.name}</div>
        </div>
        {!quest.ch2FairyRing ? (
          <div className="explore-panel">
            <p className="scene-prompt">The Fairy Ring and the Lake Spirit await...</p>
            <div className="explore-buttons">
              <button className="btn-quest" onClick={() => { speech.stop(); advance('fairy-ring-puzzle') }}>
                🌙 The Fairy Ring Riddles
              </button>
            </div>
          </div>
        ) : !quest.ch2MiniBoss ? (
          <div className="explore-panel">
            <p className="scene-prompt">Stones 4 and 5 are yours! Now face the Lake Spirit for stone 6!</p>
            <div className="explore-buttons">
              <div className="quest-done">🌙 Fairy Ring complete! Stones 4+5 ✓</div>
              <button className="btn-primary" onClick={() => advance('lake-spirit')}>
                Face the Lake Spirit →
              </button>
            </div>
          </div>
        ) : (
          <div className="scene-action">
            <div className="quest-done">🌊 Lake Spirit defeated! Stone 6 ✓</div>
            <button className="btn-primary" onClick={() => advance('bedroom-night')}>
              Go home, {player.name}! →
            </button>
          </div>
        )}
        <div className="scene-label">Deep Lake — Fairy Ring</div>
      </DeepLakeScene>
    )
  }

  // ── Bedroom Night ──
  if (subPhase === 'bedroom-night') {
    return <BedroomNightChapter player={player} speech={speech} advanceCh2={advanceCh2}
      completeCh2Main={completeCh2Main} onComplete={onComplete} />
  }

  return null
}

// Separate component to keep state clean for the ending sequence
function BedroomNightChapter({ player, speech, advanceCh2, completeCh2Main, onComplete }) {
  const [nightPhase, setNightPhase] = useState('narration') // narration|fairy|complete

  return (
    <BedroomNightScene showFairy={nightPhase === 'fairy' || nightPhase === 'complete'}>
      <div style={{ position:'absolute', bottom:'6%', left:'6%', zIndex:20 }}>
        {nightPhase === 'fairy' && (
          <div style={{ position:'absolute', bottom:'100%', left:'50%', transform:'translateX(-50%)', marginBottom:12 }}>
            <ToothFairy size={100} />
          </div>
        )}
      </div>

      {nightPhase === 'narration' && (
        <DialogueBox lines={sub(dialogue.ch2.bedroomNight, player.name)} speak={speech.speak}
          speakerName="Bea the Bee"
          onComplete={() => { completeCh2Main(); setNightPhase('fairy') }} />
      )}

      {nightPhase === 'fairy' && (
        <>
          <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', zIndex:30 }}>
            <ToothFairy size={120} />
          </div>
          <DialogueBox lines={sub(dialogue.ch2.toothFairyArrival, player.name)} speak={speech.speak}
            speakerName="The Tooth Fairy ✨"
            onComplete={() => setNightPhase('complete')} />
        </>
      )}

      {nightPhase === 'complete' && (
        <DialogueBox lines={sub(dialogue.ch2.ch2Complete, player.name)} speak={speech.speak}
          speakerName="Everyone"
          onComplete={() => { speech.stop(); onComplete() }} />
      )}

      <div className="scene-label">Runa&apos;s Bedroom — Night</div>
    </BedroomNightScene>
  )
}
