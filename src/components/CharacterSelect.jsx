import { useState } from 'react'
import { CHARACTERS, Capybara, Rabbit, Whale, Bird } from '../characters'

const ANIMALS = ['capybara', 'rabbit', 'whale', 'bird']

export default function CharacterSelect({ onStart }) {
  const [character, setCharacter] = useState('capybara')
  const [name, setName] = useState('Runa')

  const handleStart = () => {
    if (name.trim()) onStart({ name: name.trim(), character })
  }

  return (
    <div className="screen character-select">
      <svg className="bg-doodles" aria-hidden="true" style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }}>
        <circle cx="5%" cy="15%" r="18" fill="#fbbf24" opacity="0.25" />
        <circle cx="93%" cy="20%" r="24" fill="#f472b6" opacity="0.2" />
        <circle cx="10%" cy="85%" r="30" fill="#34d399" opacity="0.2" />
        <circle cx="90%" cy="80%" r="20" fill="#818cf8" opacity="0.25" />
        <path d="M20,40 Q40,20 60,40 Q80,60 100,40" stroke="#fbbf24" strokeWidth="3" fill="none" opacity="0.3" />
        <path d="M1300,80 Q1350,50 1400,80 Q1450,110 1500,80" stroke="#f472b6" strokeWidth="3" fill="none" opacity="0.3" />
      </svg>

      <h1 className="game-title">Runa&apos;s World</h1>
      <p className="subtitle">Choose your animal friend!</p>

      <div className="animal-grid">
        {ANIMALS.map((id) => {
          const { Component, label, color } = CHARACTERS[id]
          return (
            <button
              key={id}
              className={`animal-card ${character === id ? 'selected' : ''}`}
              onClick={() => setCharacter(id)}
              style={{ '--animal-color': color }}
              aria-label={`Choose ${label}`}
            >
              <Component size={80} />
              <span className="animal-label">{label}</span>
            </button>
          )
        })}
      </div>

      <div className="name-row">
        <label className="name-label" htmlFor="animal-name">
          Give your {CHARACTERS[character].label} a name!
        </label>
        <input
          id="animal-name"
          className="name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={16}
          placeholder="Runa"
          autoComplete="off"
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleStart}
        disabled={!name.trim()}
      >
        Let&apos;s Go! 🌟
      </button>
    </div>
  )
}
