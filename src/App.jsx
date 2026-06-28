import { useState } from 'react'
import CharacterSelect from './components/CharacterSelect'
import WorldMap from './components/WorldMap'
import StickerBook from './components/StickerBook'
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
  const [screen, setScreen] = useState('select') // select | map | game | book
  const [player, setPlayer] = useState({ name: 'Runa', character: 'capybara' })
  const { quest, advance, completeSideQuest, completeMain, resetChapter, addReward, unlockPenalty } = useQuest()
  const speech = useSpeech()

  const handlePlayChapter = (chapterId) => {
    if (chapterId === 1 && quest.chaptersCompleted[0]) resetChapter()
    setScreen('game')
  }

  const goMap = () => { speech.stop(); setScreen('map') }

  const sharedProps = { player, quest, speech, advance, completeSideQuest }

  return (
    <div className="app">
      {screen === 'select' && (
        <CharacterSelect onStart={(p) => { setPlayer(p); setScreen('map') }} />
      )}

      {screen === 'map' && (
        <WorldMap
          quest={quest}
          onPlayChapter={handlePlayChapter}
          onStickerBook={() => setScreen('book')}
          onPenalty={() => { unlockPenalty(); setScreen('penalty') }}
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
                onComplete={() => setScreen('map')}
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
    </div>
  )
}
