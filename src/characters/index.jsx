// All four animal characters as SVG components.
// Each accepts hasCrown (boolean) to show the flower crown reward.

function FlowerCrown() {
  return (
    <g>
      <path d="M30,8 Q37,0 44,8 Q51,0 58,8 Q65,0 72,8" stroke="#e879f9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="37" cy="6" r="4" fill="#fb923c" />
      <circle cx="51" cy="4" r="4" fill="#facc15" />
      <circle cx="65" cy="6" r="4" fill="#f472b6" />
      <circle cx="37" cy="6" r="2" fill="#fff" />
      <circle cx="51" cy="4" r="2" fill="#fff" />
      <circle cx="65" cy="6" r="2" fill="#fff" />
    </g>
  )
}

export function Capybara({ hasCrown, size = 110 }) {
  return (
    <svg viewBox="0 0 100 95" width={size} height={size * 0.95} aria-label="Capybara">
      {hasCrown && <FlowerCrown />}
      {/* body */}
      <ellipse cx="50" cy="65" rx="34" ry="22" fill="#c8956c" stroke="#8B5E3C" strokeWidth="2" />
      {/* head */}
      <ellipse cx="50" cy="38" rx="22" ry="19" fill="#c8956c" stroke="#8B5E3C" strokeWidth="2" />
      {/* ears */}
      <ellipse cx="32" cy="24" rx="7" ry="6" fill="#c8956c" stroke="#8B5E3C" strokeWidth="1.5" />
      <ellipse cx="68" cy="24" rx="7" ry="6" fill="#c8956c" stroke="#8B5E3C" strokeWidth="1.5" />
      {/* snout */}
      <ellipse cx="50" cy="44" rx="9" ry="6" fill="#a0714f" stroke="#8B5E3C" strokeWidth="1.5" />
      {/* nostrils */}
      <circle cx="47" cy="44" r="1.5" fill="#5a3820" />
      <circle cx="53" cy="44" r="1.5" fill="#5a3820" />
      {/* eyes */}
      <circle cx="42" cy="34" r="4" fill="#333" />
      <circle cx="58" cy="34" r="4" fill="#333" />
      <circle cx="43.5" cy="32.5" r="1.5" fill="#fff" />
      <circle cx="59.5" cy="32.5" r="1.5" fill="#fff" />
      {/* legs */}
      <rect x="18" y="78" width="13" height="11" rx="5" fill="#a0714f" stroke="#8B5E3C" strokeWidth="1.5" />
      <rect x="35" y="80" width="13" height="9" rx="5" fill="#a0714f" stroke="#8B5E3C" strokeWidth="1.5" />
      <rect x="52" y="80" width="13" height="9" rx="5" fill="#a0714f" stroke="#8B5E3C" strokeWidth="1.5" />
      <rect x="69" y="78" width="13" height="11" rx="5" fill="#a0714f" stroke="#8B5E3C" strokeWidth="1.5" />
    </svg>
  )
}

export function Rabbit({ hasCrown, size = 110 }) {
  return (
    <svg viewBox="0 0 100 105" width={size} height={size * 1.05} aria-label="Rabbit">
      {hasCrown && <FlowerCrown />}
      {/* ears */}
      <ellipse cx="36" cy="20" rx="9" ry="22" fill="#f9c0cb" stroke="#e07090" strokeWidth="2" />
      <ellipse cx="64" cy="20" rx="9" ry="22" fill="#f9c0cb" stroke="#e07090" strokeWidth="2" />
      <ellipse cx="36" cy="20" rx="5" ry="16" fill="#ffb3c1" />
      <ellipse cx="64" cy="20" rx="5" ry="16" fill="#ffb3c1" />
      {/* body */}
      <ellipse cx="50" cy="73" rx="28" ry="26" fill="#f9c0cb" stroke="#e07090" strokeWidth="2" />
      {/* head */}
      <circle cx="50" cy="46" r="20" fill="#f9c0cb" stroke="#e07090" strokeWidth="2" />
      {/* cheeks */}
      <circle cx="38" cy="50" r="6" fill="#ffb3c1" opacity="0.7" />
      <circle cx="62" cy="50" r="6" fill="#ffb3c1" opacity="0.7" />
      {/* eyes */}
      <circle cx="43" cy="42" r="4" fill="#333" />
      <circle cx="57" cy="42" r="4" fill="#333" />
      <circle cx="44.5" cy="40.5" r="1.5" fill="#fff" />
      <circle cx="58.5" cy="40.5" r="1.5" fill="#fff" />
      {/* nose */}
      <ellipse cx="50" cy="51" rx="3" ry="2" fill="#e07090" />
      {/* legs */}
      <ellipse cx="32" cy="91" rx="10" ry="8" fill="#f0b0be" stroke="#e07090" strokeWidth="1.5" />
      <ellipse cx="68" cy="91" rx="10" ry="8" fill="#f0b0be" stroke="#e07090" strokeWidth="1.5" />
    </svg>
  )
}

