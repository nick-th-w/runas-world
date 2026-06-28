import { useState } from 'react'

export default function CloudSaveModal({ pin, onLoad, onForceSave, onClose }) {
  const [inputPin, setInputPin] = useState('')
  const [status, setStatus] = useState(null) // null | { ok, message }
  const [loading, setLoading] = useState(false)

  const handleLoad = async () => {
    if (inputPin.length !== 4) return
    setLoading(true)
    setStatus(null)
    const result = await onLoad(inputPin)
    setStatus(result)
    setLoading(false)
  }

  const handleForceSave = async () => {
    setLoading(true)
    const result = await onForceSave()
    setStatus({ ok: result.ok, message: result.ok ? 'Saved to cloud! ✓' : 'Save failed.' })
    setLoading(false)
  }

  return (
    <div className="char-modal-overlay" onClick={onClose}>
      <div className="char-modal cloud-modal" onClick={e => e.stopPropagation()}>
        <button className="char-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="char-modal-title" style={{ color: '#60a5fa' }}>☁️ Cloud Save</h2>

        {/* Current PIN display */}
        <div className="cloud-pin-box">
          <p className="cloud-pin-label">Your save PIN</p>
          <div className="cloud-pin-display">{pin}</div>
          <p className="cloud-pin-hint">Write this down! Use it to load your progress on any device.</p>
        </div>

        {/* Force save */}
        <button className="btn-quest" onClick={handleForceSave} disabled={loading}>
          {loading ? '...' : '☁️ Save now'}
        </button>

        <div className="cloud-divider" />

        {/* Load from different PIN */}
        <p className="cloud-load-label">Load from a different device</p>
        <div className="cloud-load-row">
          <input
            className="name-input cloud-pin-input"
            type="number"
            maxLength={4}
            placeholder="Enter PIN"
            value={inputPin}
            onChange={e => setInputPin(e.target.value.slice(0, 4))}
          />
          <button className="btn-primary cloud-load-btn" onClick={handleLoad}
            disabled={loading || inputPin.length !== 4}>
            Load
          </button>
        </div>

        {status && (
          <p className={`cloud-status ${status.ok ? 'ok' : 'err'}`}>{status.message}</p>
        )}
      </div>
    </div>
  )
}
