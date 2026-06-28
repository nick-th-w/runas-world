import { useState } from 'react'
import DialogueBox from '../components/DialogueBox'
import { CHARACTERS } from '../characters'
import dialogue from '../data/dialogue.json'

function SunnyHillScene({ children, celebrate }) {
  return (
    <div className={`scene sunnyhill-scene ${celebrate ? 'celebrating' : ''}`}>
      <svg className="scene-bg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice"
        style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}>
        {/* sky */}
        <rect width="800" height="500" fill="#fef9c3" />
        {/* sun */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => (
          <line key={deg}
            x1={400 + Math.cos(deg*Math.PI/180)*60}
            y1={90 + Math.sin(deg*Math.PI/180)*60}
            x2={400 + Math.cos(deg*Math.PI/180)*90}
            y2={90 + Math.sin(deg*Math.PI/180)*90}
            stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
        ))}
        <circle cx="400" cy="90" r="55" fill="#fde047" stroke="#facc15" strokeWidth="3" />
        <circle cx="400" cy="90" r="40" fill="#fef08a" />
        {/* face on sun */}
        <circle cx="385" cy="82" r="5" fill="#d97706" />
        <circle cx="415" cy="82" r="5" fill="#d97706" />
        <path d="M380,100 Q400,115 420,100" stroke="#d97706" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* clouds */}
        <g opacity="0.85">
          <ellipse cx="120" cy="90" rx="50" ry="26" fill="#fff" />
          <ellipse cx="155" cy="78" rx="36" ry="24" fill="#fff" />
          <ellipse cx="88" cy="84" rx="32" ry="20" fill="#fff" />
        </g>
        <g opacity="0.85">
          <ellipse cx="660" cy="85" rx="50" ry="26" fill="#fff" />
          <ellipse cx="695" cy="73" rx="36" ry="24" fill="#fff" />
          <ellipse cx="628" cy="79" rx="32" ry="20" fill="#fff" />
        </g>
        {/* big sunny hill */}
        <path d="M0,500 Q400,150 800,500 Z" fill="#bbf7d0" />
        <path d="M0,500 Q400,200 800,500 Z" fill="#86efac" />
        <path d="M0,500 Q400,240 800,500 Z" fill="#4ade80" />
        {/* flowers on hill */}
        {[[200,380],[280,355],[360,340],[440,342],[520,356],[620,375],[700,390]].map(([x,y],i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            {[0,72,144,216,288].map((deg) => (
              <ellipse key={deg} cx="0" cy="-9" rx="4" ry="7"
                fill={['#f472b6','#c084fc','#fb923c','#facc15','#34d399'][i%5]}
                transform={`rotate(${deg})`} />
            ))}
            <circle r="5" fill="#fde047" />
          </g>
        ))}
        {/* Clover the bunny on hill */}
        <g transform="translate(460,290)">
          {/* ears */}
          <ellipse cx="-12" cy="-30" rx="8" ry="20" fill="#fce7f3" stroke="#e07090" strokeWidth="1.5" />
          <ellipse cx="12" cy="-30" rx="8" ry="20" fill="#fce7f3" stroke="#e07090" strokeWidth="1.5" />
          <ellipse cx="-12" cy="-30" rx="4.5" ry="14" fill="#fbcfe8" />
          <ellipse cx="12" cy="-30" rx="4.5" ry="14" fill="#fbcfe8" />
          {/* body */}
          <ellipse cx="0" cy="22" rx="22" ry="26" fill="#fce7f3" stroke="#e07090" strokeWidth="1.5" />
          <ellipse cx="0" cy="26" rx="14" ry="18" fill="#fbcfe8" opacity="0.6" />
          {/* head */}
          <circle cx="0" cy="-4" r="18" fill="#fce7f3" stroke="#e07090" strokeWidth="1.5" />
          {/* cheeks */}
          <circle cx="-9" cy="0" r="5" fill="#fbcfe8" opacity="0.8" />
          <circle cx="9" cy="0" r="5" fill="#fbcfe8" opacity="0.8" />
          {/* eyes */}
          <circle cx="-6" cy="-7" r="3.5" fill="#333" />
          <circle cx="6" cy="-7" r="3.5" fill="#333" />
          <circle cx="-4.5" cy="-8.5" r="1.2" fill="#fff" />
          <circle cx="7.5" cy="-8.5" r="1.2" fill="#fff" />
          {/* nose */}
          <ellipse cx="0" cy="-1" rx="2.5" ry="1.8" fill="#e07090" />
          {/* happy smile */}
          <path d="M-5,4 Q0,10 5,4" stroke="#e07090" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* name badge */}
          <text x="0" y="56" textAnchor="middle" fontSize="9" fill="#be185d" fontWeight="bold">Clover</text>
        </g>

        {/* celebration stars (shown when celebrating) */}
        {celebrate && [
          [100,100],[700,120],[200,200],[600,180],[350,80],[500,60],[150,300],[650,280],
          [80,380],[720,360],[400,420]
        ].map(([x,y],i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <text fontSize={20+i%12} fill={['#fbbf24','#f472b6','#a78bfa','#34d399','#fb923c'][i%5]}
              style={{ animation:`twinkle ${0.8+i*0.15}s infinite alternate` }}>★</text>
          </g>
        ))}
      </svg>
      {children}
    </div>
  )
}

