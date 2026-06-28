import { useState } from 'react'
import CharacterSelect from './components/CharacterSelect'
import StickerBook from './components/StickerBook'
import Meadow from './scenes/Meadow'
import Forest from './scenes/Forest'
import SunnyHill from './scenes/SunnyHill'
import { useQuest } from './hooks/useQuest'
import { useSpeech } from './hooks/useSpeech'

export default function App() {
  const [screen, setScreen] = useState('select') // select | game | book
  const [player, setPlayer] = useState({ name: 'Runa', character: 'capybara' })
  const { quest, advance, completeSideQuest, completeMain } = useQuest()
  const speech = useSpeech()

  const sharedProps = { player, quest, speech, advance, completeSideQuest }

  return (
    <div className="app">
      {screen === 'select' && (
        <CharacterSelect onStart={(p) => { setPlayer(p); setScreen('game') }} />
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
          onComplete={() => setScreen('book')}
        />
      )}

      {screen === 'book' && (
        <>
          <StickerBook quest={quest} playerName={player.name} onBack={() => setScreen('game')} />
        </>
      )}
    </div>
  )
}
