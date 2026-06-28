import { useState } from 'react'
import CharacterSelect from './components/CharacterSelect'
import WorldMap from './components/WorldMap'
import StickerBook from './components/StickerBook'
import CharacterModal from './components/CharacterModal'
import CloudSaveModal from './components/CloudSaveModal'
import NewGameModal from './components/NewGameModal'
import SollyPopup from './components/SollyPopup'
import Meadow from './scenes/Meadow'
import Forest from './scenes/Forest'
import SunnyHill from './scenes/SunnyHill'
import Chapter2 from './scenes/Chapter2'
import PenaltyShootout from './scenes/PenaltyShootout'
import { useQuest, CH1_SCENES, CH2_SCENES } from './hooks/useQuest'
import { useCloudSave } from './hooks/useCloudSave'
import { useSpeech } from './hooks/useSpeech'
import chapters from './data/chapters.json'

// Navigatable scenes per chapter (no sub-quest phases)
const CH2_NAV_SCENES = ['bedroom-morning', 'village-path', 'lakeshore', 'lake-shallows', 'deep-lake']

const CH1_SCENE_NAMES = {
  meadow:    'Cosy Meadow',
  forest:    'Whispering Forest',
  sunnyhill: 'Sunny Hill',
}
const CH2_SCENE_NAMES = {
  'bedroom-morning': "Runa's Bedroom",
  'village-path':    'Village Path',
  'lakeshore':       'The Lakeshore',
  'lake-shallows':   'Lake Shallows',
  'deep-lake':       'Deep Lake',
  'bedroom-night':   "Runa's Bedroom",
}

function GameToolbar({ quest, onMap, onBook, onNavigate }) {
  const { medalTotals, phase, ch2Phase, currentChapter, maxCh1Phase, maxCh2Phase } = quest
  const ch = chapters[(currentChapter || 1) - 1]
  const isCh2 = currentChapter === 2
  const scenes = isCh2 ? CH2_NAV_SCENES : CH1_SCENES
  const curScene = isCh2 ? ch2Phase : phase
  const maxScene = isCh2 ? (maxCh2Phase || 'bedroom-morning') : (maxCh1Phase || 'meadow')
  const sceneName = isCh2 ? (CH2_SCENE_NAMES[ch2Phase] || '') : (CH1_SCENE_NAMES[phase] || '')

  // Nav only active when current scene is a navigatable (non-sub-quest) scene
  const isNavScene = scenes.includes(curScene)
  const curIdx = scenes.indexOf(curScene)
  const maxIdx = scenes.indexOf(maxScene)
  const canBack = isNavScene && curIdx > 0
  const canFwd  = isNavScene && curIdx < maxIdx

  const goBack = () => {
    if (!canBack) return
    onNavigate(scenes[curIdx - 1])
  }
  const goFwd = () => {
    if (!canFwd) return
    onNavigate(scenes[curIdx + 1])
  }

  return (
    <div className="game-toolbar">
      <button className="toolbar-btn" onClick={onMap}>← Map</button>
      <button className="toolbar-nav-btn" onClick={goBack} disabled={!canBack}
        aria-label="Previous scene">◀</button>
      <div className="toolbar-center">
        <span className="toolbar-chapter">Ch {currentChapter || 1} · {ch?.title}</span>
        <span className="toolbar-scene">{sceneName}</span>
      </div>
      <button className="toolbar-nav-btn" onClick={goFwd} disabled={!canFwd}
        aria-label="Next scene">▶</button>
      <div className="toolbar-right">
        <span className="toolbar-medals">
          🥉{medalTotals.bronze}&nbsp;🥈{medalTotals.silver}&nbsp;🥇{medalTotals.gold}
        </span>
        <button className="toolbar-btn" onClick={onBook} title="Sticker Book">📖</button>
      </div>
    </div>
  )
}