export function Whale({ hasCrown, size = 110 }) {
  return (
    <svg viewBox="0 0 120 90" width={size * 1.2} height={size * 0.9} aria-label="Whale">
      {hasCrown && <g transform="translate(10,0)"><FlowerCrown /></g>}
      {/* tail */}
      <path d="M90,55 Q110,40 115,30 Q105,45 115,55 Q110,68 90,58 Z" fill="#5b9bd5" stroke="#3a6fa0" strokeWidth="2" />
      {/* body */}
      <ellipse cx="52" cy="52" rx="50" ry="30" fill="#5b9bd5" stroke="#3a6fa0" strokeWidth="2" />
      {/* belly */}
      <ellipse cx="45" cy="60" rx="32" ry="14" fill="#a8d4f5" />
      {/* fin */}
      <path d="M35,30 Q28,10 48,25" fill="#4a8bc4" stroke="#3a6fa0" strokeWidth="1.5" />
      {/* eye */}
      <circle cx="20" cy="44" r="5" fill="#333" />
      <circle cx="21.5" cy="42.5" r="2" fill="#fff" />
      {/* mouth smile */}
      <path d="M10,52 Q18,60 28,54" stroke="#3a6fa0" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* blowhole */}
      <ellipse cx="40" cy="26" rx="5" ry="3" fill="#3a6fa0" />
      {/* water spout */}
      <path d="M38,23 Q35,12 40,8 Q45,12 42,23" fill="#a8d4f5" stroke="#5b9bd5" strokeWidth="1" />
    </svg>
  )
}

export function Bird({ hasCrown, size = 110 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label="Bird">
      {hasCrown && <FlowerCrown />}
      {/* tail feathers */}
      <path d="M72,62 Q88,70 90,82 Q80,74 72,72 Z" fill="#facc15" stroke="#d4a000" strokeWidth="1.5" />
      <path d="M70,68 Q82,80 80,90 Q72,80 68,75 Z" fill="#fbbf24" stroke="#d4a000" strokeWidth="1.5" />
      {/* body */}
      <ellipse cx="50" cy="65" rx="26" ry="22" fill="#facc15" stroke="#d4a000" strokeWidth="2" />
      {/* wing */}
      <path d="M58,55 Q76,45 80,60 Q70,58 58,68 Z" fill="#fbbf24" stroke="#d4a000" strokeWidth="1.5" />
      {/* head */}
      <circle cx="35" cy="42" r="18" fill="#facc15" stroke="#d4a000" strokeWidth="2" />
      {/* eye */}
      <circle cx="29" cy="38" r="5" fill="#333" />
      <circle cx="30.5" cy="36.5" r="2" fill="#fff" />
      {/* beak */}
      <path d="M18,43 L8,40 L18,47 Z" fill="#fb923c" stroke="#d4a000" strokeWidth="1" />
      {/* crest */}
      <path d="M32,26 Q28,16 35,12 Q40,18 44,14 Q42,22 38,26" fill="#fbbf24" stroke="#d4a000" strokeWidth="1.5" />
      {/* feet */}
      <path d="M40,84 L38,94 M40,84 L44,94 M40,84 L35,92" stroke="#d4a000" strokeWidth="2" strokeLinecap="round" />
      <path d="M58,84 L56,94 M58,84 L62,94 M58,84 L53,92" stroke="#d4a000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export const CHARACTERS = {
  capybara: { Component: Capybara, label: 'Capybara', color: '#c8956c' },
  rabbit:   { Component: Rabbit,   label: 'Rabbit',   color: '#f9c0cb' },
  whale:    { Component: Whale,    label: 'Whale',    color: '#5b9bd5' },
  bird:     { Component: Bird,     label: 'Bird',     color: '#facc15' },
}
