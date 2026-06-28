import { useState } from 'react'
import { CHARACTERS } from '../characters'

const ANIMALS = ['capybara', 'rabbit', 'bird', 'whale']

export default function CharacterModal({ current, playerName, onConfirm, onClose }) {
  const [selected, setSelected] = useState(current)

  return (
    <div className="char-modal-overlay" onClick={onClose}>
      <div className="char-modal" onClick={(e) => e.stopPropagation()}>
        <button className="char-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="char-modal-title">Change Character</h2>
        <p className="char-modal-sub">
          Your new character will appear from the next chapter you play
        </p>

        <div className="char-modal-grid">
          {ANIMALS.map((id) => {
            const { Component, label, color } = CHARACTERS[id]
            return (
              <button
                key={id}
                className={`animal-card ${selected === id ? 'selected' : ''}`}
                style={{ '--animal-color': color }}
                onClick={() => setSelected(id)}
                aria-label={`Choose ${label}`}
              >
                <Component size={64} />
                <span className="animal-label">{label}</span>
                {id === current && <span className="current-badge">current</span>}
              </button>
            )
          })}
        </div>

        <button
          className="btn-primary"
          onClick={() => onConfirm(selected)}
        >
          {selected === current
            ? `Keep ${playerName} ✓`
            : `Switch ${playerName} to ${CHARACTERS[selected].label}!`}
        </button>
      </div>
    </div>
  )
}