export default function SunnyHill({ player, quest, speech, completeMain, onComplete }) {
  const [phase, setPhase] = useState('arrival') // arrival | delivery | open | celebrate

  const { Component } = CHARACTERS[player.character]
  const hasCrown = quest.rewards.includes('flowerCrown')

  const arrivalLines = dialogue.sunnyhill.arrival.map((l) => l.replace(/\[NAME\]/g, player.name))
  const deliveryLines = dialogue.sunnyhill.delivery.map((l) => l.replace(/\[NAME\]/g, player.name))
  const celebrationLines = dialogue.sunnyhill.celebration.map((l) => l.replace(/\[NAME\]/g, player.name))

  const handleDeliveryComplete = () => {
    completeMain()
    setPhase('celebrate')
  }

  return (
    <SunnyHillScene celebrate={phase === 'celebrate'}>
      {/* player character bottom-left */}
      <div style={{ position:'absolute', bottom:'8%', left:'6%' }}>
        <Component size={100} hasCrown={hasCrown} />
        <div className="name-tag">{player.name}</div>
      </div>

      {/* letter (shown until delivered) */}
      {(phase === 'arrival' || phase === 'delivery') && (
        <div style={{ position:'absolute', bottom:'16%', left:'14%' }}>
          <svg viewBox="0 0 50 36" width="50" height="36">
            <rect width="50" height="36" rx="4" fill="#fef9c3" stroke="#d97706" strokeWidth="2" />
            <path d="M0,0 L25,18 L50,0" stroke="#d97706" strokeWidth="2" fill="none" />
          </svg>
        </div>
      )}

      {/* open letter with drawing (shown during celebration) */}
      {phase === 'celebrate' && (
        <div style={{ position:'absolute', bottom:'18%', right:'18%' }}>
          <svg viewBox="0 0 80 70" width="110" height="96">
            <rect width="80" height="70" rx="5" fill="#fef9c3" stroke="#d97706" strokeWidth="2" />
            {/* drawing inside letter */}
            <circle cx="28" cy="30" r="10" fill="#fce7f3" stroke="#e07090" strokeWidth="1.5" />
            <ellipse cx="28" cy="48" rx="10" ry="12" fill="#fce7f3" stroke="#e07090" strokeWidth="1.5" />
            <circle cx="52" cy="32" r="8" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
            <ellipse cx="52" cy="48" rx="9" ry="10" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
            <path d="M15,62 Q40,56 65,62" stroke="#e07090" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <text x="40" y="18" textAnchor="middle" fontSize="7" fill="#be185d">friends!</text>
          </svg>
        </div>
      )}

      {phase === 'arrival' && (
        <DialogueBox lines={arrivalLines} speak={speech.speak}
          speakerName="Bea the Bee" onComplete={() => setPhase('delivery')} />
      )}

      {phase === 'delivery' && (
        <DialogueBox lines={deliveryLines} speak={speech.speak}
          speakerName="Clover" onComplete={handleDeliveryComplete} />
      )}

      {phase === 'celebrate' && (
        <DialogueBox lines={celebrationLines} speak={speech.speak}
          speakerName="Everyone"
          onComplete={() => { speech.stop(); onComplete() }} />
      )}

      {/* badges earned */}
      {quest.rewards.length > 0 && phase === 'celebrate' && (
        <div className="rewards-preview">
          {quest.rewards.includes('kindHeart') && <span title="Kind Heart">💜</span>}
          {quest.rewards.includes('sharpEyes') && <span title="Sharp Eyes">👁️</span>}
          {quest.rewards.includes('flowerSticker') && <span title="Flower Sticker">🌸</span>}
          {quest.rewards.includes('flowerCrown') && <span title="Flower Crown">👑</span>}
        </div>
      )}

      {/* scene label now in GameToolbar */}
    </SunnyHillScene>
  )
}
