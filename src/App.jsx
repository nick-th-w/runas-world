import { useState } from 'react'
import CharacterSelect from './components/CharacterSelect'
import WorldMap from './components/WorldMap'
import StickerBook from './components/StickerBook'
import Meadow from './scenes/Meadow'
import Forest from './scenes/Forest'
import SunnyHill from './scenes/SunnyHill'
import { useQuest } from './hooks/useQuest'
import { useSpeech } from './hooks/useSpeech'

export default function App() {
  const [screen, setScreen] = useState('select') // select | map | game | book
  const [player, setPlayer] = useState({ name: 'Runa', character: 'capybara' })
  const { quest, advance, completeSideQuest, completeMain, resetChapter } = useQuest()
  const speech = useSpeech()

  const handlePlayChapter = (chapterId) => {
    if (chapterId === 1 && quest.chaptersCompleted[0]) resetChapter()
    setScreen('game')
  }

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
        />
      )}

      {screen === 'game' && quest.phase === 'meadow' && (
        <Meadow {...sharedProps} onLeave={() => {}} />
      )}

      {screen === 'game' && quest.phase === 'forest' && (
        <Forest {...sharedProps} onLeave={() => {}} />
      )}

      {screen === 'game' && quest.phase === 'sunnyhill' && (
        <SunnyHill
          {...sharedProps}
          completeMain={completeMain}
          onComplete={() => setScreen('map')}
        />
      )}

      {screen === 'book' && (
        <StickerBook quest={quest} playerName={player.name} onBack={() => setScreen('map')} />
      )}
    </div>
  )
}