// Generate or load the 4-digit save PIN
function getOrCreatePin() {
  try {
    const p = JSON.parse(localStorage.getItem('runas-player') || '{}')
    if (p.pin) return p.pin
    const pin = String(Math.floor(1000 + Math.random() * 9000))
    localStorage.setItem('runas-player', JSON.stringify({ ...p, pin }))
    return pin
  } catch {
    return String(Math.floor(1000 + Math.random() * 9000))
  }
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
  const [pin] = useState(getOrCreatePin)
  const [pendingCharacter, setPendingCharacter] = useState(null)
  const [showCharacterModal, setShowCharacterModal] = useState(false)
  const [showSollyPopup, setShowSollyPopup] = useState(false)
  const [showCloudModal, setShowCloudModal] = useState(false)
  const [showNewGameModal, setShowNewGameModal] = useState(false)

  const handleConfirmNewGame = () => {
    // Clear all local progress — old PIN's cloud save stays intact
    try {
      localStorage.removeItem('runas-quest')
      localStorage.removeItem('runas-player')
    } catch {}
    window.location.reload() // fresh start → character select, new PIN generated
  }

  const { quest, advance, completeSideQuest, completeMain, resetChapter,
          addReward, unlockPenalty, startCh2, advanceCh2, completeCh2Main, resetAll } = useQuest()
  const speech = useSpeech()

  // Load state from cloud (furthest-ahead wins)
  const handleLoadState = ({ quest: q, player: p }) => {
    if (q) {
      // Apply loaded quest state — useQuest doesn't expose setState directly,
      // so we write to localStorage and reload
      try {
        localStorage.setItem('runas-quest', JSON.stringify(q))
        if (p) localStorage.setItem('runas-player', JSON.stringify({ ...p, pin }))
        window.location.reload()
      } catch {}
    }
  }

  const { loadFromCloud, forceSave } = useCloudSave({
    pin,
    questState: quest,
    playerState: player,
    onLoadState: handleLoadState,
  })

  const handlePlayChapter = (chapterId) => {
    if (pendingCharacter) {
      setPlayer(p => {
        const next = { ...p, character: pendingCharacter }
        try { localStorage.setItem('runas-player', JSON.stringify(next)) } catch {}
        return next
      })
      setPendingCharacter(null)
    }
    if (chapterId === 1) {
      if (quest.chaptersCompleted[0]) resetChapter()
      else advance({ currentChapter: 1 })
    } else if (chapterId === 2) {
      startCh2()
    }
    setScreen('game')
  }

  const handleChapterComplete = () => {
    setScreen('map')
    setShowSollyPopup(true)
  }

  const handleCharacterConfirm = (newChar) => {
    setPendingCharacter(newChar !== player.character ? newChar : null)
    setShowCharacterModal(false)
  }

  // Scene navigation from toolbar arrows
  const handleNavigate = (scene) => {
    speech.stop()
    if (quest.currentChapter === 2) advanceCh2({ ch2Phase: scene })
    else advance({ phase: scene })
  }

  const goMap = () => { speech.stop(); setScreen('map') }
  const sharedProps = { player, quest, speech, advance, completeSideQuest }

  return (
    <div className="app">
      {screen === 'select' && (
        <CharacterSelect onStart={p => {
          const withPin = { ...p, pin }
          setPlayer(withPin)
          try { localStorage.setItem('runas-player', JSON.stringify(withPin)) } catch {}
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
          onNewGame={() => setShowNewGameModal(true)}
          onCloudSave={() => setShowCloudModal(true)}
          pin={pin}
        />
      )}

      {screen === 'game' && (
        <div className="game-layout">
          <GameToolbar quest={quest} onMap={goMap}
            onBook={() => setScreen('book')} onNavigate={handleNavigate} />
          <div className="game-content">
            {(quest.currentChapter === 1 || !quest.currentChapter) && (
              <>
                {quest.phase === 'meadow' && <Meadow {...sharedProps} onLeave={() => {}} />}
                {quest.phase === 'forest' && <Forest {...sharedProps} onLeave={() => {}} />}
                {quest.phase === 'sunnyhill' && (
                  <SunnyHill {...sharedProps} completeMain={completeMain} onComplete={handleChapterComplete} />
                )}
              </>
            )}
            {quest.currentChapter === 2 && (
              <Chapter2
                player={player} quest={quest} speech={speech}
                advanceCh2={advanceCh2} completeSideQuest={completeSideQuest}
                completeMain={completeCh2Main} onComplete={handleChapterComplete}
              />
            )}
          </div>
        </div>
      )}

      {screen === 'penalty' && (
        <PenaltyShootout player={player} quest={quest}
          addReward={addReward} onComplete={() => setScreen('map')} />
      )}

      {screen === 'book' && (
        <StickerBook quest={quest} playerName={player.name} onBack={() => setScreen('map')} />
      )}

      {showSollyPopup && (
        <SollyPopup playerName={player.name}
          onClose={() => { setShowSollyPopup(false); setShowCharacterModal(true) }} />
      )}

      {showCharacterModal && (
        <CharacterModal current={pendingCharacter ?? player.character}
          playerName={player.name} onConfirm={handleCharacterConfirm}
          onClose={() => setShowCharacterModal(false)} />
      )}

      {showCloudModal && (
        <CloudSaveModal pin={pin} onLoad={loadFromCloud}
          onForceSave={forceSave} onClose={() => setShowCloudModal(false)} />
      )}

      {showNewGameModal && (
        <NewGameModal pin={pin}
          onConfirm={handleConfirmNewGame}
          onClose={() => setShowNewGameModal(false)} />
      )}
    </div>
  )
}
