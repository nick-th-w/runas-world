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

// ── Trial stone helpers ───────────────────────────────────────────────────────

function StoneGem({ color, size = 18 }) {
  return (
    <svg width={size} height={Math.round(size * 1.3)} viewBox="0 0 20 26"
      style={{ display:'block', filter:`drop-shadow(0 0 3px ${color})` }}>
      <polygon points="10,2 19,10 10,24 1,10" fill={color} />
      <polygon points="10,2 19,10 10,10 1,10" fill="rgba(255,255,255,0.38)" />
      <circle cx="10" cy="14" r="2.5" fill="rgba(255,255,255,0.28)" />
    </svg>
  )
}

const STONE_COLORS = ['#f472b6','#60a5fa','#a78bfa','#fbbf24','#fbbf24','#34d399']

function CollectedStones({ quest }) {
  const gems = []
  if (quest.ch2LilyPads)    gems.push(STONE_COLORS[0])
  if (quest.ch2BabyFish)    gems.push(STONE_COLORS[1])
  if (quest.ch2FallingTeeth) gems.push(STONE_COLORS[2])
  if (quest.ch2FairyRing)   { gems.push(STONE_COLORS[3]); gems.push(STONE_COLORS[4]) }
  if (quest.ch2MiniBoss)    gems.push(STONE_COLORS[5])
  if (gems.length === 0) return null
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:3, maxWidth:72, marginTop:4 }}>
      {gems.map((color, i) => <StoneGem key={i} color={color} size={18} />)}
    </div>
  )
}

// Pulsing stone orb placed inside a scene SVG — represents an uncollected trial stone
function SceneStoneOrb({ x, y, color, visible }) {
  if (!visible) return null
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="0" cy="0" r="18" fill={color} opacity="0.18">
        <animate attributeName="r" values="14;22;14" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.3;0.12" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="0" cy="0" r="9" fill={color} stroke="rgba(255,255,255,0.55)" strokeWidth="1.5">
        <animate attributeName="r" values="7;10;7" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <text x="0" y="4" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.9)">✦</text>
    </g>
  )
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

function LakeshoreScene({ children, stone1Collected = false }) {
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
          </g>
        ))}
        {/* trial stone 1 — on the centre lily pad */}
        <SceneStoneOrb x={380} y={278} color={STONE_COLORS[0]} visible={!stone1Collected} />
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

function LakeShallowsScene({ children, stone2Collected = false, stone3Collected = false }) {
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
        {/* trial stone 2 — baby fish */}
        <SceneStoneOrb x={290} y={115} color={STONE_COLORS[1]} visible={!stone2Collected} />
        {/* trial stone 3 — falling teeth */}
        <SceneStoneOrb x={510} y={115} color={STONE_COLORS[2]} visible={!stone3Collected} />
      </svg>
      {children}
    </div>
  )
}

