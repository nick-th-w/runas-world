import { useState } from 'react'
import CharacterSelect from './components/CharacterSelect'
import WorldMap from './components/WorldMap'
import StickerBook from './components/StickerBook'
import CharacterModal from './components/CharacterModal'
import SollyPopup from './components/SollyPopup'
import Meadow from './scenes/Meadow'
import Forest from './scenes/Forest'
import SunnyHill from './scenes/SunnyHill'
import PenaltyShootout from './scenes/PenaltyShootout'
import { useQuest } from './hooks/useQuest'
import { useSpeech } from './hooks/useSpeech'

const SCENE_NAMES = {
  meadow:    'Cosy Meadow',
  forest:    'Whispering Forest',
  sunnyhill: 'Sunny Hill',
}

function GameToolbar({ quest, onMap, onBook }) {
  const { medalTotals, phase } = quest
  return (
    <div className="game-toolbar">
      <button className="toolbar-btn" onClick={onMap}>← Map</button>
      <div className="toolbar-center">
        <span className="toolbar-chapter">Ch 1 · The Lost Letter</span>
        <span className="toolbar-scene">{SCENE_NAMES[phase] || ''}</span>
      </div>
      <div className="toolbar-right">
        <span className="toolbar-medals">
          🥉{medalTotals.bronze}&nbsp;🥈{medalTotals.silver}&nbsp;🥇{medalTotals.gold}
        </span>
        <button className="toolbar-btn" onClick={onBook} title="Sticker Book">📖</button>
      </div>
    </div>
  )
}

export default function App() {
  const hasSavedPlayer = !!localStorage.getItem('runas-player')
  const [screen, setScreen] = useState(hasSavedPlayer ? 'map' : 'select')
  const [player, setPlayer] = useState(() => {
    try {
      const saved = localStorage.getItem('runas-player')
      return saved ? JSON.parse(saved) : { name: 'Runa', character: 'capybara' }
    } catch { return { name: 'Runa', character: 'capybara' } }
  })
  const [pendingCharacter, setPendingCharacter] = useState(null)
  const [showCharacterModal, setShowCharacterModal] = useState(false)
  const [showSollyPopup, setShowSollyPopup] = useState(false)
  const { quest, advance, completeSideQuest, completeMain, resetChapter, addReward, unlockPenalty } = useQuest()
  const speech = useSpeech()

  const handlePlayChapter = (chapterId) => {
    // Apply any pending character swap before starting the chapter
    if (pendingCharacter) {
      setPlayer((p) => {
        const next = { ...p, character: pendingCharacter }
        try { localStorage.setItem('runas-player', JSON.stringify(next)) } catch {}
        return next
      })
      setPendingCharacter(null)
    }
    if (chapterId === 1 && quest.chaptersCompleted[0]) resetChapter()
    setScreen('game')
  }

  const handleChapterComplete = () => {
    setScreen('map')
    setShowSollyPopup(true) // Solly appears first, then character modal
  }

  const handleCharacterConfirm = (newChar) => {
    // Only store as pending — applies when next chapter starts
    if (newChar !== player.character) {
      setPendingCharacter(newChar)
    } else {
      setPendingCharacter(null)
    }
    setShowCharacterModal(false)
  }

  const goMap = () => { speech.stop(); setScreen('map') }

  const sharedProps = { player, quest, speech, advance, completeSideQuest }

  return (
    <div className="app">
      {screen === 'select' && (
        <CharacterSelect onStart={(p) => {
        setPlayer(p)
        try { localStorage.setItem('runas-player', JSON.stringify(p)) } catch {}
        setScreen('map')
      }} />
      )}

      {screen === 'map' && (
        <WorldMap
          quest={quest}
          player={player}
          pendingCharacter={pendingCharacter}
          onPlayChapter={handlePlayChapter}
          onStickerBook={() => setScreen('book')}
          onPenalty={() => { unlockPenalty(); setScreen('penalty') }}
          onChangeCharacter={() => setShowCharacterModal(true)}
        />
      )}

      {screen === 'game' && (
        <div className="game-layout">
          <GameToolbar quest={quest} onMap={goMap} onBook={() => setScreen('book')} />
          <div className="game-content">
            {quest.phase === 'meadow' && (
              <Meadow {...sharedProps} onLeave={() => {}} />
            )}
            {quest.phase === 'forest' && (
              <Forest {...sharedProps} onLeave={() => {}} />
            )}
            {quest.phase === 'sunnyhill' && (
              <SunnyHill
                {...sharedProps}
                completeMain={completeMain}
                onComplete={handleChapterComplete}
              />
            )}
          </div>
        </div>
      )}

      {screen === 'penalty' && (
        <PenaltyShootout
          player={player}
          quest={quest}
          addReward={addReward}
          onComplete={() => setScreen('map')}
        />
      )}

      {screen === 'book' && (
        <StickerBook quest={quest} playerName={player.name} onBack={() => setScreen('map')} />
      )}

      {/* Solly popup fires first after chapter complete */}
      {showSollyPopup && (
        <SollyPopup
          playerName={player.name}
          onClose={() => { setShowSollyPopup(false); setShowCharacterModal(true) }}
        />
      )}

      {/* Character modal overlays whatever screen is showing */}
      {showCharacterModal && (
        <CharacterModal
          current={pendingCharacter ?? player.character}
          onConfirm={handleCharacterConfirm}
          onClose={() => setShowCharacterModal(false)}
        />
      )}
    </div>
  )
}
