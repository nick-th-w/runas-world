import { useState, useEffect } from 'react'

export default function DialogueBox({ lines, onComplete, speak, speakerName }) {
  const [index, setIndex] = useState(0)

  // Reset and speak when lines array changes
  useEffect(() => {
    setIndex(0)
  }, [lines])

  useEffect(() => {
    if (lines[index]) speak(lines[index])
  }, [index, lines]) // eslint-disable-line react-hooks/exhaustive-deps

  const advance = () => {
    if (index < lines.length - 1) {
      setIndex((i) => i + 1)
    } else {
      onComplete?.()
    }
  }

  return (
    <div className="dialogue-overlay" onClick={advance}>
      <div className="dialogue-box">
        {speakerName && <div className="speaker-name">{speakerName}</div>}
        <p className="dialogue-text">{lines[index]}</p>
        <span className="dialogue-arrow">{index < lines.length - 1 ? '▶' : '✓'}</span>
      </div>
    </div>
  )
}