function DeepLakeScene({ children, fairyRingCollected = false, miniBossCollected = false }) {
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
        {/* trial stones 4+5 — fairy ring (two orbs near ring centre) */}
        <SceneStoneOrb x={375} y={290} color={STONE_COLORS[3]} visible={!fairyRingCollected} />
        <SceneStoneOrb x={425} y={310} color={STONE_COLORS[4]} visible={!fairyRingCollected} />
        {/* trial stone 6 — lake spirit (above the ring) */}
        <SceneStoneOrb x={400} y={175} color={STONE_COLORS[5]} visible={!miniBossCollected} />
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

// ── Find the Fish scene ───────────────────────────────────────────────────────

const FISH_DATA = [
  { id:0, x:196, y:298, color:'#f87171', dir:1,  scale:1.0 },  // porthole
  { id:1, x:68,  y:348, color:'#4ade80', dir:-1, scale:0.85 }, // left seaweed
  { id:2, x:318, y:230, color:'#c4b5fd', dir:1,  scale:0.9 },  // ship mast area
  { id:3, x:648, y:398, color:'#fb923c', dir:-1, scale:0.8 },  // near octopus
  { id:4, x:716, y:88,  color:'#fde047', dir:1,  scale:0.75 }, // top right
  { id:5, x:438, y:452, color:'#60a5fa', dir:-1, scale:0.8 },  // bottom rocks
  { id:6, x:558, y:162, color:'#f472b6', dir:1,  scale:0.85 }, // jellyfish area
  { id:7, x:748, y:268, color:'#fdba74', dir:-1, scale:0.9 },  // near seahorse
  { id:8, x:222, y:418, color:'#818cf8', dir:1,  scale:0.75 }, // under anchor
  { id:9, x:386, y:305, color:'#34d399', dir:-1, scale:0.85 }, // ship debris
]

function FishShape({ x, y, color, dir, scale, found, jiggling, onClick }) {
  const s = scale * (found ? 1 : 1)
  return (
    <g transform={`translate(${x},${y})`}>
      <g
        transform={`scale(${dir * s},${s})`}
        onClick={onClick}
        className={jiggling ? 'fish-jiggle' : ''}
        style={{ cursor: found ? 'default' : 'pointer' }}
      >
        {found && <ellipse cx="0" cy="0" rx="28" ry="20" fill="#4ade80" opacity="0.45" />}
        <ellipse cx="0" cy="0" rx="22" ry="12" fill={color} />
        <ellipse cx="0" cy="0" rx="22" ry="12" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
        <path d="M-18,0 L-30,-11 L-30,11 Z" fill={color} opacity="0.85" />
        <circle cx="12" cy="-3" r="3.5" fill="#fff" />
        <circle cx="12" cy="-3" r="1.8" fill="#1a1a1a" />
        {found && <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">✓</text>}
        {/* large transparent tap target */}
        <rect x="-34" y="-22" width="68" height="44" fill="transparent" />
      </g>
    </g>
  )
}

function FindTheFishScene({ playerName, onComplete }) {
  const [foundFish, setFoundFish] = useState(new Set())
  const [jigglingFish, setJigglingFish] = useState(new Set())
  const [showCelebration, setShowCelebration] = useState(false)

  const tapFish = (id) => {
    if (foundFish.has(id)) return
    setJigglingFish(s => new Set([...s, id]))
    setTimeout(() => setJigglingFish(s => { const n = new Set(s); n.delete(id); return n }), 700)
    const newFound = new Set([...foundFish, id])
    setFoundFish(newFound)
    if (newFound.size === 10) setTimeout(() => setShowCelebration(true), 900)
  }

  if (showCelebration) {
    return (
      <LakeShallowsScene>
        <div className="find-fish-celebrate">
          <div style={{ fontSize: '4rem' }}>🎉🐟🎉</div>
          <h2 style={{ color: '#fde047', fontSize: 'clamp(1.8rem,5vw,2.6rem)', fontWeight: 'bold' }}>
            Amazing! You found all 10 fish!
          </h2>
          <p style={{ color: '#fff', fontSize: '1.1rem' }}>
            The baby fish are so happy, {playerName}!
          </p>
          <button className="btn-primary" onClick={onComplete}>Collect Stone 2 →</button>
        </div>
      </LakeShallowsScene>
    )
  }

  return (
    <div className="find-fish-screen">
      <div className="find-fish-counter">{foundFish.size} / 10 🐟</div>
      {foundFish.size === 0 && (
        <div className="find-fish-hint">Tap every fish you can find!</div>
      )}

      <svg
        viewBox="0 0 800 500"
        width="100%" height="100%"
        style={{ display: 'block', touchAction: 'manipulation' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ffSeaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c3d6e" />
            <stop offset="60%" stopColor="#0e4f7a" />
            <stop offset="100%" stopColor="#0a3352" />
          </linearGradient>
          <radialGradient id="ffLightRay" cx="50%" cy="0%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
          </radialGradient>
          <filter id="ffGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Ocean background */}
        <rect width="800" height="500" fill="url(#ffSeaGrad)" />
        <rect width="800" height="500" fill="url(#ffLightRay)" />

        {/* Light rays */}
        {[150,280,400,520,650].map((x,i) => (
          <path key={i} d={`M${x},0 L${x-30},500 L${x+30},500 Z`}
            fill="#a5f3fc" opacity="0.025" />
        ))}

        {/* Bubbles */}
        {[[80,380,4],[130,290,3],[420,310,5],[600,200,3],[700,350,4],[360,140,3],[550,400,4],[200,180,3]].map(([x,y,r],i)=>(
          <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="#93c5fd" strokeWidth="1.2" opacity="0.35" />
        ))}

        {/* Sandy bottom */}
        <path d="M0,460 Q200,445 400,455 Q600,465 800,450 L800,500 L0,500 Z" fill="#d4a96a" opacity="0.7" />
        <path d="M0,475 Q200,465 400,470 Q600,475 800,465 L800,500 L0,500 Z" fill="#c8943f" opacity="0.5" />

        {/* Rocks */}
        {[[380,462,22,14],[415,468,16,10],[460,465,20,12],[180,470,18,11],[580,460,24,14]].map(([x,y,rx,ry],i)=>(
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={['#6b7280','#9ca3af','#4b5563','#9ca3af','#6b7280'][i]} />
        ))}

        {/* ── Sunken Pirate Ship (center-left, tilted ~-8deg) ── */}
        <g transform="translate(190,170) rotate(-8)">
          {/* hull */}
          <path d="M-95,60 Q-100,120 -80,160 L80,160 Q100,120 95,60 Z"
            fill="#5c3d1e" stroke="#3b2410" strokeWidth="3" />
          {/* hull planks */}
          {[-40,-10,20,50,80].map((y,i)=>(
            <line key={i} x1="-90" y1={y+60} x2="90" y2={y+60}
              stroke="#3b2410" strokeWidth="1.5" opacity="0.4" />
          ))}
          {/* deck */}
          <rect x="-95" y="55" width="190" height="14" rx="4" fill="#7c4f25" stroke="#3b2410" strokeWidth="2" />
          {/* mast (broken) */}
          <rect x="-8" y="-70" width="16" height="130" rx="4" fill="#6b4226" stroke="#3b2410" strokeWidth="2" />
          <rect x="-8" y="-70" width="16" height="65" rx="4" fill="#5c3317" />
          {/* broken mast top */}
          <line x1="4" y1="-5" x2="70" y2="20" stroke="#6b4226" strokeWidth="10" strokeLinecap="round" />
          {/* torn sail */}
          <path d="M-6,-65 Q30,-50 25,-10 Q10,-8 -6,-5 Z"
            fill="#d4c5a9" stroke="#a89880" strokeWidth="1.5" opacity="0.8" />
          <path d="M-6,-65 Q-20,-55 -24,-30 Q-10,-20 -6,-5 Z"
            fill="#c9b898" stroke="#a89880" strokeWidth="1.5" opacity="0.6" />
          {/* portholes */}
          {[[-55,90],[-20,90],[20,90],[55,90]].map(([px,py],i)=>(
            <g key={i}>
              <circle cx={px} cy={py} r="14" fill="#1e3a5f" stroke="#3b2410" strokeWidth="2.5" />
              <circle cx={px} cy={py} r="10" fill="#1a2f4a" />
              <circle cx={px} cy={py} r="10" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.4" />
            </g>
          ))}
          {/* anchor */}
          <line x1="55" y1="155" x2="55" y2="210" stroke="#6b7280" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="55" cy="218" rx="14" ry="5" fill="none" stroke="#6b7280" strokeWidth="3.5" />
          <line x1="41" y1="210" x2="69" y2="210" stroke="#6b7280" strokeWidth="3.5" strokeLinecap="round" />
          {/* seaweed on hull */}
          {[[-75,140],[-35,150],[50,145]].map(([sx,sy],i)=>(
            <path key={i} d={`M${sx},${sy} Q${sx+10},${sy-20} ${sx},${sy-38} Q${sx-10},${sy-55} ${sx},${sy-68}`}
              stroke="#16a34a" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.8" />
          ))}
          {/* barnacles */}
          {[[-60,100],[-25,115],[30,105],[60,110],[-80,130]].map(([bx,by],i)=>(
            <ellipse key={i} cx={bx} cy={by} rx="5" ry="3" fill="#9ca3af" opacity="0.6" />
          ))}
          {/* treasure chest near ship */}
          <g transform="translate(115,145)">
            <rect x="0" y="0" width="32" height="24" rx="3" fill="#92400e" stroke="#78350f" strokeWidth="2" />
            <rect x="0" y="0" width="32" height="12" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <rect x="11" y="8" width="10" height="10" rx="2" fill="#fbbf24" />
            <line x1="0" y1="12" x2="32" y2="12" stroke="#78350f" strokeWidth="1.5" />
          </g>
          {/* skull & crossbones flag */}
          <g transform="translate(-5,-80)">
            <rect x="0" y="0" width="28" height="20" rx="2" fill="#1a1a1a" />
            <circle cx="14" cy="8" r="5" fill="#f9fafb" />
            <line x1="8" y1="14" x2="20" y2="14" stroke="#f9fafb" strokeWidth="1.5" />
            <line x1="10" y1="12" x2="18" y2="16" stroke="#f9fafb" strokeWidth="1.2" />
            <line x1="18" y1="12" x2="10" y2="16" stroke="#f9fafb" strokeWidth="1.2" />
          </g>
        </g>

        {/* ── Seaweed clusters ── */}
        {/* Left cluster */}
        {[[40,470],[60,465],[80,468],[50,465]].map(([sx,sy],i)=>(
          <path key={`swL${i}`} d={`M${sx},${sy} Q${sx+(i%2?8:-8)},${sy-35} ${sx},${sy-65} Q${sx+(i%2?-8:8)},${sy-90} ${sx},${sy-115}`}
            stroke={['#16a34a','#22c55e','#15803d','#4ade80'][i]} strokeWidth={3+i%2}
            fill="none" strokeLinecap="round" opacity="0.9" />
        ))}
        {/* Right cluster */}
        {[[720,470],[740,465],[760,468],[730,462]].map(([sx,sy],i)=>(
          <path key={`swR${i}`} d={`M${sx},${sy} Q${sx+(i%2?9:-9)},${sy-40} ${sx},${sy-75} Q${sx+(i%2?-9:9)},${sy-105} ${sx},${sy-130}`}
            stroke={['#16a34a','#22c55e','#15803d','#4ade80'][i]} strokeWidth={3+i%2}
            fill="none" strokeLinecap="round" opacity="0.9" />
        ))}
        {/* Center-right cluster */}
        {[[500,475],[520,470],[510,472]].map(([sx,sy],i)=>(
          <path key={`swC${i}`} d={`M${sx},${sy} Q${sx+(i%2?7:-7)},${sy-30} ${sx},${sy-55} Q${sx+(i%2?-7:7)},${sy-78} ${sx},${sy-95}`}
            stroke={['#15803d','#22c55e','#4ade80'][i]} strokeWidth="3"
            fill="none" strokeLinecap="round" opacity="0.85" />
        ))}
        {/* Near ship extra fronds */}
        {[[90,470],[115,465]].map(([sx,sy],i)=>(
          <path key={`swS${i}`} d={`M${sx},${sy} Q${sx+6},${sy-28} ${sx},${sy-50} Q${sx-6},${sy-68} ${sx},${sy-82}`}
            stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
        ))}

        {/* ── Sea creatures ── */}

        {/* Octopus - bottom right */}
        <g transform="translate(660,405)">
          {[-30,-15,0,15,30,-22,8,22].map((ox,i)=>(
            <path key={i} d={`M${ox},0 Q${ox+(i%2?10:-10)},20 ${ox+(i%3?-5:5)},38`}
              stroke="#a78bfa" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ))}
          <ellipse cx="0" cy="-8" rx="28" ry="22" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2" />
          <ellipse cx="-10" cy="-12" rx="5" ry="5.5" fill="#1a1a1a" />
          <ellipse cx="10" cy="-12" rx="5" ry="5.5" fill="#1a1a1a" />
          <circle cx="-9" cy="-13" r="2.5" fill="#fff" />
          <circle cx="11" cy="-13" r="2.5" fill="#fff" />
          <path d="M-8,-2 Q0,4 8,-2" stroke="#fff" strokeWidth="1.5" fill="none" />
        </g>

        {/* Crab - bottom left near ship */}
        <g transform="translate(120,455)">
          {/* legs */}
          {[[-30,-8],[-20,-4],[-15,4],[-8,8],[8,8],[15,4],[20,-4],[30,-8]].map(([lx,ly],i)=>(
            <line key={i} x1={lx>0?14:-14} y1="0" x2={lx} y2={ly}
              stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          ))}
          <ellipse cx="0" cy="0" rx="18" ry="11" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
          <ellipse cx="-7" cy="-4" rx="4" ry="4" fill="#1a1a1a" />
          <ellipse cx="7" cy="-4" rx="4" ry="4" fill="#1a1a1a" />
          {/* claws */}
          <path d="M-14,-5 Q-26,-10 -28,-4 Q-26,2 -18,0" fill="#dc2626" stroke="#b91c1c" strokeWidth="1.5" />
          <path d="M14,-5 Q26,-10 28,-4 Q26,2 18,0" fill="#dc2626" stroke="#b91c1c" strokeWidth="1.5" />
        </g>

        {/* Starfish on ship hull */}
        <g transform="translate(152,308) rotate(20)">
          {[0,72,144,216,288].map((deg,i)=>(
            <ellipse key={i} cx={Math.cos(deg*Math.PI/180)*16} cy={Math.sin(deg*Math.PI/180)*16}
              rx="6" ry="14"
              fill="#fb923c" stroke="#ea580c" strokeWidth="1"
              transform={`rotate(${deg},${Math.cos(deg*Math.PI/180)*16},${Math.sin(deg*Math.PI/180)*16})`} />
          ))}
          <circle cx="0" cy="0" r="6" fill="#fbbf24" />
        </g>

        {/* Jellyfish 1 - upper center-right */}
        <g transform="translate(540,130)">
          {[-20,-10,0,10,20,-14,14].map((jx,i)=>(
            <path key={i} d={`M${jx},18 Q${jx+(i%2?8:-8)},40 ${jx+(i%3?-4:4)},62`}
              stroke="#f9a8d4" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
          ))}
          <path d="M-32,0 Q-30,-28 0,-32 Q30,-28 32,0 Z" fill="#fbcfe8" stroke="#f9a8d4" strokeWidth="1.5" opacity="0.85" />
          <ellipse cx="0" cy="-8" rx="20" ry="14" fill="#fce7f3" opacity="0.5" />
        </g>

        {/* Jellyfish 2 - upper left */}
        <g transform="translate(140,100)">
          {[-14,-6,0,6,14].map((jx,i)=>(
            <path key={i} d={`M${jx},14 Q${jx+(i%2?6:-6)},30 ${jx+(i%2?-3:3)},46`}
              stroke="#c4b5fd" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.65" />
          ))}
          <path d="M-22,0 Q-20,-20 0,-22 Q20,-20 22,0 Z" fill="#ddd6fe" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.8" />
        </g>

        {/* Seahorse - right side */}
        <g transform="translate(755,240)">
          <path d="M0,0 Q10,-10 5,-25 Q-5,-38 0,-50 Q8,-60 4,-72"
            stroke="#fbbf24" strokeWidth="7" fill="none" strokeLinecap="round" />
          <circle cx="0" cy="-72" r="10" fill="#fde047" stroke="#d97706" strokeWidth="1.5" />
          <circle cx="4" cy="-76" r="3" fill="#1a1a1a" />
          <path d="M0,-72 L14,-68" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          {/* fins */}
          <path d="M5,-30 Q16,-25 14,-18 Q8,-14 5,-20 Z" fill="#fde047" opacity="0.7" />
          <path d="M0,0 Q-14,8 -12,18 Q-4,20 0,14 Z" fill="#fde047" opacity="0.6" />
        </g>

        {/* Turtle - center */}
        <g transform="translate(470,350)">
          <ellipse cx="0" cy="0" rx="26" ry="20" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
          {/* shell pattern */}
          <ellipse cx="0" cy="0" rx="18" ry="14" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
          {[[-6,-5],[6,-5],[0,5]].map(([hx,hy],i)=>(
            <line key={i} x1="0" y1="0" x2={hx} y2={hy} stroke="#15803d" strokeWidth="1.5" />
          ))}
          {/* head */}
          <circle cx="28" cy="0" r="9" fill="#16a34a" stroke="#15803d" strokeWidth="1.5" />
          <circle cx="31" cy="-3" r="2.5" fill="#1a1a1a" />
          {/* flippers */}
          <ellipse cx="-8" cy="-22" rx="8" ry="14" fill="#16a34a" transform="rotate(-30,-8,-22)" />
          <ellipse cx="8" cy="-22" rx="8" ry="14" fill="#16a34a" transform="rotate(30,8,-22)" />
          <ellipse cx="-8" cy="22" rx="8" ry="14" fill="#16a34a" transform="rotate(30,-8,22)" />
          <ellipse cx="8" cy="22" rx="8" ry="14" fill="#16a34a" transform="rotate(-30,8,22)" />
        </g>

        {/* Clam - bottom center */}
        <g transform="translate(490,460)">
          <ellipse cx="0" cy="0" rx="20" ry="12" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
          <path d="M-20,0 Q0,-16 20,0" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
          <ellipse cx="0" cy="-4" rx="4" ry="4" fill="#f472b6" />
        </g>

        {/* ── 10 hidden fish ── */}
        {FISH_DATA.map(f => (
          <FishShape
            key={f.id}
            {...f}
            found={foundFish.has(f.id)}
            jiggling={jigglingFish.has(f.id)}
            onClick={() => tapFish(f.id)}
          />
        ))}
      </svg>
    </div>
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
      <LakeshoreScene stone1Collected={quest.ch2LilyPads}>
        <div style={{ position:'absolute', bottom:'6%', left:'6%' }}>
          <Component size={90} hasCrown={false} />
          <CollectedStones quest={quest} />
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

  // ── Quest: Baby Fish — Find the Fish scene ──
  if (subPhase === 'baby-fish-puzzle') {
    return (
      <FindTheFishScene
        playerName={player.name}
        onComplete={() => {
          completeSideQuest('ch2BabyFish', 'ch2FishBadge', 'gold')
          advance('baby-fish-success')
        }}
      />
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
      <LakeShallowsScene stone2Collected={quest.ch2BabyFish} stone3Collected={quest.ch2FallingTeeth}>
        <div style={{ position:'absolute', bottom:'6%', left:'6%' }}>
          <Component size={90} hasCrown={false} />
          <CollectedStones quest={quest} />
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
      <DeepLakeScene fairyRingCollected={quest.ch2FairyRing} miniBossCollected={quest.ch2MiniBoss}>
        <div style={{ position:'absolute', bottom:'6%', left:'6%' }}>
          <Component size={90} hasCrown={false} />
          <CollectedStones quest={quest} />
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
