export default function NewGameModal({ pin, onConfirm, onClose }) {
  return (
    <div className="char-modal-overlay" onClick={onClose}>
      <div className="char-modal" onClick={e => e.stopPropagation()}>
        <button className="char-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="char-modal-title" style={{ color: '#f97316' }}>Start a New Adventure?</h2>

        <div className="cloud-pin-box">
          <p className="cloud-pin-label">Your current progress is saved under PIN</p>
          <div className="cloud-pin-display">{pin}</div>
          <p className="cloud-pin-hint">
            Write this down! You can reload your old adventure anytime — tap ☁️ on the map and enter this PIN.
          </p>
        </div>

        <p style={{ fontSize:'0.92rem', color:'#6d3a1a', textAlign:'center', lineHeight:1.5 }}>
          Starting fresh picks a new character and creates a brand new PIN.
          Your old progress stays safe in the cloud.
        </p>

        <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
          <button className="btn-quest" style={{ background:'#f97316', color:'#fff', border:'3px solid #c2410c' }}
            onClick={onConfirm}>
            Yes, start fresh! ✨
          </button>
          <button className="btn-primary" onClick={onClose}>
            Keep playing
          </button>
        </div>
      </div>
    </div>
  )
}
